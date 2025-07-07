/**
 * 多言語対応 (i18n) システム
 * 日本語、英語、韓国語、中国語対応
 */

export type SupportedLanguage = 'ja' | 'en' | 'ko' | 'zh';

export interface TranslationKeys {
  // アプリケーション全般
  appTitle: string;
  loading: string;
  error: string;
  success: string;
  warning: string;
  
  // ナビゲーション
  steps: {
    step1: string;
    step2: string;
    step3: string;
    step4: string;
    step5: string;
    step6: string;
    step7: string;
  };
  
  // Step 1: 音楽コンセプト
  step1: {
    title: string;
    language: string;
    keywords: string;
    keywordsPlaceholder: string;
    duration: string;
    durationUnit: string;
    generateJson: string;
    nextStep: string;
  };
  
  // Step 2: プロンプト生成
  step2: {
    title: string;
    useGPT4o: string;
    apiKey: string;
    apiKeyPlaceholder: string;
    apiKeyWarning: string;
    generateWithGPT4o: string;
    generating: string;
    useSampleData: string;
    generatedTitle: string;
    generatedLyrics: string;
    generatedStyle: string;
    videoPrompts: string;
    scene: string;
    downloadLyrics: string;
    gptGenerated: string;
    samplePrompts: string;
  };
  
  // Step 3: ファイルアップロード
  step3: {
    title: string;
    audioFile: string;
    lyricsFile: string;
    uploadFile: string;
    dragAndDrop: string;
  };
  
  // Step 4: 字幕タイミング
  step4: {
    title: string;
    processTiming: string;
    processing: string;
    downloadSrt: string;
  };
  
  // Step 5: 字幕編集
  step5: {
    title: string;
    subtitleList: string;
    detailEdit: string;
    editingSubtitle: string;
    startTime: string;
    endTime: string;
    subtitleText: string;
    previousSubtitle: string;
    nextSubtitle: string;
    clickToEdit: string;
    downloadEdited: string;
    saveDraft: string;
    audioPreview: string;
    waveformGenerating: string;
    subtitleTimeline: string;
    clickToJump: string;
    volume: string;
    speed: string;
    play: string;
    pause: string;
  };
  
  // Step 6: 動画生成
  step6: {
    title: string;
    videoPrompts: string;
    editPrompts: string;
    generateVideo: string;
    generating: string;
    complete: string;
    progress: string;
  };
  
  // Step 7: ダウンロード
  step7: {
    title: string;
    ready: string;
    downloadVideo: string;
    saveToCloud: string;
    projectData: string;
    subtitles: string;
    projectLogs: string;
    startNew: string;
  };
  
  // 共通
  common: {
    back: string;
    next: string;
    save: string;
    cancel: string;
    download: string;
    upload: string;
    edit: string;
    delete: string;
    undo: string;
    redo: string;
    close: string;
    confirm: string;
  };
}

