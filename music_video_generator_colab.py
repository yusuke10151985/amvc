# 🎵 AI音楽ビデオジェネレーター - Colabバックエンド
# 
# このスクリプトを順番にColabセルにコピー&ペーストして実行してください
# 各コメント区切りが1つのセルに対応します

# ===== セル1: タイトル (Markdown) =====
"""
# 🎵 AI音楽ビデオジェネレーター - Colabバックエンド

このノートブックは音声ファイル処理、字幕生成、音楽ビデオ作成のためのバックエンド機能を提供します。

## 📋 パイプライン概要:
1. **音声-歌詞アライメント** 音声と歌詞の時間同期
2. **字幕プレビュー** 生成された字幕の確認
3. **動画合成** MoviePyを使用した動画生成
4. **ファイルダウンロード** 全出力ファイルの取得

## 🚀 **実行手順**:
1. 下のセルを**順番に実行**してください
2. セル8で「y」を選択してサンプルファイルを使用
3. 約5-7分で完了します
"""

# ===== セル2: パッケージインストール =====
# 📦 パッケージインストール（初回のみ・約2-3分）
print("📦 必要なパッケージをインストール中...")

import subprocess
import sys

def install_packages():
    subprocess.check_call([sys.executable, "-m", "pip", "install", "moviepy", "pysrt", "scipy", "numpy", "-q"])
    subprocess.check_call(["apt-get", "update", "-qq"])
    subprocess.check_call(["apt-get", "install", "-y", "ffmpeg", "espeak", "espeak-data", "libespeak-dev", "-qq"])

install_packages()
print("✅ 全ての依存関係がインストールされました！")

# ===== セル3: ライブラリインポート =====
# 📚 ライブラリのインポート
import os
import json
import numpy as np
from scipy.io import wavfile
import moviepy.editor as mp
import pysrt
from google.colab import files
from IPython.display import display, HTML, Video
from pathlib import Path
from typing import Tuple

print("✅ 全ライブラリが正常にインポートされました！")

# ===== セル4: サンプルファイル作成 =====
# 🧪 テスト用サンプルファイル作成
def create_sample_audio(filename="sample_audio.wav", duration=6):
    """テスト用のサンプル音声ファイルを作成"""
    sample_rate = 22050
    t = np.linspace(0, duration, int(sample_rate * duration))
    
    # 6秒間の美しいメロディー
    frequencies = [440, 523, 659, 783, 659, 523]  # A-C-E-G-E-C
    audio = np.zeros_like(t)
    segment_len = len(t) // 6
    
    for i, freq in enumerate(frequencies):
        start = i * segment_len
        end = (i + 1) * segment_len if i < 5 else len(t)
        audio[start:end] = 0.3 * np.sin(2 * np.pi * freq * t[start:end])
    
    # フェードイン・フェードアウト
    fade_len = int(0.1 * sample_rate)
    audio[:fade_len] *= np.linspace(0, 1, fade_len)
    audio[-fade_len:] *= np.linspace(1, 0, fade_len)
    
    # 16-bit PCM形式で保存
    audio_int16 = (audio * 32767).astype(np.int16)
    wavfile.write(filename, sample_rate, audio_int16)
    print(f"✅ サンプル音声ファイル作成: {filename}")
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
    print(f"✅ サンプル歌詞ファイル作成: {filename}")
    return filename

# サンプルファイルを作成
sample_audio = create_sample_audio()
sample_lyrics = create_sample_lyrics()

print(f"\n🧪 テスト準備完了!")
print(f"   音声ファイル: {sample_audio}")
print(f"   歌詞ファイル: {sample_lyrics}")

