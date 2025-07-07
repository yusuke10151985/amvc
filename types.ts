
export const Language = {
  JA: 'JA',
  EN: 'EN',
  JA_EN: 'JA+EN',
} as const;

export type Language = typeof Language[keyof typeof Language];


export interface Subtitle {
  id: number;
  start: string;
  end:string;
  text: string;
}

export interface ProjectData {
    language: Language;
    keywords: string;
    duration: number;
    generatedJson: string;
    audioFile: File | null;
    lyricsFile: File | null;
    srtContent: string;
    subtitles: Subtitle[];
    videoPrompts: string[];
    videoProgress: number;
}