// 日本語翻訳
const ja: TranslationKeys = {
  appTitle: "AI音楽ビデオクリエーター",
  loading: "読み込み中...",
  error: "エラー",
  success: "成功",
  warning: "警告",
  
  steps: {
    step1: "音楽コンセプト",
    step2: "SUNOプロンプト",
    step3: "アセットアップロード",
    step4: "字幕タイミング",
    step5: "字幕編集",
    step6: "動画生成",
    step7: "ダウンロード"
  },
  
  step1: {
    title: "音楽イメージ入力",
    language: "言語",
    keywords: "キーワード / 説明",
    keywordsPlaceholder: "例: 宇宙を旅するシンセウェーブ",
    duration: "曲の長さ",
    durationUnit: "秒",
    generateJson: "JSON生成",
    nextStep: "次のステップ"
  },
  
  step2: {
    title: "SUNO AI プロンプト生成",
    useGPT4o: "GPT-4o自動生成を使用",
    apiKey: "OpenAI APIキー",
    apiKeyPlaceholder: "sk-...",
    apiKeyWarning: "本番環境では APIキーをフロントエンドで直接使用しないでください",
    generateWithGPT4o: "GPT-4oで自動生成",
    generating: "GPT-4o生成中...",
    useSampleData: "サンプルデータを使用",
    generatedTitle: "生成されたタイトル",
    generatedLyrics: "生成された歌詞",
    generatedStyle: "生成されたSUNOスタイルプロンプト",
    videoPrompts: "映像プロンプト (Runway Gen-4用)",
    scene: "シーン",
    downloadLyrics: "歌詞をダウンロード",
    gptGenerated: "GPT-4oで自動生成されたプロンプトです。SUNOにコピーして音楽を生成してください。",
    samplePrompts: "サンプルプロンプトです。SUNOにコピーして音楽を生成してください。"
  },
  
  step3: {
    title: "音声ファイルアップロード",
    audioFile: "WAV音声ファイル",
    lyricsFile: "歌詞テキストファイル",
    uploadFile: "ファイルをアップロード",
    dragAndDrop: "またはドラッグ&ドロップ"
  },
  
  step4: {
    title: "字幕タイミング",
    processTiming: "タイミング処理",
    processing: "処理中...",
    downloadSrt: "SRTをダウンロード"
  },
  
  step5: {
    title: "高度な字幕編集",
    subtitleList: "字幕一覧",
    detailEdit: "詳細編集",
    editingSubtitle: "編集中",
    startTime: "開始時間",
    endTime: "終了時間",
    subtitleText: "字幕テキスト",
    previousSubtitle: "前の字幕",
    nextSubtitle: "次の字幕",
    clickToEdit: "字幕をクリックして編集を開始してください",
    downloadEdited: "編集済み字幕をダウンロード",
    saveDraft: "下書き保存",
    audioPreview: "リアルタイム音声プレビュー",
    waveformGenerating: "波形生成中...",
    subtitleTimeline: "字幕タイムライン (クリックでジャンプ)",
    clickToJump: "クリックでジャンプ",
    volume: "音量",
    speed: "速度",
    play: "再生",
    pause: "一時停止"
  },
  
  step6: {
    title: "動画シーン生成",
    videoPrompts: "GPT-4oが以下の映像プロンプトを提案しました。生成前に編集できます。",
    editPrompts: "プロンプト",
    generateVideo: "動画生成",
    generating: "生成中...",
    complete: "生成完了",
    progress: "生成進度"
  },
  
  step7: {
    title: "音楽ビデオが完成しました！",
    ready: "完成",
    downloadVideo: "最終動画をダウンロード (MP4)",
    saveToCloud: "Google Driveに保存",
    projectData: "プロジェクトデータ (JSON)",
    subtitles: "字幕 (SRT)",
    projectLogs: "プロジェクトログ (TXT)",
    startNew: "新しいプロジェクトを開始"
  },
  
  common: {
    back: "戻る",
    next: "次へ",
    save: "保存",
    cancel: "キャンセル",
    download: "ダウンロード",
    upload: "アップロード",
    edit: "編集",
    delete: "削除",
    undo: "元に戻す",
    redo: "やり直し",
    close: "閉じる",
    confirm: "確認"
  }
};