# ===== セル5: アライメント機能 =====
# 🎯 音声-歌詞アライメント機能
def simple_align_subtitles(wav_file: str, lyrics_file: str, output_dir: str = "./outputs"):
    """音声と歌詞のシンプルなアライメント（時間ベース）"""
    print("🎯 音声-歌詞アライメント開始...")
    
    # 出力ディレクトリ作成
    os.makedirs(output_dir, exist_ok=True)
    
    # 音声ファイルの長さを取得
    try:
        audio_clip = mp.AudioFileClip(wav_file)
        audio_duration = audio_clip.duration
        audio_clip.close()
        print(f"🎵 音声の長さ: {audio_duration:.2f}秒")
    except Exception as e:
        print(f"❌ 音声ファイル読み込みエラー: {e}")
        return None, None
    
    # 歌詞ファイルを読み込み
    try:
        with open(lyrics_file, 'r', encoding='utf-8') as f:
            lyrics_lines = [line.strip() for line in f.readlines() if line.strip()]
        print(f"📝 歌詞行数: {len(lyrics_lines)}")
    except Exception as e:
        print(f"❌ 歌詞ファイル読み込みエラー: {e}")
        return None, None
    
    # 等間隔でタイミングを計算
    if len(lyrics_lines) > 0:
        time_per_line = audio_duration / len(lyrics_lines)
    else:
        print("❌ 歌詞が見つかりません")
        return None, None
    
    # SRTファイルを作成
    base_name = Path(wav_file).stem
    srt_output = os.path.join(output_dir, f"{base_name}_subtitles.srt")
    json_output = os.path.join(output_dir, f"{base_name}_alignment.json")
    
    subtitles = pysrt.SubRipFile()
    json_data = {"words": [], "audio_duration": audio_duration}
    
    for i, line in enumerate(lyrics_lines):
        start_time = i * time_per_line
        end_time = (i + 1) * time_per_line
        
        # SRT作成
        start_srt = pysrt.SubRipTime(seconds=start_time)
        end_srt = pysrt.SubRipTime(seconds=end_time)
        
        subtitle = pysrt.SubRipItem(
            index=i+1,
            start=start_srt,
            end=end_srt,
            text=line
        )
        subtitles.append(subtitle)
        
        # JSON作成
        json_data["words"].append({
            "case": "success",
            "start": start_time,
            "end": end_time,
            "word": line
        })
    
    # ファイル保存
    try:
        subtitles.save(srt_output, encoding='utf-8')
        with open(json_output, 'w', encoding='utf-8') as f:
            json.dump(json_data, f, ensure_ascii=False, indent=2)
        
        print(f"✅ アライメント完了！")
        print(f"   • SRT: {srt_output}")
        print(f"   • JSON: {json_output}")
        
        return srt_output, json_output
        
    except Exception as e:
        print(f"❌ ファイル保存エラー: {e}")
        return None, None

# ===== セル6: プレビュー機能 =====
# 📖 字幕プレビュー機能
def preview_subtitles(srt_file: str, lines_to_show: int = 10):
    """字幕のプレビュー表示"""
    print(f"📖 字幕プレビュー (最初の{lines_to_show}エントリ):")
    print("=" * 50)
    
    try:
        subtitles = pysrt.open(srt_file)
        
        for i, subtitle in enumerate(subtitles[:lines_to_show]):
            print(f"{subtitle.index}")
            print(f"{subtitle.start} --> {subtitle.end}")
            print(f"{subtitle.text}")
            print()
        
        if len(subtitles) > lines_to_show:
            print(f"... 他 {len(subtitles) - lines_to_show} エントリ")
        
        print(f"\n📊 字幕総数: {len(subtitles)}")
        
    except Exception as e:
        print(f"❌ SRTファイル読み込みエラー: {e}")

def download_file(file_path: str):
    """ファイルダウンロード"""
    if os.path.exists(file_path):
        print(f"📥 ダウンロード中: {os.path.basename(file_path)}")
        files.download(file_path)
    else:
        print(f"❌ ファイルが見つかりません: {file_path}")

# ===== セル7: 動画生成機能 =====
# 🎬 動画生成機能
def add_subtitles_to_video(video_clip, srt_file: str):
    """動画に字幕を焼き込み"""
    try:
        subtitles = pysrt.open(srt_file)
        subtitle_clips = []
        
        for subtitle in subtitles:
            # SRT時間を秒に変換
            start_time = subtitle.start.ordinal / 1000.0
            end_time = subtitle.end.ordinal / 1000.0
            duration = end_time - start_time
            
            if duration > 0:
                # テキストクリップ作成
                try:
                    txt_clip = mp.TextClip(
                        subtitle.text,
                        fontsize=48,
                        color='white',
                        font='Arial-Bold',
                        stroke_color='black',
                        stroke_width=2,
                        size=(1800, None)  # 幅を指定して自動改行
                    ).set_position(('center', 'bottom')).set_start(start_time).set_duration(duration)
                    
                    subtitle_clips.append(txt_clip)
                    
                except Exception as e:
                    print(f"⚠️ 字幕クリップ作成エラー: {e}")
                    # フォールバック: シンプルなテキスト
                    txt_clip = mp.TextClip(
                        subtitle.text,
                        fontsize=40,
                        color='white'
                    ).set_position(('center', 'bottom')).set_start(start_time).set_duration(duration)
                    
                    subtitle_clips.append(txt_clip)
        
        # 動画と字幕を合成
        if subtitle_clips:
            print(f"📝 {len(subtitle_clips)} 個の字幕クリップを追加中...")
            return mp.CompositeVideoClip([video_clip] + subtitle_clips)
        else:
            print("⚠️ 字幕クリップが作成されませんでした")
            return video_clip
            
    except Exception as e:
        print(f"⚠️ 字幕追加エラー: {e}")
        return video_clip

