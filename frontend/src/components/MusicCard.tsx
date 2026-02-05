import React from 'react';
import { Music as MusicIcon, Disc3 } from 'lucide-react';
import type { Music } from '../services/music';

interface MusicCardProps {
  music: Music;
  onPlay?: (music: Music) => void;
  onAddToPlaylist?: (music: Music) => void;
  isPlaying?: boolean;
}

export const MusicCard: React.FC<MusicCardProps> = ({
  music,
  onPlay,
  onAddToPlaylist,
  isPlaying = false,
}) => {
  return (
    <div
      className={`group bg-slate-800 rounded-lg overflow-hidden shadow-lg transition-all hover:shadow-xl hover:scale-105 cursor-pointer ${
        isPlaying ? 'ring-2 ring-blue-500' : ''
      }`}
    >
      {/* Cover Image or Placeholder */}
      <div className="relative w-full aspect-square bg-gradient-to-br from-blue-600 to-purple-600 overflow-hidden">
        {music.coverUrl ? (
          <img
            src={music.coverUrl}
            alt={music.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-slate-700">
            <Disc3 size={48} className="text-slate-500" />
          </div>
        )}

        {/* Play button overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onPlay?.(music);
            }}
            className="bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-full transition-all"
          >
            <MusicIcon size={20} />
          </button>
        </div>

        {/* Duration badge */}
        <div className="absolute top-2 right-2 bg-black/60 px-2 py-1 rounded text-xs text-white font-medium">
          {Math.floor(music.duration / 60)}:{String(music.duration % 60).padStart(2, '0')}
        </div>
      </div>

      {/* Content */}
      <div className="p-3 space-y-2">
        <h3 className="font-semibold text-white truncate text-sm group-hover:text-blue-400 transition-colors">
          {music.title}
        </h3>

        <p className="text-slate-400 text-xs truncate">{music.artist}</p>

        {music.album && <p className="text-slate-500 text-xs truncate">{music.album}</p>}

        {/* Stats */}
        <div className="flex justify-between items-center pt-2 border-t border-slate-700 text-xs text-slate-400">
          <span>{music.plays.toLocaleString()} plays</span>
          <span className="text-red-400">♥ {music.likes.toLocaleString()}</span>
        </div>

        {/* Action button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onAddToPlaylist?.(music);
          }}
          className="w-full mt-2 bg-slate-700 hover:bg-slate-600 text-white text-xs py-1.5 rounded transition-colors"
        >
          Add to Playlist
        </button>
      </div>
    </div>
  );
};

export default MusicCard;