// 英語翻訳
const en: TranslationKeys = {
  appTitle: "AI Music Video Creator",
  loading: "Loading...",
  error: "Error",
  success: "Success",
  warning: "Warning",
  
  steps: {
    step1: "Music Concept",
    step2: "SUNO Prompts",
    step3: "Upload Assets",
    step4: "Subtitle Timing",
    step5: "Edit Subtitles",
    step6: "Generate Video",
    step7: "Download"
  },
  
  step1: {
    title: "Music Image Input",
    language: "Language",
    keywords: "Keywords / Description",
    keywordsPlaceholder: "e.g., synthwave track about cosmic travel",
    duration: "Song Duration",
    durationUnit: "seconds",
    generateJson: "Generate JSON",
    nextStep: "Next Step"
  },
  
  step2: {
    title: "SUNO AI Prompt Generation",
    useGPT4o: "Use GPT-4o Auto Generation",
    apiKey: "OpenAI API Key",
    apiKeyPlaceholder: "sk-...",
    apiKeyWarning: "Do not use API keys directly in frontend in production",
    generateWithGPT4o: "Generate with GPT-4o",
    generating: "Generating with GPT-4o...",
    useSampleData: "Use Sample Data",
    generatedTitle: "Generated Title",
    generatedLyrics: "Generated Lyrics",
    generatedStyle: "Generated SUNO Style Prompt",
    videoPrompts: "Video Prompts (for Runway Gen-4)",
    scene: "Scene",
    downloadLyrics: "Download Lyrics",
    gptGenerated: "Auto-generated prompts by GPT-4o. Copy to SUNO to generate music.",
    samplePrompts: "Sample prompts. Copy to SUNO to generate music."
  },
  
  step3: {
    title: "Audio File Upload",
    audioFile: "WAV Audio File",
    lyricsFile: "Lyrics Text File",
    uploadFile: "Upload a file",
    dragAndDrop: "or drag and drop"
  },
  
  step4: {
    title: "Subtitle Timing",
    processTiming: "Process Timings",
    processing: "Processing...",
    downloadSrt: "Download SRT"
  },
  
  step5: {
    title: "Advanced Subtitle Editing",
    subtitleList: "Subtitle List",
    detailEdit: "Detail Edit",
    editingSubtitle: "Editing",
    startTime: "Start Time",
    endTime: "End Time",
    subtitleText: "Subtitle Text",
    previousSubtitle: "← Previous",
    nextSubtitle: "Next →",
    clickToEdit: "Click subtitle to start editing",
    downloadEdited: "Download Edited Subtitles",
    saveDraft: "Save Draft",
    audioPreview: "Real-time Audio Preview",
    waveformGenerating: "Generating Waveform...",
    subtitleTimeline: "Subtitle Timeline (Click to Jump)",
    clickToJump: "Click to jump",
    volume: "Volume",
    speed: "Speed",
    play: "Play",
    pause: "Pause"
  },
  
  step6: {
    title: "Video Scene Generation",
    videoPrompts: "GPT-4o has suggested the following video prompts. You can edit them before generation.",
    editPrompts: "Prompt",
    generateVideo: "Generate Video",
    generating: "Generating...",
    complete: "Generation Complete",
    progress: "Generation Progress"
  },
  
  step7: {
    title: "Your Music Video is Ready!",
    ready: "Ready",
    downloadVideo: "Download Final Video (MP4)",
    saveToCloud: "Save to Google Drive",
    projectData: "Project Data (JSON)",
    subtitles: "Subtitles (SRT)",
    projectLogs: "Project Logs (TXT)",
    startNew: "Start a New Project"
  },
  
  common: {
    back: "Back",
    next: "Next",
    save: "Save",
    cancel: "Cancel",
    download: "Download",
    upload: "Upload",
    edit: "Edit",
    delete: "Delete",
    undo: "Undo",
    redo: "Redo",
    close: "Close",
    confirm: "Confirm"
  }
};

