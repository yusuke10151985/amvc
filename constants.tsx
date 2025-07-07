
import React from 'react';
import { Subtitle } from './types';

export const STEPS = [
  { id: 1, name: 'Music Concept' },
  { id: 2, name: 'SUNO Prompts' },
  { id: 3, name: 'Upload Assets' },
  { id: 4, name: 'Subtitle Timing' },
  { id: 5, name: 'Edit Subtitles' },
  { id: 6, name: 'Generate Video' },
  { id: 7, name: 'Download' },
];

export const MOCK_TITLE = "Cosmic Drift";
export const MOCK_LYRICS = `(Verse 1)
Neon rivers in the night
Chasing stars till morning light
In this city, made of glass
Future memories of the past

(Chorus)
We're on a cosmic drift, a silent flight
Painting dreams in shades of light
A fleeting moment, in the stream
Living out a vibrant dream`;

export const MOCK_SUNO_PROMPT = "Epic cinematic synthwave, futuristic, ethereal female vocals, driving beat, atmospheric pads, reminiscent of Blade Runner soundtrack, 80s retro-futurism, hopeful yet melancholic tone.";

export const MOCK_SRT_CONTENT = `1
00:00:02,100 --> 00:00:04,500
Neon rivers in the night

2
00:00:05,200 --> 00:00:07,800
Chasing stars till morning light

3
00:00:08,500 --> 00:00:11,000
In this city, made of glass

4
00:00:11,700 --> 00:00:14,300
Future memories of the past

5
00:00:15,100 --> 00:00:18,000
We're on a cosmic drift, a silent flight

6
00:00:18,700 --> 00:00:21,200
Painting dreams in shades of light

7
00:00:22,000 --> 00:00:24,800
A fleeting moment, in the stream

8
00:00:25,500 --> 00:00:28,100
Living out a vibrant dream`;

export const MOCK_SUBTITLES: Subtitle[] = MOCK_SRT_CONTENT.split('\n\n').map((block, index) => {
    const lines = block.split('\n');
    const times = lines[1].split(' --> ');
    return {
        id: index + 1,
        start: times[0],
        end: times[1],
        text: lines.slice(2).join(' ')
    };
});

export const MOCK_VIDEO_PROMPTS = [
    "An aerial shot of a futuristic city at night, with glowing neon signs reflected on wet streets.",
    "A close-up of a character looking up at a sky full of holographic stars and nebulae.",
    "A fast-paced montage of abstract geometric shapes and light trails moving to the beat of the music.",
    "A serene shot of a lone figure standing on a balcony overlooking the vast, illuminated cityscape."
];


export const SunIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>
);

export const MoonIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
);

export const LogoIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="m12 8 9.04 2.84c.44.14.76.54.76 1.03v5.26c0 .49-.32.89-.76 1.03L12 21l-9.04-2.84c-.44-.14-.76-.54-.76-1.03v-5.26c0 .49.32.89.76 1.03L12 8Z"/>
        <path d="M12 3 2.96 5.84A.94.94 0 0 0 2.2 6.87v5.26c0 .49.32.89.76 1.03L12 16l9.04-2.84c.44-.14.76-.54.76-1.03V6.87a.94.94 0 0 0-.76-1.03L12 3Z"/>
    </svg>
);

export const CopyIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
);

export const CheckIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M20 6 9 17l-5-5"/></svg>
);

export const UploadIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>
);

export const FileIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>
);

export const DownloadIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
);

export const GoogleDriveIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M22 10l-6-6H8l-6 6h2l6-6h4l6 6h2z"/>
        <path d="M12 10l-6 6h12l-6-6z"/>
        <path d="M6 22l6-6 6 6H6z"/>
    </svg>
);

export const UndoIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M3 7v6h6"/><path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13"/></svg>
);

export const RedoIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M21 7v6h-6"/><path d="M3 17a9 9 0 0 0 9 9 9 9 0 0 0 6-2.3L21 13"/></svg>
);

export const PlayIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><polygon points="5 3 19 12 5 21 5 3"/></svg>
);

export const AudioFileIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M17.5 22h.5a2.5 2.5 0 0 0 2.5-2.5V15a2.5 2.5 0 0 0-2.5-2.5h-1a2.5 2.5 0 0 1-2.5-2.5V5a2.5 2.5 0 0 0-2.5-2.5h-1A2.5 2.5 0 0 0 8 5v5.5a2.5 2.5 0 0 1-2.5 2.5h-1A2.5 2.5 0 0 0 2 15.5V18a2.5 2.5 0 0 0 2.5 2.5h.5"/><path d="M16 12.5a2.5 2.5 0 0 1-2.5 2.5h-1a2.5 2.5 0 0 0-2.5 2.5V22"/><path d="M8 12.5a2.5 2.5 0 0 0 2.5 2.5h1a2.5 2.5 0 0 1 2.5 2.5V22"/></svg>
);