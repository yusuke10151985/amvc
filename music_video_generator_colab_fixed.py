# 🎬 動画生成機能（修正版）
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