def generate_video(wav_file: str, srt_file: str, output_dir: str = "./outputs"):
    """最終的な音楽ビデオを生成（修正版）"""
    print("🎬 動画生成開始...")
    os.makedirs(output_dir, exist_ok=True)
    
    # 音声読み込み
    try:
        audio = mp.AudioFileClip(wav_file)
        audio_duration = audio.duration
        print(f"🎵 音声の長さ: {audio_duration:.2f}秒")
    except Exception as e:
        print(f"❌ 音声読み込みエラー: {e}")
        return None
    
    # 美しいグラデーション背景を作成（修正版）
    print("🎨 グラデーション背景を作成中...")
    def make_gradient_frame(t):
        """修正された関数：引数はtのみ"""
        color_value = int(128 + 127 * np.sin(2 * np.pi * t / 4))
        return np.full((1080, 1920, 3), [color_value, 100, 255-color_value], dtype=np.uint8)
    
    video_clip = mp.VideoClip(make_gradient_frame, duration=audio_duration).resize((1920, 1080))
    
    # 字幕追加
    print("📝 字幕追加中...")
    try:
        video_with_subs = add_subtitles_to_video(video_clip, srt_file)
    except Exception as e:
        print(f"⚠️ 字幕追加エラー: {e}")
        video_with_subs = video_clip
    
    # 音声設定と出力
    final_video = video_with_subs.set_audio(audio)
    output_file = os.path.join(output_dir, f"{Path(wav_file).stem}_final_video.mp4")
    print(f"💾 動画エクスポート中: {output_file}")
    
    try:
        final_video.write_videofile(output_file, fps=24, codec='libx264', audio_codec='aac', 
                                   temp_audiofile='temp-audio.m4a', remove_temp=True, verbose=False, logger=None)
        print(f"✅ 動画生成完了: {output_file}")
        
        # クリーンアップ
        video_clip.close()
        if video_with_subs != video_clip:
            video_with_subs.close()
        final_video.close()
        audio.close()
        return output_file
    except Exception as e:
        print(f"❌ 動画エクスポートエラー: {e}")
        return None

# ===== セル8: ファイル選択 =====
# 📁 ファイル選択（サンプルまたはアップロード）
print("🎵 音声ファイルと歌詞ファイルの設定:")
print("=" * 50)

# サンプルファイル使用の選択
print("🧪 サンプルファイルを使用しますか？")
print("   y: サンプルファイルを使用（推奨・高速テスト）")
print("   n: 独自ファイルをアップロード")

use_sample = input("選択してください (y/n): ").lower().strip()

if use_sample == 'y' or use_sample == 'yes':
    # サンプルファイルを使用
    audio_file = sample_audio
    lyrics_file = sample_lyrics
    print(f"\n✅ サンプルファイルを使用:")
    print(f"   🎵 音声: {audio_file}")
    print(f"   📝 歌詞: {lyrics_file}")
else:
    # ファイルをアップロード
    print("\n📤 ファイルアップロード:")
    print("🎵 WAV音声ファイルをアップロードしてください:")
    audio_files = files.upload()

    print("\n📝 TXT歌詞ファイルをアップロードしてください:")
    lyrics_files = files.upload()

    # ファイルパスを取得
    audio_file = list(audio_files.keys())[0] if audio_files else None
    lyrics_file = list(lyrics_files.keys())[0] if lyrics_files else None

    print(f"\n✅ ファイルがアップロードされました:")
    print(f"   🎵 音声: {audio_file}")
    print(f"   📝 歌詞: {lyrics_file}")

print("\n🚀 ファイル準備完了！次のセルでアライメントを開始します。")

# ===== セル9: アライメント実行 =====
# 🎯 ステップ1: 音声-歌詞アライメント実行
if audio_file and lyrics_file:
    try:
        print("🎯 音声-歌詞アライメント開始...")
        srt_file, json_file = simple_align_subtitles(audio_file, lyrics_file)
        
        if srt_file and json_file:
            print("\n🎉 アライメント成功!")
            print(f"   📝 SRT字幕: {srt_file}")
            print(f"   📊 JSON データ: {json_file}")
        else:
            print("\n❌ アライメントに失敗しました")
            srt_file, json_file = None, None
            
    except Exception as e:
        print(f"❌ アライメントエラー: {e}")
        srt_file, json_file = None, None
