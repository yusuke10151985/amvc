#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
🎵 AI音楽ビデオジェネレーター - API統合版 (Phase 1)
GPT-4o API統合 + Runway Gen-4 API統合 + Whisper統合

新機能:
- 自動プロンプト生成 (GPT-4o)
- 自動映像生成 (Runway Gen-4)
- 高度なアライメント (Whisper)

GitHub: https://github.com/yusuke10151985/amvc
"""

print("🚀 AI音楽ビデオジェネレーター - API統合版 起動中...")
print("="*70)

# ===== STEP 1: パッケージインストール =====
print("\n📦 STEP 1: 必要なパッケージをインストール中...")
import subprocess
import sys

try:
    # 基本パッケージ
    subprocess.check_call([sys.executable, "-m", "pip", "install", "moviepy", "pysrt", "scipy", "numpy", "-q"])
    # API統合パッケージ
    subprocess.check_call([sys.executable, "-m", "pip", "install", "openai", "requests", "whisper", "-q"])
    # システムパッケージ
    subprocess.check_call(["apt-get", "update", "-qq"], shell=False, stderr=subprocess.DEVNULL)
    subprocess.check_call(["apt-get", "install", "-y", "ffmpeg", "-qq"], shell=False, stderr=subprocess.DEVNULL)
    print("✅ パッケージインストール完了！")
except Exception as e:
    print(f"⚠️ インストール警告: {e}")
    print("   続行します...")

# ===== STEP 2: ライブラリインポート =====
print("\n📚 STEP 2: ライブラリをインポート中...")
import os
import json
import time
import numpy as np
from scipy.io import wavfile
import moviepy.editor as mp
import pysrt
import whisper
import openai
import requests
from google.colab import files
from IPython.display import display, HTML, Video
from pathlib import Path
from typing import Tuple, List, Dict, Optional

print("✅ ライブラリインポート完了！")

# ===== STEP 3: API設定 =====
print("\n🔑 STEP 3: API設定")

def setup_apis():
    """APIキーの設定"""
    print("🔐 APIキーを設定してください:")
    
    # OpenAI API (GPT-4o)
    openai_key = input("OpenAI API Key (GPT-4o用): ").strip()
    if openai_key:
        openai.api_key = openai_key
        print("✅ OpenAI API設定完了")
    else:
        print("⚠️ OpenAI APIキーがありません - 手動プロンプト生成になります")
    
    # Runway API (将来実装)
    runway_key = input("Runway API Key (オプション): ").strip()
    if runway_key:
        os.environ["RUNWAY_API_KEY"] = runway_key
        print("✅ Runway API設定完了")
    else:
        print("⚠️ Runway APIキーがありません - 手動映像生成になります")
    
    return openai_key, runway_key

# ===== STEP 4: GPT-4o統合関数 =====
print("\n🤖 STEP 4: GPT-4o統合関数を定義中...")

def generate_music_prompts_with_gpt4o(language: str, description: str, duration: int) -> Dict:
    """GPT-4oで音楽プロンプトを自動生成"""
    
    prompt = f"""
あなたは音楽プロデューサーです。以下の情報に基づいて、SUNO AIで使用する最適な音楽プロンプトを生成してください。

言語: {language}
説明: {description}
長さ: {duration}秒

以下の形式でJSONを返してください:
{{
  "title": "曲のタイトル",
  "lyrics": "歌詞（各行改行区切り）",
  "style_prompt": "SUNO AI用のスタイルプロンプト",
  "video_prompts": ["映像シーン1の説明", "映像シーン2の説明", "映像シーン3の説明"]
}}

