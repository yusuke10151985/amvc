import React, { useState, useCallback, useEffect } from 'react';
import { Language } from '../types';
import type { ProjectData, Subtitle } from '../types';
import { MOCK_TITLE, MOCK_LYRICS, MOCK_SUNO_PROMPT, MOCK_SRT_CONTENT, MOCK_SUBTITLES, MOCK_VIDEO_PROMPTS, UploadIcon, FileIcon, DownloadIcon, UndoIcon, RedoIcon, AudioFileIcon, GoogleDriveIcon } from '../constants';
import { Button, Card, CodeBlock } from './ui';
import { generateMusicPromptsWithGPT4o, getMockPrompts } from '../openai_client';
import AdvancedAudioPlayer from './advanced-audio-player';

type StepProps = {
  data: ProjectData;
  setData: React.Dispatch<React.SetStateAction<ProjectData>>;
  onNext: () => void;
};

// Step 1: Music Image Input
export const Step1: React.FC<StepProps> = ({ data, setData, onNext }) => {
  const handleGenerateJson = () => {
    const payload = {
      language: data.language,
      description: data.keywords,
      duration_seconds: data.duration,
    };
    setData(prev => ({ ...prev, generatedJson: JSON.stringify(payload, null, 2) }));
  };

  return (
    <Card className="p-6 md:p-8">
      <div className="grid gap-6">
        <div>
          <label htmlFor="language" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Language</label>
          <select id="language" value={data.language} onChange={e => setData(prev => ({ ...prev, language: e.target.value as Language }))} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md">
            {Object.values(Language).map(lang => <option key={lang}>{lang}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="keywords" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Keywords / Description</label>
          <textarea id="keywords" rows={3} value={data.keywords} onChange={e => setData(prev => ({...prev, keywords: e.target.value}))} className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:ring-primary-500 focus:border-primary-500" placeholder="e.g., synthwave track about cosmic travel"></textarea>
        </div>
        <div>
          <label htmlFor="duration" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Song Duration (seconds)</label>
          <input type="number" id="duration" value={data.duration} onChange={e => setData(prev => ({...prev, duration: parseInt(e.target.value) || 0}))} className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:ring-primary-500 focus:border-primary-500" placeholder="120" />
        </div>
        <div className="flex justify-end gap-4">
          <Button variant="secondary" onClick={handleGenerateJson}>Generate JSON</Button>
          <Button onClick={onNext} disabled={!data.generatedJson}>Next Step</Button>
        </div>
        {data.generatedJson && <CodeBlock title="Generated JSON Payload" content={data.generatedJson} />}
      </div>
    </Card>
  );
};

// Step 2: SUNO AI Prompt Generation (API統合版)
export const Step2: React.FC<StepProps> = ({ data, setData, onNext }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPrompts, setGeneratedPrompts] = useState<{
    title: string;
    lyrics: string;
    style_prompt: string;
    video_prompts: string[];
  } | null>(null);
  const [apiKey, setApiKey] = useState('');
  const [useAPI, setUseAPI] = useState(false);

  const handleGenerateWithGPT4o = async () => {
    if (!apiKey) {
      alert('OpenAI APIキーを入力してください');
      return;
    }

    setIsGenerating(true);
    
    try {
      const projectData = JSON.parse(data.generatedJson);
      const result = await generateMusicPromptsWithGPT4o(projectData, apiKey);
      setGeneratedPrompts(result);
      setData(prev => ({ ...prev, videoPrompts: result.video_prompts }));
    } catch (error) {
      console.error('GPT-4o generation error:', error);
      alert('GPT-4o生成でエラーが発生しました。モックデータを使用します。');
      handleUseMockData();
    } finally {
      setIsGenerating(false);
    }
  };

  const handleUseMockData = () => {
    const mockData = getMockPrompts();
    setGeneratedPrompts(mockData);
    setData(prev => ({ ...prev, videoPrompts: mockData.video_prompts }));
  };

  const handleDownloadLyrics = () => {
    const lyrics = generatedPrompts?.lyrics || MOCK_LYRICS;
    const blob = new Blob([lyrics], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'lyrics.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Card className="p-6 md:p-8">
      <div className="mb-6">
        <div className="flex items-center space-x-4 mb-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="useAPI"
              checked={useAPI}
              onChange={(e) => setUseAPI(e.target.checked)}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label htmlFor="useAPI" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">
              🤖 GPT-4o自動生成を使用
            </label>
          </div>
        </div>

        {useAPI && (
          <div className="mb-4">
            <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              OpenAI APIキー
            </label>
            <input
              type="password"
              id="apiKey"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="sk-..."
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
            />
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              ⚠️ 本番環境では APIキーをフロントエンドで直接使用しないでください
            </p>
          </div>
        )}

        <div className="flex gap-4">
          {useAPI ? (
            <Button 
              onClick={handleGenerateWithGPT4o} 
              disabled={isGenerating || !apiKey}
              className="flex-1"
            >
              {isGenerating ? '🤖 GPT-4o生成中...' : '🤖 GPT-4oで自動生成'}
            </Button>
          ) : (
            <Button onClick={handleUseMockData} className="flex-1">
              📝 サンプルデータを使用
            </Button>
          )}
        </div>
      </div>

      {generatedPrompts && (
        <>
          <CodeBlock title="Generated Title" content={generatedPrompts.title} />
          <div>
            <CodeBlock title="Generated Lyrics" content={generatedPrompts.lyrics} />
            <div className="flex justify-end -mt-2 mb-4">
              <Button variant="secondary" onClick={handleDownloadLyrics} leftIcon={<DownloadIcon />}>
                Download .txt
              </Button>
            </div>
          </div>
          <CodeBlock title="Generated SUNO Style Prompt" content={generatedPrompts.style_prompt} />
          
          <div className="mt-4">
            <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">🎬 映像プロンプト (Runway Gen-4用)</h4>
            <div className="grid gap-2">
              {generatedPrompts.video_prompts.map((prompt, index) => (
                <div key={index} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">シーン {index + 1}:</span>
                  <p className="text-sm text-gray-900 dark:text-gray-300 mt-1">{prompt}</p>
                </div>
              ))}
            </div>
          </div>

          <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
            {useAPI ? 
              '🤖 GPT-4oで自動生成されたプロンプトです。SUNOにコピーして音楽を生成してください。' :
              '📝 サンプルプロンプトです。SUNOにコピーして音楽を生成してください。'
            }
          </p>
          
          <div className="flex justify-end mt-6">
            <Button onClick={onNext}>Next Step</Button>
          </div>
        </>
      )}
    </Card>
  );
};

// Step 3: Audio Upload
const FileDropzone: React.FC<{file: File | null, setFile: (file: File) => void, accept: string, label: string}> = ({ file, setFile, accept, label }) => {
    const [isDragging, setIsDragging] = useState(false);
    const inputId = label.replace(/\s+/g, '-').toLowerCase();

    const handleDrag = (e: React.DragEvent<HTMLDivElement>, enter: boolean) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
            setIsDragging(enter);
        }
    };
    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            setFile(e.dataTransfer.files[0]);
            e.dataTransfer.clearData();
        }
    };
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if(e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    }

    return (
        <div className="mt-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
            <div 
                onDragEnter={(e) => handleDrag(e, true)} 
                onDragLeave={(e) => handleDrag(e, false)} 
                onDragOver={(e) => handleDrag(e, true)} 
                onDrop={handleDrop}
                className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 ${isDragging ? 'border-primary-500' : 'border-gray-300 dark:border-gray-600'} border-dashed rounded-md transition-colors`}
            >
                <div className="space-y-1 text-center">
                    <UploadIcon className="mx-auto h-12 w-12 text-gray-400"/>
                    <div className="flex text-sm text-gray-600 dark:text-gray-400">
                        <label htmlFor={inputId} className="relative cursor-pointer bg-white dark:bg-gray-800/50 rounded-md font-medium text-primary-600 dark:text-primary-400 hover:text-primary-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 dark:focus-within:ring-offset-gray-900 focus-within:ring-primary-500">
                            <span>Upload a file</span>
                            <input id={inputId} name={inputId} type="file" className="sr-only" accept={accept} onChange={handleFileChange} />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{accept.replace(/,/g, ', ')}</p>
                    {file && (
                        <div className="mt-4 text-sm font-medium text-green-600 dark:text-green-400 flex items-center justify-center">
                            <FileIcon className="w-5 h-5 mr-2"/> {file.name}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export const Step3: React.FC<StepProps> = ({ data, setData, onNext }) => {
  return (
    <Card className="p-6 md:p-8">
      <div className="space-y-6">
        <FileDropzone file={data.audioFile} setFile={file => setData(prev => ({...prev, audioFile: file}))} accept=".wav" label="WAV Audio File"/>
        <FileDropzone file={data.lyricsFile} setFile={file => setData(prev => ({...prev, lyricsFile: file}))} accept=".txt" label="Lyrics Text File"/>
      </div>
       <div className="flex justify-end mt-8">
        <Button onClick={onNext} disabled={!data.audioFile || !data.lyricsFile}>Next Step</Button>
      </div>
    </Card>
  );
};

// Step 4: Subtitle Timing
export const Step4: React.FC<StepProps> = ({ data, setData, onNext }) => {
    const [isProcessing, setIsProcessing] = useState(false);
    const handleProcess = () => {
        setIsProcessing(true);
        setTimeout(() => {
            setData(prev => ({...prev, srtContent: MOCK_SRT_CONTENT, subtitles: MOCK_SUBTITLES}));
            setIsProcessing(false);
        }, 2000);
    };

    const handleDownload = () => {
        const blob = new Blob([data.srtContent], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'subtitles.srt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return (
        <Card className="p-6 md:p-8">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Subtitle Timing</h3>
                <Button onClick={handleProcess} disabled={isProcessing || !!data.srtContent}>
                    {isProcessing ? 'Processing...' : 'Process Timings'}
                </Button>
            </div>
            {isProcessing && <div className="mt-4 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5"><div className="bg-primary-600 h-2.5 rounded-full animate-pulse"></div></div>}
            {data.srtContent && (
                <div className="mt-6">
                    <CodeBlock title="Generated SRT File" content={data.srtContent} />
                    <div className="flex justify-end gap-4 mt-4">
                        <Button variant="secondary" onClick={handleDownload} leftIcon={<DownloadIcon/>}>Download .srt</Button>
                        <Button onClick={onNext}>Next Step</Button>
                    </div>
                </div>
            )}
        </Card>
    );
};


// Step 5: 高度な字幕編集（波形表示・リアルタイムプレビュー統合版）
export const Step5: React.FC<StepProps> = ({ data, setData, onNext }) => {
    const [history, setHistory] = useState<Subtitle[][]>([]);
    const [redoStack, setRedoStack] = useState<Subtitle[][]>([]);
    const [currentEditingIndex, setCurrentEditingIndex] = useState<number | null>(null);

    const updateSubtitles = (newSubtitles: Subtitle[]) => {
        setHistory(prev => [...prev, data.subtitles]);
        setRedoStack([]); // Clear redo stack on new action
        setData(prev => ({ ...prev, subtitles: newSubtitles }));
    };

    const handleSubtitleChange = (index: number, field: keyof Subtitle, value: string) => {
        const newSubtitles = [...data.subtitles];
        newSubtitles[index] = { ...newSubtitles[index], [field]: value };
        updateSubtitles(newSubtitles);
    };
    
    const handleUndo = useCallback(() => {
        if (history.length === 0) return;
        const previousState = history[history.length - 1];
        setHistory(history.slice(0, -1));
        setRedoStack(prev => [data.subtitles, ...prev]);
        setData(prev => ({...prev, subtitles: previousState}));
    }, [history, data.subtitles, setData]);

    const handleRedo = useCallback(() => {
        if (redoStack.length === 0) return;
        const nextState = redoStack[0];
        setRedoStack(redoStack.slice(1));
        setHistory(prev => [...prev, data.subtitles]);
        setData(prev => ({...prev, subtitles: nextState}));
    }, [redoStack, data.subtitles, setData]);

    // 音声プレイヤーからの時間更新ハンドラー
    const handleTimeUpdate = useCallback((currentTime: number) => {
        // 現在の時間に対応する字幕を強調表示
        const activeIndex = data.subtitles.findIndex(sub => {
            const parseTime = (timeStr: string): number | null => {
                const parts = timeStr.split(':');
                if (parts.length === 3) {
                    const [hours, minutes, seconds] = parts;
                    const [sec, ms] = seconds.split(',');
                    return parseInt(hours) * 3600 + parseInt(minutes) * 60 + parseInt(sec) + parseInt(ms || '0') / 1000;
                }
                return null;
            };
            
            const startTime = parseTime(sub.start);
            const endTime = parseTime(sub.end);
            return startTime !== null && endTime !== null && 
                   currentTime >= startTime && currentTime <= endTime;
        });
        
        if (activeIndex !== -1) {
            setCurrentEditingIndex(activeIndex);
        }
    }, [data.subtitles]);

    // 字幕クリック時のハンドラー
    const handleSubtitleClick = useCallback((subtitle: Subtitle) => {
        const index = data.subtitles.findIndex(sub => sub.id === subtitle.id);
        if (index !== -1) {
            setCurrentEditingIndex(index);
        }
    }, [data.subtitles]);

    // SRTファイル保存
    const handleSaveSrt = () => {
        const srtContent = data.subtitles.map(sub => 
            `${sub.id}\n${sub.start} --> ${sub.end}\n${sub.text}\n`
        ).join('\n');
        
        const blob = new Blob([srtContent], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'edited_subtitles.srt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return (
        <Card className="p-6 md:p-8">
            <div className="space-y-6">
                {/* ヘッダー */}
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                        🎬 高度な字幕編集
                    </h3>
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" onClick={handleUndo} disabled={history.length === 0} aria-label="Undo">
                            <UndoIcon className="w-5 h-5"/>
                        </Button>
                        <Button variant="ghost" onClick={handleRedo} disabled={redoStack.length === 0} aria-label="Redo">
                            <RedoIcon className="w-5 h-5"/>
                        </Button>
                    </div>
                </div>

                {/* 高度なオーディオプレイヤー（波形表示付き） */}
                <AdvancedAudioPlayer
                    audioFile={data.audioFile}
                    subtitles={data.subtitles}
                    onTimeUpdate={handleTimeUpdate}
                    onSubtitleClick={handleSubtitleClick}
                />

                {/* 字幕編集エリア */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* 字幕リスト */}
                    <div className="space-y-4">
                        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            📝 字幕一覧
                        </h4>
                        <div className="max-h-[400px] overflow-y-auto pr-2 space-y-3 border rounded-lg p-4 dark:border-gray-600">
                            {data.subtitles.map((sub, index) => (
                                <div 
                                    key={sub.id} 
                                    className={`p-3 rounded-lg border transition-colors ${
                                        currentEditingIndex === index 
                                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-400' 
                                            : 'border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                                    }`}
                                    onClick={() => setCurrentEditingIndex(index)}
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                                            字幕 #{sub.id}
                                        </span>
                                        {currentEditingIndex === index && (
                                            <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded">
                                                編集中
                                            </span>
                                        )}
                                    </div>
                                    <div className="grid grid-cols-2 gap-2 mb-2">
                                        <input 
                                            type="text" 
                                            value={sub.start} 
                                            onChange={e => handleSubtitleChange(index, 'start', e.target.value)} 
                                            className="text-xs bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded px-2 py-1 focus:ring-primary-500 focus:border-primary-500"
                                            placeholder="開始時間"
                                        />
                                        <input 
                                            type="text" 
                                            value={sub.end} 
                                            onChange={e => handleSubtitleChange(index, 'end', e.target.value)} 
                                            className="text-xs bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded px-2 py-1 focus:ring-primary-500 focus:border-primary-500"
                                            placeholder="終了時間"
                                        />
                                    </div>
                                    <textarea
                                        value={sub.text} 
                                        onChange={e => handleSubtitleChange(index, 'text', e.target.value)} 
                                        className="w-full text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded px-2 py-1 focus:ring-primary-500 focus:border-primary-500"
                                        placeholder="字幕テキスト"
                                        rows={2}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* 詳細編集パネル */}
                    <div className="space-y-4">
                        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            ⚙️ 詳細編集
                        </h4>
                        {currentEditingIndex !== null && currentEditingIndex < data.subtitles.length ? (
                            <div className="border rounded-lg p-4 dark:border-gray-600 space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        字幕 #{data.subtitles[currentEditingIndex].id} の編集
                                    </label>
                                    
                                    <div className="space-y-3">
                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">開始時間</label>
                                                <input 
                                                    type="text" 
                                                    value={data.subtitles[currentEditingIndex].start}
                                                    onChange={e => handleSubtitleChange(currentEditingIndex, 'start', e.target.value)}
                                                    className="w-full text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">終了時間</label>
                                                <input 
                                                    type="text" 
                                                    value={data.subtitles[currentEditingIndex].end}
                                                    onChange={e => handleSubtitleChange(currentEditingIndex, 'end', e.target.value)}
                                                    className="w-full text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
                                                />
                                            </div>
                                        </div>
                                        
                                        <div>
                                            <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">字幕テキスト</label>
                                            <textarea
                                                value={data.subtitles[currentEditingIndex].text}
                                                onChange={e => handleSubtitleChange(currentEditingIndex, 'text', e.target.value)}
                                                className="w-full text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
                                                rows={4}
                                                placeholder="字幕のテキストを入力..."
                                            />
                                        </div>

                                        <div className="flex gap-2">
                                            <Button 
                                                variant="secondary" 
                                                className="text-xs"
                                                onClick={() => {
                                                    if (currentEditingIndex > 0) {
                                                        setCurrentEditingIndex(currentEditingIndex - 1);
                                                    }
                                                }}
                                                disabled={currentEditingIndex === 0}
                                            >
                                                ← 前の字幕
                                            </Button>
                                            <Button 
                                                variant="secondary" 
                                                className="text-xs"
                                                onClick={() => {
                                                    if (currentEditingIndex < data.subtitles.length - 1) {
                                                        setCurrentEditingIndex(currentEditingIndex + 1);
                                                    }
                                                }}
                                                disabled={currentEditingIndex === data.subtitles.length - 1}
                                            >
                                                次の字幕 →
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="border rounded-lg p-4 dark:border-gray-600 flex items-center justify-center text-gray-500 dark:text-gray-400">
                                字幕をクリックして編集を開始してください
                            </div>
                        )}
                    </div>
                </div>

                {/* アクション */}
                <div className="flex justify-between items-center pt-4 border-t dark:border-gray-600">
                    <Button variant="secondary" onClick={handleSaveSrt} leftIcon={<DownloadIcon />}>
                        編集済み字幕をダウンロード
                    </Button>
                    <div className="flex gap-4">
                        <Button variant="secondary">下書き保存</Button>
                        <Button onClick={onNext}>Next Step</Button>
                    </div>
                </div>
            </div>
        </Card>
    );
};

