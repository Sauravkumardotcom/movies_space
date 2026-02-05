import React from 'react';
import { Music, Disc3, Plus } from 'lucide-react';

interface AudioPlayerProps {
  currentTrack: {
    id: string;
    title: string;
    artist: string;
    duration: number;
    coverUrl?: string;
  } | null;
  isPlaying: boolean;
  currentTime: number;
  onPlay: () => void;
  onPause: () => void;
  onSeek: (time: number) => void;
  onNext?: () => void;
  onPrevious?: () => void;
  onAddToQueue?: () => void;
  queue?: Array<{ id: string; title: string; artist: string }>;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({
  currentTrack,
  isPlaying,
  currentTime,
  onPlay,
  onPause,
  onSeek,
  onNext,
  onPrevious,
  onAddToQueue,
  queue = [],
}) => {
  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${String(secs).padStart(2, '0')}`;
  };

  const duration = currentTrack?.duration || 0;
  const progress = duration ? (currentTime / duration) * 100 : 0;

  if (!currentTrack) {
    return (
      <div className="bg-slate-800 border-t border-slate-700 p-4">
        <div className="flex items-center justify-center text-slate-400 space-x-2">
          <Music size={20} />
          <span className="text-sm">No track playing</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-800 border-t border-slate-700 space-y-2 p-4">
      {/* Track info and controls */}
      <div className="flex items-center gap-4">
        {/* Cover */}
        <div className="w-14 h-14 rounded bg-gradient-to-br from-blue-600 to-purple-600 flex-shrink-0 overflow-hidden">
          {currentTrack.coverUrl ? (
            <img
              src={currentTrack.coverUrl}
              alt={currentTrack.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Disc3 size={24} className="text-slate-500" />
            </div>
          )}
        </div>

        {/* Track details */}
        <div className="flex-1 min-w-0">
          <h4 className="text-white font-semibold text-sm truncate">{currentTrack.title}</h4>
          <p className="text-slate-400 text-xs truncate">{currentTrack.artist}</p>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2">
          {onPrevious && (
            <button
              onClick={onPrevious}
              className="p-2 hover:bg-slate-700 rounded-full transition-colors text-slate-300"
              title="Previous"
            >
              ⏮
            </button>
          )}

          <button
            onClick={isPlaying ? onPause : onPlay}
            className="p-2 bg-blue-600 hover:bg-blue-700 rounded-full transition-colors text-white"
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? '⏸' : '▶'}
          </button>

          {onNext && (
            <button
              onClick={onNext}
              className="p-2 hover:bg-slate-700 rounded-full transition-colors text-slate-300"
              title="Next"
            >
              ⏭
            </button>
          )}

          {onAddToQueue && (
            <button
              onClick={onAddToQueue}
              className="p-2 hover:bg-slate-700 rounded-full transition-colors text-slate-300"
              title="Add to queue"
            >
              <Plus size={18} />
            </button>
          )}
        </div>
      </div>

      {/* Progress bar */}
      <div className="space-y-1">
        <input
          type="range"
          min="0"
          max={duration || 100}
          value={currentTime}
          onChange={(e) => onSeek(parseFloat(e.target.value))}
          className="w-full h-1 bg-slate-700 rounded-full appearance-none cursor-pointer accent-blue-500"
          title="Seek"
        />

        <div className="flex justify-between text-xs text-slate-400">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Queue preview */}
      {queue.length > 0 && (
        <div className="mt-2 pt-2 border-t border-slate-700">
          <p className="text-xs text-slate-400 mb-1">Queue ({queue.length})</p>
          <div className="space-y-1 max-h-20 overflow-y-auto">
            {queue.slice(0, 3).map((track, idx) => (
              <div key={track.id} className="text-xs text-slate-500 truncate">
                {idx + 1}. {track.title} - {track.artist}
              </div>
            ))}
            {queue.length > 3 && <p className="text-xs text-slate-500">+{queue.length - 3} more</p>}
          </div>
        </div>
      )}
    </div>
  );
};

export default AudioPlayer;