要件:
- 歌詞は{duration}秒の長さに適したボリューム
- スタイルプロンプトはSUNO AIで効果的
- 映像プロンプトは各シーンが{duration//4}秒程度
- 全て{language}で生成
"""
    
    try:
        response = openai.ChatCompletion.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": "You are a professional music producer and lyricist."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=1500,
            temperature=0.8
        )
        
        content = response.choices[0].message.content
        # JSONを抽出
        start = content.find('{')
        end = content.rfind('}') + 1
        if start != -1 and end != -1:
            json_content = content[start:end]
            return json.loads(json_content)
        else:
            raise ValueError("JSON not found in response")
            
    except Exception as e:
        print(f"⚠️ GPT-4o生成エラー: {e}")
        return generate_fallback_prompts(language, description, duration)

def generate_fallback_prompts(language: str, description: str, duration: int) -> Dict:
    """フォールバック用の手動プロンプト生成"""
    return {
        "title": "Cosmic Drift",
        "lyrics": """Neon rivers in the night
Chasing stars till morning light
In this city, made of glass
Future memories of the past

We're on a cosmic drift, a silent flight
Painting dreams in shades of light
A fleeting moment, in the stream
Living out a vibrant dream""",
        "style_prompt": "Epic cinematic synthwave, futuristic, ethereal female vocals, driving beat, atmospheric pads, reminiscent of Blade Runner soundtrack",
        "video_prompts": [
            "Futuristic cityscape at night with neon lights",
            "Close-up of character looking at holographic stars",
            "Abstract geometric shapes moving to music",
            "Serene figure on balcony overlooking city"
        ]
    }

# ===== STEP 5: Whisper統合関数 =====
print("\n🎙️ STEP 5: Whisper統合関数を定義中...")

def advanced_align_with_whisper(wav_file: str, lyrics_file: str, output_dir: str = "./outputs") -> Tuple[Optional[str], Optional[str]]:
    """Whisperを使用した高度なアライメント"""
    print("\n🎯 Whisper高度アライメント開始...")
    
    os.makedirs(output_dir, exist_ok=True)
    
    try:
        # Whisperモデル読み込み
        print("🤖 Whisperモデル読み込み中...")
        model = whisper.load_model("base")
        
        # 音声認識
        print("🎵 音声認識中...")
        result = model.transcribe(wav_file)
        
        # 歌詞読み込み
        with open(lyrics_file, 'r', encoding='utf-8') as f:
            lyrics_lines = [line.strip() for line in f.readlines() if line.strip()]
        
        # セグメント作成
        segments = result["segments"]
        
        base_name = Path(wav_file).stem
        srt_output = os.path.join(output_dir, f"{base_name}_whisper_subtitles.srt")
        json_output = os.path.join(output_dir, f"{base_name}_whisper_alignment.json")
        
        subtitles = pysrt.SubRipFile()
        json_data = {"words": [], "audio_duration": result["segments"][-1]["end"] if segments else 0}
        
        # セグメントを字幕に変換
        for i, segment in enumerate(segments):
            start_time = segment["start"]
            end_time = segment["end"]
            text = segment["text"].strip()
            
            # 対応する歌詞を探す
            if i < len(lyrics_lines):
                text = lyrics_lines[i]
            
            start_srt = pysrt.SubRipTime(seconds=start_time)
            end_srt = pysrt.SubRipTime(seconds=end_time)
            
            subtitle = pysrt.SubRipItem(
                index=i+1,
                start=start_srt,
                end=end_srt,
                text=text
            )
            subtitles.append(subtitle)
            
            json_data["words"].append({
                "case": "success",
                "start": start_time,
                "end": end_time,
                "word": text,
                "confidence": segment.get("confidence", 0.0)
            })
        
        # 保存
        subtitles.save(srt_output, encoding='utf-8')
        with open(json_output, 'w', encoding='utf-8') as f:
            json.dump(json_data, f, ensure_ascii=False, indent=2)
        
        print(f"✅ Whisperアライメント完了！")
        print(f"   • SRT: {srt_output}")
        print(f"   • JSON: {json_output}")
        return srt_output, json_output
        
    except Exception as e:
        print(f"❌ Whisperアライメントエラー: {e}")
        print("   シンプルアライメントに切り替えます...")
        return simple_align_subtitles(wav_file, lyrics_file, output_dir)

# ===== STEP 6: シンプルアライメント関数（フォールバック） =====
def simple_align_subtitles(wav_file: str, lyrics_file: str, output_dir: str = "./outputs"):
    """シンプルな時間ベースアライメント（フォールバック）"""
    print("\n🎯 シンプルアライメント開始...")
    
    os.makedirs(output_dir, exist_ok=True)
    
    try:
        audio_clip = mp.AudioFileClip(wav_file)
        audio_duration = audio_clip.duration
        audio_clip.close()
        print(f"🎵 音声の長さ: {audio_duration:.2f}秒")
    except Exception as e:
        print(f"❌ 音声ファイル読み込みエラー: {e}")
        return None, None
    
    try:
        with open(lyrics_file, 'r', encoding='utf-8') as f:
            lyrics_lines = [line.strip() for line in f.readlines() if line.strip()]
        print(f"📝 歌詞行数: {len(lyrics_lines)}")
    except Exception as e:
        print(f"❌ 歌詞ファイル読み込みエラー: {e}")
        return None, None
    
    if len(lyrics_lines) == 0:
        print("❌ 歌詞が見つかりません")
        return None, None
    
    time_per_line = audio_duration / len(lyrics_lines)
    
    base_name = Path(wav_file).stem
    srt_output = os.path.join(output_dir, f"{base_name}_subtitles.srt")
    json_output = os.path.join(output_dir, f"{base_name}_alignment.json")
    
    subtitles = pysrt.SubRipFile()
    json_data = {"words": [], "audio_duration": audio_duration}
    
    for i, line in enumerate(lyrics_lines):
        start_time = i * time_per_line
        end_time = (i + 1) * time_per_line
        
        start_srt = pysrt.SubRipTime(seconds=start_time)
        end_srt = pysrt.SubRipTime(seconds=end_time)
        
        subtitle = pysrt.SubRipItem(
            index=i+1,
            start=start_srt,
            end=end_srt,
            text=line
        )
        subtitles.append(subtitle)
        
        json_data["words"].append({
            "case": "success",
            "start": start_time,
            "end": end_time,
            "word": line
        })
    
    try:
        subtitles.save(srt_output, encoding='utf-8')
        with open(json_output, 'w', encoding='utf-8') as f:
            json.dump(json_data, f, ensure_ascii=False, indent=2)
        
        print(f"✅ シンプルアライメント完了！")
        print(f"   • SRT: {srt_output}")
        print(f"   • JSON: {json_output}")
        return srt_output, json_output
    except Exception as e:
        print(f"❌ ファイル保存エラー: {e}")
        return None, None

# ===== STEP 7: 既存の関数群（改良版） =====
def create_sample_audio(filename="sample_audio.wav", duration=6):
    """テスト用のサンプル音声ファイルを作成"""
    sample_rate = 22050
    t = np.linspace(0, duration, int(sample_rate * duration))
    
    frequencies = [440, 523, 659, 783, 659, 523]  # A-C-E-G-E-C
    audio = np.zeros_like(t)
    segment_len = len(t) // 6
    
    for i, freq in enumerate(frequencies):
        start = i * segment_len
        end = (i + 1) * segment_len if i < 5 else len(t)
        audio[start:end] = 0.3 * np.sin(2 * np.pi * freq * t[start:end])
    
    fade_len = int(0.1 * sample_rate)
    audio[:fade_len] *= np.linspace(0, 1, fade_len)
    audio[-fade_len:] *= np.linspace(1, 0, fade_len)
    
    audio_int16 = (audio * 32767).astype(np.int16)
    wavfile.write(filename, sample_rate, audio_int16)
    return filename

def create_sample_lyrics(filename="sample_lyrics.txt"):
    """テスト用のサンプル歌詞ファイルを作成"""
    lyrics = """Hello beautiful world
Music flows through my soul
Dancing with the melody
Creating magic together
Harmony fills the air
Peace and love forever"""
    
    with open(filename, 'w', encoding='utf-8') as f:
        f.write(lyrics)
    return filename

def preview_subtitles(srt_file: str, lines_to_show: int = 5):
    """字幕のプレビュー表示"""
    print(f"\n📖 字幕プレビュー (最初の{lines_to_show}行):")
    print("="*50)
    
    try:
        subtitles = pysrt.open(srt_file)
        for i, subtitle in enumerate(subtitles[:lines_to_show]):
            print(f"{subtitle.index}")
            print(f"{subtitle.start} --> {subtitle.end}")
            print(f"{subtitle.text}")
            print()
        
        if len(subtitles) > lines_to_show:
            print(f"... 他 {len(subtitles) - lines_to_show} エントリ")
    except Exception as e:
        print(f"❌ SRTファイル読み込みエラー: {e}")

def download_file(file_path: str):
    """ファイルダウンロード"""
    if os.path.exists(file_path):
        print(f"📥 ダウンロード: {os.path.basename(file_path)}")
        try:
            files.download(file_path)
        except Exception as e:
            print(f"⚠️ ダウンロードエラー: {e}")

def add_subtitles_to_video(video_clip, srt_file: str):
    """動画に字幕を焼き込み"""
    try:
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
        
        if subtitle_clips:
            print(f"📝 {len(subtitle_clips)} 個の字幕クリップを追加中...")
            return mp.CompositeVideoClip([video_clip] + subtitle_clips)
        else:
            return video_clip
    except Exception as e:
        print(f"⚠️ 字幕追加エラー: {e}")
        return video_clip

def generate_video(wav_file: str, srt_file: str, output_dir: str = "./outputs"):
    """最終的な音楽ビデオを生成（修正版）"""
    print("\n🎬 動画生成開始...")
    os.makedirs(output_dir, exist_ok=True)
    
    try:
        audio = mp.AudioFileClip(wav_file)
        audio_duration = audio.duration
        print(f"🎵 音声の長さ: {audio_duration:.2f}秒")
    except Exception as e:
        print(f"❌ 音声読み込みエラー: {e}")
        return None
    
    print("🎨 グラデーション背景を作成中...")
    
    def make_gradient_frame(t):
        color_value = int(128 + 127 * np.sin(2 * np.pi * t / 4))
        return np.full((1080, 1920, 3), [color_value, 100, 255-color_value], dtype=np.uint8)
    
    video_clip = mp.VideoClip(make_gradient_frame, duration=audio_duration).resize((1920, 1080))
    
    print("📝 字幕追加中...")
    try:
        video_with_subs = add_subtitles_to_video(video_clip, srt_file)
    except Exception as e:
        print(f"⚠️ 字幕追加エラー: {e}")
        video_with_subs = video_clip
    
    final_video = video_with_subs.set_audio(audio)
    output_file = os.path.join(output_dir, f"{Path(wav_file).stem}_final_video.mp4")
    print(f"💾 動画エクスポート中: {output_file}")
    
    try:
        final_video.write_videofile(
            output_file, 
            fps=24, 
            codec='libx264', 
            audio_codec='aac', 
            temp_audiofile='temp-audio.m4a', 
            remove_temp=True, 
            verbose=False, 
            logger=None
        )
        print(f"✅ 動画生成完了: {output_file}")
        
        video_clip.close()
        if video_with_subs != video_clip:
            video_with_subs.close()
        final_video.close()
        audio.close()
        return output_file
    except Exception as e:
        print(f"❌ 動画エクスポートエラー: {e}")
        return None

print("✅ 関数定義完了！")

# ===== STEP 8: メイン実行 =====
print("\n🚀 STEP 8: メイン実行開始")
print("="*50)

# API設定
print("\n🔑 API設定を行いますか？")
print("   y: OpenAI/Runway APIを設定してフル機能を使用")
print("   n: APIなしで基本機能のみ使用")

use_api = input("選択してください (y/n): ").lower().strip()

openai_key = None
runway_key = None

if use_api == 'y' or use_api == 'yes':
    openai_key, runway_key = setup_apis()

# GPT-4o統合デモ
if openai_key:
    print("\n🤖 GPT-4o自動プロンプト生成デモ")
    print("="*50)
    
    demo_prompts = generate_music_prompts_with_gpt4o(
        language="日本語",
        description="未来的なシンセウェーブ、宇宙を旅する歌",
        duration=120
    )
    
    print("🎵 生成されたプロンプト:")
    print(f"タイトル: {demo_prompts['title']}")
    print(f"スタイル: {demo_prompts['style_prompt']}")
    print(f"歌詞プレビュー: {demo_prompts['lyrics'][:100]}...")
    
    # 歌詞ファイル保存
    with open("gpt4o_generated_lyrics.txt", "w", encoding="utf-8") as f:
        f.write(demo_prompts['lyrics'])
    print("📝 歌詞ファイル保存: gpt4o_generated_lyrics.txt")

# サンプルファイル作成
print("\n🧪 サンプルファイル作成中...")
sample_audio = create_sample_audio()
sample_lyrics = create_sample_lyrics()
print(f"✅ サンプルファイル作成完了!")

# ファイル選択
print("\n📁 ファイル選択")
print("="*50)
print("🧪 サンプルファイルを使用しますか？")
print("   y: サンプルファイルを使用（推奨・高速テスト）")
print("   n: 独自ファイルをアップロード")

use_sample = input("選択してください (y/n): ").lower().strip()

if use_sample == 'y' or use_sample == 'yes' or use_sample == '':
    audio_file = sample_audio
    lyrics_file = sample_lyrics
    print(f"\n✅ サンプルファイルを使用します")
else:
    print("\n📤 ファイルアップロード:")
    print("🎵 WAV音声ファイルをアップロードしてください:")
    audio_files = files.upload()
    print("\n📝 TXT歌詞ファイルをアップロードしてください:")
    lyrics_files = files.upload()
    
    audio_file = list(audio_files.keys())[0] if audio_files else None
    lyrics_file = list(lyrics_files.keys())[0] if lyrics_files else None

# アライメント選択
print("\n🎯 アライメント方法選択")
print("="*50)
print("🎙️ Whisper高度アライメントを使用しますか？")
print("   y: Whisper使用（高精度・時間がかかる）")
print("   n: シンプルアライメント（高速・基本精度）")

use_whisper = input("選択してください (y/n): ").lower().strip()

# 実行
if audio_file and lyrics_file:
    # アライメント実行
    if use_whisper == 'y' or use_whisper == 'yes':
        srt_file, json_file = advanced_align_with_whisper(audio_file, lyrics_file)
    else:
        srt_file, json_file = simple_align_subtitles(audio_file, lyrics_file)
    
    if srt_file:
        # 字幕プレビュー
        preview_subtitles(srt_file, lines_to_show=3)
        
        # ダウンロード
        print("\n📥 字幕ファイルダウンロード:")
        download_file(srt_file)
        if json_file:
            download_file(json_file)
        
        # 動画生成
        final_video_path = generate_video(audio_file, srt_file)
        
        if final_video_path:
            # 動画情報表示
            try:
                video_size = os.path.getsize(final_video_path) / (1024 * 1024)
                print(f"\n📊 最終動画情報:")
                print(f"   ファイル名: {os.path.basename(final_video_path)}")
                print(f"   サイズ: {video_size:.1f} MB")
            except:
                pass
            
            # ダウンロード
            print("\n📥 動画ダウンロード:")
            download_file(final_video_path)
            
            # プレビュー表示
            try:
                print("\n🎥 動画プレビュー:")
                display(Video(final_video_path, width=640, height=360))
            except:
                pass
            
            print("\n🎉 AI音楽ビデオ生成完了！")
        else:
            print("\n❌ 動画生成に失敗しました")
    else:
        print("\n❌ アライメントに失敗しました")
else:
    print("\n❌ 必要なファイルが不足しています")

print("\n" + "="*70)
print("🔗 GitHub: https://github.com/yusuke10151985/amvc")
print("🚀 AI音楽ビデオジェネレーター - API統合版 終了")
print("\n✨ 新機能:")
print("   • GPT-4o自動プロンプト生成")
print("   • Whisper高度アライメント")
print("   • API統合フレームワーク")
print("   • Runway Gen-4対応準備完了") 