// 韓国語翻訳
const ko: TranslationKeys = {
  appTitle: "AI 뮤직비디오 크리에이터",
  loading: "로딩 중...",
  error: "오류",
  success: "성공",
  warning: "경고",
  
  steps: {
    step1: "음악 컨셉",
    step2: "SUNO 프롬프트",
    step3: "파일 업로드",
    step4: "자막 타이밍",
    step5: "자막 편집",
    step6: "비디오 생성",
    step7: "다운로드"
  },
  
  step1: {
    title: "음악 이미지 입력",
    language: "언어",
    keywords: "키워드 / 설명",
    keywordsPlaceholder: "예: 우주 여행 신스웨이브",
    duration: "곡 길이",
    durationUnit: "초",
    generateJson: "JSON 생성",
    nextStep: "다음 단계"
  },
  
  step2: {
    title: "SUNO AI 프롬프트 생성",
    useGPT4o: "GPT-4o 자동 생성 사용",
    apiKey: "OpenAI API 키",
    apiKeyPlaceholder: "sk-...",
    apiKeyWarning: "프로덕션에서는 프론트엔드에서 API 키를 직접 사용하지 마세요",
    generateWithGPT4o: "GPT-4o로 자동 생성",
    generating: "GPT-4o 생성 중...",
    useSampleData: "샘플 데이터 사용",
    generatedTitle: "생성된 제목",
    generatedLyrics: "생성된 가사",
    generatedStyle: "생성된 SUNO 스타일 프롬프트",
    videoPrompts: "비디오 프롬프트 (Runway Gen-4용)",
    scene: "씬",
    downloadLyrics: "가사 다운로드",
    gptGenerated: "GPT-4o로 자동 생성된 프롬프트입니다. SUNO에 복사하여 음악을 생성하세요.",
    samplePrompts: "샘플 프롬프트입니다. SUNO에 복사하여 음악을 생성하세요."
  },
  
  step3: {
    title: "오디오 파일 업로드",
    audioFile: "WAV 오디오 파일",
    lyricsFile: "가사 텍스트 파일",
    uploadFile: "파일 업로드",
    dragAndDrop: "또는 드래그 앤 드롭"
  },
  
  step4: {
    title: "자막 타이밍",
    processTiming: "타이밍 처리",
    processing: "처리 중...",
    downloadSrt: "SRT 다운로드"
  },
  
  step5: {
    title: "고급 자막 편집",
    subtitleList: "자막 목록",
    detailEdit: "세부 편집",
    editingSubtitle: "편집 중",
    startTime: "시작 시간",
    endTime: "종료 시간",
    subtitleText: "자막 텍스트",
    previousSubtitle: "← 이전",
    nextSubtitle: "다음 →",
    clickToEdit: "자막을 클릭하여 편집을 시작하세요",
    downloadEdited: "편집된 자막 다운로드",
    saveDraft: "임시 저장",
    audioPreview: "실시간 오디오 미리보기",
    waveformGenerating: "파형 생성 중...",
    subtitleTimeline: "자막 타임라인 (클릭하여 이동)",
    clickToJump: "클릭하여 이동",
    volume: "볼륨",
    speed: "속도",
    play: "재생",
    pause: "일시정지"
  },
  
  step6: {
    title: "비디오 씬 생성",
    videoPrompts: "GPT-4o가 다음 비디오 프롬프트를 제안했습니다. 생성 전에 편집할 수 있습니다.",
    editPrompts: "프롬프트",
    generateVideo: "비디오 생성",
    generating: "생성 중...",
    complete: "생성 완료",
    progress: "생성 진행률"
  },
  
  step7: {
    title: "뮤직비디오가 완성되었습니다!",
    ready: "완성",
    downloadVideo: "최종 비디오 다운로드 (MP4)",
    saveToCloud: "Google Drive에 저장",
    projectData: "프로젝트 데이터 (JSON)",
    subtitles: "자막 (SRT)",
    projectLogs: "프로젝트 로그 (TXT)",
    startNew: "새 프로젝트 시작"
  },
  
  common: {
    back: "뒤로",
    next: "다음",
    save: "저장",
    cancel: "취소",
    download: "다운로드",
    upload: "업로드",
    edit: "편집",
    delete: "삭제",
    undo: "실행 취소",
    redo: "다시 실행",
    close: "닫기",
    confirm: "확인"
  }
};

