import React, { useState, useEffect, useRef, useCallback } from 'react';
import { PlayIcon, AudioFileIcon } from '../constants';
import { Button } from './ui';
import type { Subtitle } from '../types';

interface AdvancedAudioPlayerProps {
  audioFile: File | null;
  subtitles: Subtitle[];
  onTimeUpdate?: (currentTime: number) => void;
  onSubtitleClick?: (subtitle: Subtitle) => void;
}

interface WaveformData {
  peaks: number[];
  duration: number;
}

const AdvancedAudioPlayer: React.FC<AdvancedAudioPlayerProps> = ({
  audioFile,
  subtitles,
  onTimeUpdate,
  onSubtitleClick
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [waveformData, setWaveformData] = useState<WaveformData | null>(null);
  const [isLoadingWaveform, setIsLoadingWaveform] = useState(false);
  const [volume, setVolume] = useState(1.0);
  const [playbackRate, setPlaybackRate] = useState(1.0);

  const audioRef = useRef<HTMLAudioElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // 音声ファイルの読み込み
  useEffect(() => {
    if (!audioFile || !audioRef.current) return;

    const audio = audioRef.current;
    const audioUrl = URL.createObjectURL(audioFile);
    
    audio.src = audioUrl;
    audio.load();

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
      onTimeUpdate?.(audio.currentTime);
    };

    const handleEnded = () => {
      setIsPlaying(false);
    };

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);

    // 波形データ生成
    generateWaveform(audioFile);

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      URL.revokeObjectURL(audioUrl);
    };
  }, [audioFile, onTimeUpdate]);

  // 波形データ生成
  const generateWaveform = useCallback(async (file: File) => {
    if (!file) return;

    setIsLoadingWaveform(true);
    
    try {
      const arrayBuffer = await file.arrayBuffer();
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
      
      const channelData = audioBuffer.getChannelData(0);
      const samples = 1000; // 波形の解像度
      const blockSize = Math.floor(channelData.length / samples);
      const peaks: number[] = [];

      for (let i = 0; i < samples; i++) {
        const start = i * blockSize;
        const end = start + blockSize;
        let max = 0;
        
        for (let j = start; j < end; j++) {
          const value = Math.abs(channelData[j]);
          if (value > max) max = value;
        }
        
        peaks.push(max);
      }

      setWaveformData({
        peaks,
        duration: audioBuffer.duration
      });
    } catch (error) {
      console.error('波形生成エラー:', error);
    } finally {
      setIsLoadingWaveform(false);
    }
  }, []);

  // 波形描画
  useEffect(() => {
    if (!waveformData || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { peaks } = waveformData;
    const width = canvas.width;
    const height = canvas.height;
    const barWidth = width / peaks.length;

    // キャンバスクリア
    ctx.clearRect(0, 0, width, height);

    // 波形描画
    peaks.forEach((peak, index) => {
      const barHeight = peak * height;
      const x = index * barWidth;
      const y = (height - barHeight) / 2;

      // 現在の再生位置より前は青、後はグレー
      const progress = currentTime / duration;
      const isPlayed = index < progress * peaks.length;
      
      ctx.fillStyle = isPlayed ? '#3b82f6' : '#d1d5db';
      ctx.fillRect(x, y, barWidth - 1, barHeight);
    });

    // 字幕位置マーカー
    subtitles.forEach((subtitle) => {
      const startTime = parseTime(subtitle.start);
      const endTime = parseTime(subtitle.end);
      
      if (startTime && endTime) {
        const startX = (startTime / duration) * width;
        const endX = (endTime / duration) * width;
        
        // 字幕範囲のハイライト
        ctx.fillStyle = 'rgba(239, 68, 68, 0.3)';
        ctx.fillRect(startX, 0, endX - startX, height);
        
        // 字幕開始位置のマーカー
        ctx.fillStyle = '#ef4444';
        ctx.fillRect(startX, 0, 2, height);
      }
    });

    // 現在位置のマーカー
    const currentX = (currentTime / duration) * width;
    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(currentX, 0, 2, height);
  }, [waveformData, currentTime, duration, subtitles]);

  // 時間文字列をパース
  const parseTime = (timeStr: string): number | null => {
    const parts = timeStr.split(':');
    if (parts.length === 3) {
      const [hours, minutes, seconds] = parts;
      const [sec, ms] = seconds.split(',');
      return parseInt(hours) * 3600 + parseInt(minutes) * 60 + parseInt(sec) + parseInt(ms || '0') / 1000;
    }
    return null;
  };

  // 再生/一時停止
  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  // シーク
  const handleSeek = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!audioRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const progress = x / rect.width;
    const newTime = progress * duration;

    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  // 字幕クリック
  const handleSubtitleClick = (subtitle: Subtitle) => {
    if (!audioRef.current) return;

    const startTime = parseTime(subtitle.start);
    if (startTime !== null) {
      audioRef.current.currentTime = startTime;
      setCurrentTime(startTime);
      onSubtitleClick?.(subtitle);
    }
  };

  // 音量変更
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  // 再生速度変更
  const handlePlaybackRateChange = (rate: number) => {
    setPlaybackRate(rate);
    if (audioRef.current) {
      audioRef.current.playbackRate = rate;
    }
  };

  // 時間フォーマット
  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
          🎵 リアルタイム音声プレビュー
        </h4>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {formatTime(currentTime)} / {formatTime(duration)}
          </span>
        </div>
      </div>

      {/* 波形表示 */}
      <div className="mb-4" ref={containerRef}>
        {isLoadingWaveform ? (
          <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              🌊 波形生成中...
            </span>
          </div>
        ) : (
          <canvas
            ref={canvasRef}
            width={800}
            height={96}
            className="w-full h-24 bg-gray-200 dark:bg-gray-700 rounded cursor-pointer"
            onClick={handleSeek}
          />
        )}
      </div>

      {/* 字幕タイムライン */}
      <div className="mb-4 max-h-32 overflow-y-auto">
        <div className="text-xs text-gray-600 dark:text-gray-400 mb-2">
          📝 字幕タイムライン (クリックでジャンプ)
        </div>
        <div className="space-y-1">
          {subtitles.map((subtitle, index) => {
            const startTime = parseTime(subtitle.start);
            const isActive = startTime !== null && 
                            currentTime >= startTime && 
                            currentTime <= parseTime(subtitle.end)!;
            
            return (
              <div
                key={subtitle.id}
                className={`p-2 rounded text-xs cursor-pointer transition-colors ${
                  isActive 
                    ? 'bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-100' 
                    : 'bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600'
                }`}
                onClick={() => handleSubtitleClick(subtitle)}
              >
                <div className="flex justify-between items-center">
                  <span className="font-medium">{subtitle.start} - {subtitle.end}</span>
                  {isActive && <span className="text-blue-600 dark:text-blue-400">▶</span>}
                </div>
                <div className="text-gray-600 dark:text-gray-300 mt-1">
                  {subtitle.text}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* コントロール */}
      <div className="flex items-center gap-4">
        <Button
          variant="primary"
          onClick={togglePlay}
          className="flex items-center gap-2"
        >
          <PlayIcon className="w-4 h-4" />
          {isPlaying ? '一時停止' : '再生'}
        </Button>

        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500 dark:text-gray-400">音量</span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={volume}
            onChange={handleVolumeChange}
            className="w-20"
          />
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {Math.round(volume * 100)}%
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500 dark:text-gray-400">速度</span>
          <select
            value={playbackRate}
            onChange={(e) => handlePlaybackRateChange(parseFloat(e.target.value))}
            className="text-xs px-2 py-1 border rounded dark:bg-gray-700 dark:border-gray-600"
          >
            <option value={0.5}>0.5x</option>
            <option value={0.75}>0.75x</option>
            <option value={1.0}>1.0x</option>
            <option value={1.25}>1.25x</option>
            <option value={1.5}>1.5x</option>
            <option value={2.0}>2.0x</option>
          </select>
        </div>
      </div>

      {/* 隠しオーディオ要素 */}
      <audio
        ref={audioRef}
        className="hidden"
        controls={false}
      />
    </div>
  );
};

export default AdvancedAudioPlayer; 