// Step 6: Video Generation
export const Step6: React.FC<StepProps> = ({ data, setData, onNext }) => {
    const [isGenerating, setIsGenerating] = useState(false);

    useEffect(() => {
        let intervalId: number | undefined;
        if (isGenerating) {
            setData(prev => ({ ...prev, videoProgress: 0 }));
            intervalId = window.setInterval(() => {
                setData(prev => {
                    const newProgress = prev.videoProgress + 10;
                    if (newProgress >= 100) {
                        if (intervalId) window.clearInterval(intervalId);
                        setIsGenerating(false);
                        return { ...prev, videoProgress: 100 };
                    }
                    return { ...prev, videoProgress: newProgress };
                });
            }, 500);
        }
        return () => {
            if(intervalId) {
                window.clearInterval(intervalId);
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isGenerating, setData]);
    
    return (
        <Card className="p-6 md:p-8">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Video Scene Generation</h3>
            <div className="mt-4 space-y-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">GPT-4o has suggested the following video prompts for Runway Gen-4. You can edit them before generation.</p>
                {MOCK_VIDEO_PROMPTS.map((prompt, index) => (
                    <div key={index}>
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Prompt {index+1}</label>
                        <textarea rows={2} defaultValue={prompt} className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:ring-primary-500 focus:border-primary-500"></textarea>
                    </div>
                ))}
            </div>
            <div className="mt-8">
                <Button onClick={() => setIsGenerating(true)} disabled={isGenerating || data.videoProgress === 100}>
                    {isGenerating ? 'Generating...' : (data.videoProgress === 100 ? 'Generation Complete' : 'Generate Video')}
                </Button>
            </div>
            {(isGenerating || data.videoProgress > 0) && (
                <div className="mt-6">
                    <div className="flex justify-between mb-1">
                        <span className="text-base font-medium text-primary-700 dark:text-white">Generation Progress</span>
                        <span className="text-sm font-medium text-primary-700 dark:text-white">{data.videoProgress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                        <div className="bg-primary-600 h-2.5 rounded-full" style={{ width: `${data.videoProgress}%`, transition: 'width 0.5s ease-in-out' }}></div>
                    </div>
                </div>
            )}
            <div className="flex justify-end mt-6">
                <Button onClick={onNext} disabled={data.videoProgress < 100}>Next Step</Button>
            </div>
        </Card>
    );
};

// Step 7: Final Download
export const Step7: React.FC<{onRestart: () => void}> = ({ onRestart }) => {
    return (
        <Card className="p-6 md:p-8">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white text-center">Your Music Video is Ready!</h3>
            <div className="mt-6 aspect-video bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                <img src="https://picsum.photos/seed/musicvideo/500/281" alt="Video thumbnail" className="rounded-lg object-cover w-full h-full"/>
            </div>
            <div className="mt-8 flex flex-col items-center gap-4">
                <div className="flex flex-col sm:flex-row gap-4">
                    <Button className="w-full sm:w-auto text-base px-8 py-3" leftIcon={<DownloadIcon />}>Download Final Video (MP4)</Button>
                    <Button variant="secondary" className="w-full sm:w-auto text-base px-8 py-3" leftIcon={<GoogleDriveIcon />}>Save to Google Drive</Button>
                </div>
                <div className="flex flex-wrap justify-center gap-4 mt-4">
                    <Button variant="secondary">Project Data (JSON)</Button>
                    <Button variant="secondary">Subtitles (SRT)</Button>
                    <Button variant="secondary">Project Logs (TXT)</Button>
                </div>
                 <div className="mt-8">
                    <Button variant="ghost" onClick={onRestart}>Start a New Project</Button>
                </div>
            </div>
        </Card>
    );
};