// 중국語翻訳
const zh: TranslationKeys = {
  appTitle: "AI音乐视频创作器",
  loading: "加载中...",
  error: "错误",
  success: "成功",
  warning: "警告",
  
  steps: {
    step1: "音乐概念",
    step2: "SUNO提示",
    step3: "上传文件",
    step4: "字幕时间",
    step5: "字幕编辑",
    step6: "视频生成",
    step7: "下载"
  },
  
  step1: {
    title: "音乐图像输入",
    language: "语言",
    keywords: "关键词/描述",
    keywordsPlaceholder: "例如：关于宇宙旅行的合成器音乐",
    duration: "歌曲时长",
    durationUnit: "秒",
    generateJson: "生成JSON",
    nextStep: "下一步"
  },
  
  step2: {
    title: "SUNO AI提示生成",
    useGPT4o: "使用GPT-4o自动生成",
    apiKey: "OpenAI API密钥",
    apiKeyPlaceholder: "sk-...",
    apiKeyWarning: "在生产环境中不要在前端直接使用API密钥",
    generateWithGPT4o: "用GPT-4o自动生成",
    generating: "GPT-4o生成中...",
    useSampleData: "使用示例数据",
    generatedTitle: "生成的标题",
    generatedLyrics: "生成的歌词",
    generatedStyle: "生成的SUNO风格提示",
    videoPrompts: "视频提示（用于Runway Gen-4）",
    scene: "场景",
    downloadLyrics: "下载歌词",
    gptGenerated: "GPT-4o自动生成的提示。复制到SUNO生成音乐。",
    samplePrompts: "示例提示。复制到SUNO生成音乐。"
  },
  
  step3: {
    title: "音频文件上传",
    audioFile: "WAV音频文件",
    lyricsFile: "歌词文本文件",
    uploadFile: "上传文件",
    dragAndDrop: "或拖放"
  },
  
  step4: {
    title: "字幕时间",
    processTiming: "处理时间",
    processing: "处理中...",
    downloadSrt: "下载SRT"
  },
  
  step5: {
    title: "高级字幕编辑",
    subtitleList: "字幕列表",
    detailEdit: "详细编辑",
    editingSubtitle: "编辑中",
    startTime: "开始时间",
    endTime: "结束时间",
    subtitleText: "字幕文本",
    previousSubtitle: "← 上一个",
    nextSubtitle: "下一个 →",
    clickToEdit: "点击字幕开始编辑",
    downloadEdited: "下载编辑的字幕",
    saveDraft: "保存草稿",
    audioPreview: "实时音频预览",
    waveformGenerating: "生成波形中...",
    subtitleTimeline: "字幕时间轴（点击跳转）",
    clickToJump: "点击跳转",
    volume: "音量",
    speed: "速度",
    play: "播放",
    pause: "暂停"
  },
  
  step6: {
    title: "视频场景生成",
    videoPrompts: "GPT-4o建议了以下视频提示。生成前可以编辑。",
    editPrompts: "提示",
    generateVideo: "生成视频",
    generating: "生成中...",
    complete: "生成完成",
    progress: "生成进度"
  },
  
  step7: {
    title: "您的音乐视频已准备就绪！",
    ready: "就绪",
    downloadVideo: "下载最终视频（MP4）",
    saveToCloud: "保存到Google Drive",
    projectData: "项目数据（JSON）",
    subtitles: "字幕（SRT）",
    projectLogs: "项目日志（TXT）",
    startNew: "开始新项目"
  },
  
  common: {
    back: "返回",
    next: "下一步",
    save: "保存",
    cancel: "取消",
    download: "下载",
    upload: "上传",
    edit: "编辑",
    delete: "删除",
    undo: "撤销",
    redo: "重做",
    close: "关闭",
    confirm: "确认"
  }
};

// 翻訳マップ
const translations: Record<SupportedLanguage, TranslationKeys> = {
  ja,
  en,
  ko,
  zh
};

// i18n コンテキスト
let currentLanguage: SupportedLanguage = 'ja';

export const setLanguage = (lang: SupportedLanguage) => {
  currentLanguage = lang;
  localStorage.setItem('app-language', lang);
};

export const getCurrentLanguage = (): SupportedLanguage => {
  return currentLanguage;
};

export const getTranslations = (lang?: SupportedLanguage): TranslationKeys => {
  return translations[lang || currentLanguage];
};

export const t = (key: string, lang?: SupportedLanguage): string => {
  const trans = translations[lang || currentLanguage];
  const keys = key.split('.');
  let value: any = trans;
  
  for (const k of keys) {
    value = value?.[k];
  }
  
  return value || key;
};

// ブラウザ言語検出
export const detectBrowserLanguage = (): SupportedLanguage => {
  const browserLang = navigator.language.split('-')[0];
  
  switch (browserLang) {
    case 'ja':
      return 'ja';
    case 'ko':
      return 'ko';
    case 'zh':
      return 'zh';
    default:
      return 'en';
  }
};

// 初期化
export const initializeI18n = () => {
  const savedLang = localStorage.getItem('app-language') as SupportedLanguage;
  const detectedLang = detectBrowserLanguage();
  
  setLanguage(savedLang || detectedLang);
};

export default {
  setLanguage,
  getCurrentLanguage,
  getTranslations,
  t,
  detectBrowserLanguage,
  initializeI18n
}; 