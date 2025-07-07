/**
 * OpenAI API クライアント (フロントエンド用)
 * 
 * 注意: 本番環境では APIキーをフロントエンドで直接使用しないでください
 * 開発・デモ目的のみです
 */

interface GeneratedPrompts {
  title: string;
  lyrics: string;
  style_prompt: string;
  video_prompts: string[];
}

interface ProjectData {
  language: string;
  description: string;
  duration_seconds: number;
}

export async function generateMusicPromptsWithGPT4o(
  projectData: ProjectData, 
  apiKey: string
): Promise<GeneratedPrompts> {
  
  const prompt = `
あなたは音楽プロデューサーです。以下の情報に基づいて、SUNO AIで使用する最適な音楽プロンプトを生成してください。

言語: ${projectData.language}
説明: ${projectData.description}
長さ: ${projectData.duration_seconds}秒

以下の形式でJSONを返してください:
{
  "title": "曲のタイトル",
  "lyrics": "歌詞（各行改行区切り）",
  "style_prompt": "SUNO AI用のスタイルプロンプト",
  "video_prompts": ["映像シーン1の説明", "映像シーン2の説明", "映像シーン3の説明", "映像シーン4の説明"]
}

要件:
- 歌詞は${projectData.duration_seconds}秒の長さに適したボリューム
- スタイルプロンプトはSUNO AIで効果的
- 映像プロンプトは各シーンが${Math.floor(projectData.duration_seconds/4)}秒程度
- 全て${projectData.language}で生成
- 映像プロンプトはRunway Gen-4で効果的なシネマティック描写
`;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'You are a professional music producer and lyricist. Always respond with valid JSON only.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: 1500,
      temperature: 0.8
    })
  });

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.status} - ${response.statusText}`);
  }

  const result = await response.json();
  const content = result.choices[0].message.content;
  
  // JSONを抽出
  const jsonMatch = content.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    return JSON.parse(jsonMatch[0]);
  } else {
    throw new Error('JSON not found in response');
  }
}

// フォールバック用のモックデータ
export const getMockPrompts = (): GeneratedPrompts => ({
  title: "Cosmic Drift",
  lyrics: `Neon rivers in the night
Chasing stars till morning light
In this city, made of glass
Future memories of the past

We're on a cosmic drift, a silent flight
Painting dreams in shades of light
A fleeting moment, in the stream
Living out a vibrant dream`,
  style_prompt: "Epic cinematic synthwave, futuristic, ethereal female vocals, driving beat, atmospheric pads, reminiscent of Blade Runner soundtrack",
  video_prompts: [
    "Futuristic cityscape at night with neon lights reflecting on wet streets, cyberpunk aesthetic, cinematic wide shot",
    "Close-up of a character looking up at holographic stars and nebulae in the sky, ethereal lighting, emotional expression",
    "Abstract geometric shapes and light trails moving to electronic music, synchronized motion, vibrant colors",
    "Serene figure standing on a balcony overlooking a vast illuminated cityscape, contemplative mood, atmospheric perspective"
  ]
});

export default {
  generateMusicPromptsWithGPT4o,
  getMockPrompts
}; 