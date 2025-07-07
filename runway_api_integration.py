#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
🎬 Runway Gen-4 API統合モジュール
自動映像生成機能

GitHub: https://github.com/yusuke10151985/amvc
"""

import os
import json
import time
import requests
from typing import List, Dict, Optional
from pathlib import Path

class RunwayAPIClient:
    """Runway Gen-4 API クライアント"""
    
    def __init__(self, api_key: str):
        self.api_key = api_key
        self.base_url = "https://api.runway.com/v1"
        self.headers = {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json"
        }
    
    def generate_video_from_prompts(self, 
                                   prompts: List[str], 
                                   duration_per_scene: int = 4,
                                   style: str = "cinematic") -> List[str]:
        """
        プロンプトリストから複数の映像を生成
        
        Args:
            prompts: 映像生成プロンプトのリスト
            duration_per_scene: 各シーンの長さ（秒）
            style: 映像スタイル
            
        Returns:
            生成された映像ファイルのパスリスト
        """
        print(f"🎬 Runway Gen-4で {len(prompts)} 個のシーンを生成中...")
        
        video_paths = []
        
        for i, prompt in enumerate(prompts):
            print(f"📹 シーン {i+1}/{len(prompts)}: {prompt[:50]}...")
            
            try:
                video_path = self._generate_single_video(
                    prompt=prompt,
                    duration=duration_per_scene,
                    style=style,
                    scene_index=i
                )
                
                if video_path:
                    video_paths.append(video_path)
                    print(f"✅ シーン {i+1} 完了: {video_path}")
                else:
                    print(f"❌ シーン {i+1} 生成失敗")
                    
            except Exception as e:
                print(f"❌ シーン {i+1} エラー: {e}")
                continue
        
        print(f"🎉 {len(video_paths)}/{len(prompts)} シーン生成完了！")
        return video_paths
    
    def _generate_single_video(self, 
                              prompt: str, 
                              duration: int, 
                              style: str,
                              scene_index: int) -> Optional[str]:
        """単一映像を生成"""
        
        # リクエストペイロード
        payload = {
            "prompt": f"{prompt}, {style} style, high quality, 4K",
            "duration": duration,
            "aspect_ratio": "16:9",
            "model": "gen4",
            "settings": {
                "motion_scale": 0.8,
                "quality": "high",
                "seed": scene_index * 1000  # 再現性のため
            }
        }
        
        try:
            # 生成リクエスト
            response = requests.post(
                f"{self.base_url}/generate",
                headers=self.headers,
                json=payload,
                timeout=30
            )
            
            if response.status_code != 200:
                print(f"❌ API エラー: {response.status_code} - {response.text}")
                return None
            
            task_data = response.json()
            task_id = task_data.get("id")
            
            if not task_id:
                print("❌ タスクID取得失敗")
                return None
            
            # 生成完了まで待機
            video_url = self._wait_for_completion(task_id)
            
            if video_url:
                # 動画ダウンロード
                return self._download_video(video_url, scene_index)
            else:
                return None
                
        except Exception as e:
            print(f"❌ 生成エラー: {e}")
            return None
    
    def _wait_for_completion(self, task_id: str, timeout: int = 300) -> Optional[str]:
        """生成完了まで待機"""
        
        start_time = time.time()
        
        while time.time() - start_time < timeout:
            try:
                response = requests.get(
                    f"{self.base_url}/tasks/{task_id}",
                    headers=self.headers,
                    timeout=10
                )
                
                if response.status_code == 200:
                    task_data = response.json()
                    status = task_data.get("status")
                    
                    if status == "completed":
                        return task_data.get("output_url")
                    elif status == "failed":
                        print(f"❌ 生成失敗: {task_data.get('error', 'Unknown error')}")
                        return None
                    else:
                        print(f"⏳ 生成中... ({status})")
                        time.sleep(10)
                else:
                    print(f"❌ ステータス確認エラー: {response.status_code}")
                    time.sleep(10)
                    
            except Exception as e:
                print(f"❌ 待機エラー: {e}")
                time.sleep(10)
        
        print("⏰ タイムアウト - 生成が完了しませんでした")
        return None
    
    def _download_video(self, video_url: str, scene_index: int) -> Optional[str]:
        """動画ファイルをダウンロード"""
        
        try:
            response = requests.get(video_url, timeout=60)
            
            if response.status_code == 200:
                filename = f"runway_scene_{scene_index:02d}.mp4"
                filepath = os.path.join("./outputs", filename)
                
                os.makedirs("./outputs", exist_ok=True)
                
                with open(filepath, 'wb') as f:
                    f.write(response.content)
                
                print(f"📥 ダウンロード完了: {filename}")
                return filepath
            else:
                print(f"❌ ダウンロードエラー: {response.status_code}")
                return None
                
        except Exception as e:
            print(f"❌ ダウンロードエラー: {e}")
            return None

def create_runway_integrated_video(prompts: List[str], 
                                  audio_file: str,
                                  srt_file: str,
                                  api_key: str,
                                  output_dir: str = "./outputs") -> Optional[str]:
    """
    Runway Gen-4統合映像生成
    
    Args:
        prompts: 映像生成プロンプトリスト
        audio_file: 音声ファイルパス
        srt_file: 字幕ファイルパス
        api_key: Runway APIキー
        output_dir: 出力ディレクトリ
        
    Returns:
        最終映像ファイルパス
    """
    
    if not api_key:
        print("⚠️ Runway APIキーが設定されていません")
        return None
    
    print("🎬 Runway Gen-4統合映像生成開始...")
    
    # Runway APIクライアント初期化
    client = RunwayAPIClient(api_key)
    
    # 音声の長さを取得
    import moviepy.editor as mp
    try:
        audio = mp.AudioFileClip(audio_file)
        total_duration = audio.duration
        audio.close()
    except Exception as e:
        print(f"❌ 音声ファイル読み込みエラー: {e}")
        return None
    
    # 各シーンの長さを計算
    duration_per_scene = int(total_duration / len(prompts)) if prompts else 4
    
    # 映像生成
    video_paths = client.generate_video_from_prompts(
        prompts=prompts,
        duration_per_scene=duration_per_scene,
        style="cinematic synthwave"
    )
    
    if not video_paths:
        print("❌ 映像生成に失敗しました")
        return None
    
    # 映像を結合
    print("🔗 生成した映像を結合中...")
    combined_video = combine_runway_videos(video_paths, total_duration)
    
    if not combined_video:
        print("❌ 映像結合に失敗しました")
        return None
    
    # 音声と字幕を追加
    print("🎵 音声と字幕を追加中...")
    final_video = add_audio_and_subtitles(combined_video, audio_file, srt_file)
    
    if final_video:
        print(f"🎉 Runway統合映像生成完了: {final_video}")
        return final_video
    else:
        print("❌ 最終映像生成に失敗しました")
        return None

def combine_runway_videos(video_paths: List[str], target_duration: float) -> Optional[str]:
    """生成された映像を結合"""
    
    if not video_paths:
        return None
    
    print(f"🔗 {len(video_paths)} 個の映像を結合中...")
    
    try:
        import moviepy.editor as mp
        
        # 動画クリップを読み込み
        clips = []
        for video_path in video_paths:
            if os.path.exists(video_path):
                clip = mp.VideoFileClip(video_path)
                clips.append(clip)
        
        if not clips:
            print("❌ 有効な映像ファイルがありません")
            return None
        
        # 映像を結合
        combined = mp.concatenate_videoclips(clips)
        
        # 長さを調整
        if combined.duration > target_duration:
            combined = combined.subclip(0, target_duration)
        elif combined.duration < target_duration:
            # 最後のクリップを繰り返し
            if clips:
                last_clip = clips[-1]
                needed_duration = target_duration - combined.duration
                extended_last = last_clip.loop(duration=needed_duration)
                combined = mp.concatenate_videoclips([combined, extended_last])
        
        # 保存
        output_path = os.path.join("./outputs", "runway_combined_video.mp4")
        combined.write_videofile(
            output_path,
            fps=24,
            codec='libx264',
            verbose=False,
            logger=None
        )
        
        # クリップを閉じる
        for clip in clips:
            clip.close()
        combined.close()
        
        print(f"✅ 映像結合完了: {output_path}")
        return output_path
        
    except Exception as e:
        print(f"❌ 映像結合エラー: {e}")
        return None

def add_audio_and_subtitles(video_file: str, audio_file: str, srt_file: str) -> Optional[str]:
    """映像に音声と字幕を追加"""
    
    try:
        import moviepy.editor as mp
        import pysrt
        
        # 映像読み込み
        video = mp.VideoFileClip(video_file)
        
        # 音声読み込み
        audio = mp.AudioFileClip(audio_file)
        
        # 音声を映像に追加
        video_with_audio = video.set_audio(audio)
        
        # 字幕を追加
        subtitles = pysrt.open(srt_file)
        subtitle_clips = []
        
        for subtitle in subtitles:
            start_time = subtitle.start.ordinal / 1000.0
            end_time = subtitle.end.ordinal / 1000.0
            duration = end_time - start_time
            
            if duration > 0:
                try:
                    txt_clip = mp.TextClip(
                        subtitle.text,
                        fontsize=48,
                        color='white',
                        font='Arial-Bold',
                        stroke_color='black',
                        stroke_width=2,
                        size=(1800, None)
                    ).set_position(('center', 'bottom')).set_start(start_time).set_duration(duration)
                    subtitle_clips.append(txt_clip)
                except:
                    txt_clip = mp.TextClip(
                        subtitle.text,
                        fontsize=40,
                        color='white'
                    ).set_position(('center', 'bottom')).set_start(start_time).set_duration(duration)
                    subtitle_clips.append(txt_clip)
        
        # 最終合成
        if subtitle_clips:
            final_video = mp.CompositeVideoClip([video_with_audio] + subtitle_clips)
        else:
            final_video = video_with_audio
        
        # 出力
        output_path = os.path.join("./outputs", "runway_final_music_video.mp4")
        final_video.write_videofile(
            output_path,
            fps=24,
            codec='libx264',
            audio_codec='aac',
            verbose=False,
            logger=None
        )
        
        # クリップを閉じる
        video.close()
        audio.close()
        if subtitle_clips:
            for clip in subtitle_clips:
                clip.close()
        final_video.close()
        
        print(f"✅ 最終映像生成完了: {output_path}")
        return output_path
        
    except Exception as e:
        print(f"❌ 音声・字幕追加エラー: {e}")
        return None

# テスト関数
def test_runway_integration():
    """Runway統合のテスト"""
    
    print("🧪 Runway統合テスト開始...")
    
    # テスト用プロンプト
    test_prompts = [
        "Futuristic cityscape at night with neon lights, cyberpunk aesthetic",
        "Close-up of a person looking at holographic stars in the sky",
        "Abstract geometric shapes moving to electronic music",
        "Serene figure standing on a balcony overlooking a vast illuminated city"
    ]
    
    print(f"📝 テストプロンプト: {len(test_prompts)} 個")
    for i, prompt in enumerate(test_prompts):
        print(f"   {i+1}. {prompt}")
    
    # 注意: 実際のAPIキーが必要
    print("\n⚠️ 実際のテストには有効なRunway APIキーが必要です")
    print("🔗 APIキー取得: https://runway.com/api")

if __name__ == "__main__":
    test_runway_integration() 