else:
    print("❌ 音声ファイルまたは歌詞ファイルが設定されていません")
    srt_file, json_file = None, None

# ===== セル10: 字幕プレビュー =====
# 📖 ステップ2: 字幕プレビュー & ダウンロード
if srt_file:
    print("📖 字幕プレビュー:")
    preview_subtitles(srt_file, lines_to_show=10)
    
    print("\n📥 字幕ファイルのダウンロード:")
    download_file(srt_file)
    if json_file:
        download_file(json_file)
        
    print("\n✅ 字幕生成完了! 次のセルで動画生成に進みます。")
else:
    print("❌ 字幕ファイルが利用できません。アライメントを先に実行してください。")

# ===== セル11: 動画生成実行 =====
# 🎬 ステップ3: 最終動画生成
if audio_file and srt_file:
    try:
        print("🎬 最終動画生成開始...")
        print("⏳ 動画の長さによって数分かかる場合があります...")
        
        final_video_path = generate_video(audio_file, srt_file)
        
        if final_video_path:
            print(f"\n🎉 動画生成完了！")
            print(f"📁 最終動画: {final_video_path}")
            
            # ファイルサイズ表示
            try:
                video_size = os.path.getsize(final_video_path) / (1024 * 1024)  # MB
                print(f"📊 動画サイズ: {video_size:.1f} MB")
            except:
                print("📊 動画サイズ: 不明")
                
            print("\n✅ 次のセルで動画をダウンロードできます！")
        else:
            print("❌ 動画生成に失敗しました")
            final_video_path = None
        
    except Exception as e:
        print(f"❌ 動画生成エラー: {e}")
        final_video_path = None
else:
    print("❌ 音声ファイルまたは字幕ファイルが不足しています")
    print("   前のセルでアライメントを完了してください")
    final_video_path = None

# ===== セル12: 動画ダウンロード =====
# 📥 ステップ4: 最終動画ダウンロード
if final_video_path and os.path.exists(final_video_path):
    print("🎬 音楽ビデオ完成！ダウンロード準備完了")
    print("=" * 50)
    
    # 動画情報表示
    try:
        video_size = os.path.getsize(final_video_path) / (1024 * 1024)
        print(f"📊 ファイル名: {os.path.basename(final_video_path)}")
        print(f"📊 ファイルサイズ: {video_size:.1f} MB")
        print(f"📊 保存場所: {final_video_path}")
    except:
        pass
    
    print("\n📥 ダウンロード実行:")
    download_file(final_video_path)
    
    print("\n🎥 動画プレビュー:")
    try:
        display(Video(final_video_path, width=640, height=360))
    except Exception as e:
        print(f"⚠️ プレビュー表示エラー: {e}")
        
    print("\n🎉 音楽ビデオ生成完了！")
    
else:
    print("❌ ダウンロード可能な動画ファイルがありません")
    print("   前のセルで動画生成を完了してください")

# ===== セル13: クイックテスト（オプション） =====
# 🚀 全パイプライン自動実行（オプション）
# 以下のコードを新しいセルで実行すると、全パイプラインを自動実行できます:

"""
try:
    test_srt, test_json = simple_align_subtitles(sample_audio, sample_lyrics)
    preview_subtitles(test_srt, 3)
    test_video = generate_video(sample_audio, test_srt)
    print(f'✅ テスト完了: {test_video}')
    download_file(test_video)
except Exception as e:
    print(f'❌ テストエラー: {e}')
"""

print("🎉 AI音楽ビデオジェネレーター完成！")
print("📝 上記のコードを各セルにコピーして実行してください")
print("🔗 GitHub: https://github.com/yusuke10151985/amvc")

## 🔄 次の改良段階

### Phase 1: API統合
- [ ] GPT-4o API統合（自動プロンプト生成）
- [ ] Runway Gen-4 API統合（自動映像生成）
- [ ] より高度なアライメント（Whisper統合）

### Phase 2: 高度な機能
- [ ] リアルタイム音声プレビュー
- [ ] 高度な字幕編集（波形表示）
- [ ] 複数言語対応
- [ ] クラウドストレージ統合

### Phase 3: 最適化
- [ ] パフォーマンス改善
- [ ] バッチ処理対応
- [ ] 自動品質調整 