# 🎬 AI Music Video Creator

AI-powered music video generator with React/TypeScript frontend and Python backend for Google Colab.

## ✨ Features

- 🎵 **Music concept input** - Multi-language support
- 🤖 **GPT-4o automated prompt generation** - Intelligent content creation
- 📁 **Audio/lyrics file upload** - Drag & drop interface
- ⏱️ **Subtitle timing with Whisper** - Advanced audio alignment
- 🎬 **Advanced subtitle editor** - Waveform preview & real-time editing
- 📹 **Runway Gen-4 video generation** - AI-powered video creation
- 💾 **Download & cloud storage** - Multi-provider support
- 🌐 **Multi-language support** - Japanese, English, Korean, Chinese

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```

### 3. Open Browser
```
http://localhost:5173
```

## 📖 Testing Guide

For detailed testing instructions, see **[TESTING_GUIDE.md](./TESTING_GUIDE.md)**

### Quick Test
1. **Language Selection** - Try different languages in the top-right selector
2. **Step 1-2** - Use sample data to generate music prompts
3. **Step 3** - Upload a WAV file and `test-data/sample-lyrics.txt`
4. **Step 5** - Experience the advanced waveform audio player
5. **Multi-language UI** - Switch between 4 supported languages

## 🛠 Technologies

- **Frontend**: React, TypeScript, TailwindCSS, Vite
- **Backend**: Python, Google Colab
- **APIs**: OpenAI GPT-4o, Runway Gen-4, Whisper
- **Cloud Storage**: Google Drive, Dropbox, OneDrive

## 📂 Project Structure

```
AMVC/
├── components/           # React components
│   ├── steps.tsx        # Main workflow steps
│   ├── advanced-audio-player.tsx  # Waveform audio player
│   ├── language-selector.tsx      # Multi-language selector
│   └── cloud-storage-upload.tsx   # Cloud storage integration
├── i18n/                # Internationalization
├── cloud-storage/       # Cloud storage providers
├── test-data/          # Sample files for testing
└── *.py                # Python/Colab backend files
```

## 🎯 Recent Updates (Phase 2)

### ✅ Advanced Features Implemented
- **🎵 Real-time Audio Preview** - Waveform visualization with subtitle sync
- **📝 Advanced Subtitle Editor** - Professional-grade editing with history
- **🌐 Multi-language Support** - 4 languages with complete i18n
- **☁️ Cloud Storage Integration** - 3 major providers with OAuth

### 🔧 Technical Highlights
- Web Audio API for waveform generation
- Real-time subtitle-audio synchronization
- Complete internationalization system
- Multi-provider cloud storage abstraction

## 📊 Development Status

- ✅ **Phase 1**: Basic workflow and API integration
- ✅ **Phase 2**: Advanced features and multi-language support
- 🎯 **Ready for testing**: All core features implemented

## 🐛 Known Issues

- Audio files must be in WAV format
- Large files may take time to process
- External APIs require valid API keys
- Modern browser required for Web Audio API

## 🙋‍♂️ Support

If you encounter issues:
1. Check the browser console for errors
2. Ensure you're using a modern browser
3. Try with smaller test files first
4. See [TESTING_GUIDE.md](./TESTING_GUIDE.md) for troubleshooting

---

**🎉 Ready to create amazing AI music videos!**
