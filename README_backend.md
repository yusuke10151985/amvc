# 🎵 AI-Powered Music Video Generator - Backend

This repository contains the Python backend for the AI-powered music video generator app. The backend runs entirely in Google Colab and processes audio files, generates aligned subtitles, and creates final MP4 music videos.

## 📋 Overview

The backend notebook (`music_video_generator_backend.ipynb`) provides a complete pipeline for:
1. **Audio-Lyrics Alignment** using gentle forced aligner
2. **Subtitle Generation** in SRT format
3. **Video Composition** using MoviePy with burned-in subtitles
4. **File Management** with easy download functionality

## 🚀 Quick Start

### Prerequisites
- Google Colab account (free)
- WAV audio file (from SUNO or other source)
- TXT lyrics file (plain text, one line per lyric line)
- Optional: Video clips to include in the final video

### Setup Instructions

1. **Upload to Google Colab**
   - Download `music_video_generator_backend.ipynb`
   - Upload to Google Colab
   - Open the notebook

2. **Run Installation Cells**
   - Execute the first few cells to install required packages
   - This will install gentle, MoviePy, and other dependencies

3. **Upload Your Files**
   - Run the file upload cell
   - Upload your WAV audio file
   - Upload your TXT lyrics file

4. **Execute Pipeline**
   - Run each step sequentially
   - Monitor progress through clear status messages
   - Download generated files at each step

## 📁 Input File Requirements

### Audio File (.wav)
- Format: WAV (recommended)
- Quality: Any quality supported by gentle
- Source: SUNO AI, recorded audio, or converted from other formats

### Lyrics File (.txt)
- Format: Plain text
- Structure: One line per lyric phrase
- Encoding: UTF-8

Example lyrics file:
```
Hello world, this is my song
I'm singing loud and singing strong
The music flows through every beat
Dancing to this rhythmic beat
```

### Video Clips (Optional)
- Formats: MP4, MOV, AVI, MKV
- Multiple files supported
- Will be concatenated to match audio duration
- If none provided, a placeholder background is used

## 🔧 Pipeline Details

### Step 1: Audio-Lyrics Alignment
- Uses gentle forced aligner for precise word-level timing
- Generates JSON alignment data for advanced editing
- Converts to SRT subtitle format
- Handles alignment failures gracefully

### Step 2: Subtitle Preview
- Displays first 15 subtitle entries
- Shows total subtitle count
- Provides download links for SRT and JSON files

### Step 3: Video Composition
- Loads and concatenates video clips to match audio duration
- Creates placeholder video if no clips provided
- Resizes video to 1920x1080 resolution
- Adds burned-in subtitles with customizable styling

### Step 4: Final Export
- Exports MP4 with H.264 video codec and AAC audio
- Optimized for web playback and sharing
- Provides file size information
- Includes video preview in notebook

## 📥 Output Files

The pipeline generates several files for download:

1. **`{audio_name}_subtitles.srt`** - Standard subtitle file
2. **`{audio_name}_alignment.json`** - Detailed alignment data
3. **`{audio_name}_final_video.mp4`** - Complete music video

## 🎨 Customization Options

### Subtitle Styling
Modify the `add_subtitles_to_video()` function to customize:
- Font size (`fontsize=48`)
- Font family (`font='Arial-Bold'`)
- Text color (`color='white'`)
- Stroke color and width
- Position on screen

### Video Settings
Adjust video export parameters in `generate_video()`:
- Resolution (default: 1920x1080)
- Frame rate (default: 24 fps)
- Video codec (default: libx264)
- Audio codec (default: aac)

## 🔧 Troubleshooting

### Common Issues

**Gentle Installation Fails**
- Ensure sufficient disk space
- Try restarting Colab runtime
- Check for dependency conflicts

**Audio Alignment Poor Quality**
- Verify lyrics match audio exactly
- Check audio quality and clarity
- Try cleaning up background noise

**Video Generation Slow**
- Large video files take time to process
- Monitor Colab resource usage
- Consider shorter clips for testing

**Download Issues**
- Check file exists in output directory
- Ensure sufficient local storage
- Try downloading smaller files first

### Error Messages

- **"Audio file not found"**: Verify file upload completed
- **"Gentle alignment failed"**: Check audio/lyrics compatibility
- **"Video generation failed"**: Check video clip formats and sizes

## 🚀 Future Enhancements

### Planned Improvements
- **Runway Gen-4 Integration**: Replace placeholder videos with AI-generated clips
- **Multi-language Support**: Subtitle generation in multiple languages
- **Advanced Styling**: Custom subtitle animations and effects
- **Batch Processing**: Process multiple songs simultaneously
- **Real-time Preview**: Live preview of subtitle timing adjustments

### Extension Ideas
- Custom video effects and transitions
- Automatic beat detection for video sync
- Social media format exports (vertical, square)
- Cloud storage integration
- API endpoints for frontend integration

## 📄 Technical Specifications

### Dependencies
- **gentle**: Forced alignment engine
- **moviepy**: Video editing and composition
- **pysrt**: SRT subtitle file handling
- **ffmpeg**: Video/audio processing backend

### Performance
- Processing time: 2-5 minutes per song (depending on length)
- Memory usage: ~1-2GB for typical songs
- Storage: ~100MB temporary files per song

### Compatibility
- Runs on Google Colab (free and pro tiers)
- Compatible with Python 3.7+
- Supports most common audio/video formats

## 📞 Support

For issues or questions:
1. Check the troubleshooting section above
2. Review error messages in notebook output
3. Ensure all prerequisites are met
4. Try with a simpler test case first

## 📜 License

This project is designed to work with your existing frontend application. The backend notebook is standalone and doesn't modify any frontend code.

---

**Note**: This backend is designed to complement your existing Next.js + TailwindCSS + shadcn/ui + Framer Motion frontend. It provides the processing pipeline that your frontend can integrate with via file uploads and downloads. 