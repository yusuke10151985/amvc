# 🧪 Colab クイックテスト（1セルで全パイプライン実行）

print("🚀 AI音楽ビデオジェネレーター - クイックテスト開始")
print("=" * 60)

try:
    # サンプルファイルでアライメント実行
    print("\n1️⃣ アライメント実行中...")
    test_srt, test_json = align_subtitles(sample_audio, sample_lyrics)
    
    # 字幕プレビュー
    print("\n2️⃣ 字幕プレビュー:")
    preview_subtitles(test_srt, lines_to_show=5)
    
    # プレースホルダー動画で動画生成
    print("\n3️⃣ 動画生成中...")
    test_video = generate_video(sample_audio, test_srt, "./video_clips")
    
    print("\n🎉 クイックテスト完了！")
    print(f"✅ 字幕ファイル: {test_srt}")
    print(f"✅ 動画ファイル: {test_video}")
    
    # ファイルサイズ表示
    srt_size = os.path.getsize(test_srt) / 1024
    video_size = os.path.getsize(test_video) / (1024 * 1024)
    print(f"📊 字幕: {srt_size:.1f} KB")
    print(f"📊 動画: {video_size:.1f} MB")
    
    # ダウンロードリンク
    print("\n📥 ダウンロード可能ファイル:")
    download_file(test_srt)
    download_file(test_video)
    
except Exception as e:
    print(f"❌ テストエラー: {e}")
    print("💡 パッケージインストールと関数定義が完了していることを確認してください") 