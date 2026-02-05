import React from 'react';
import type { Short } from '@types/media';

interface ShortCardProps {
  short: Short;
  onClick?: () => void;
}

export function ShortCard({ short, onClick }: ShortCardProps): JSX.Element {
  return (
    <div
      onClick={onClick}
      className="group cursor-pointer rounded-lg overflow-hidden bg-slate-900 hover:bg-slate-800 transition-colors duration-200"
    >
      {/* Video thumbnail */}
      <div className="relative aspect-square bg-slate-800 overflow-hidden">
        {short.thumbnailUrl ? (
          <img
            src={short.thumbnailUrl}
            alt={short.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-400">
            No thumbnail
          </div>
        )}

        {/* Duration overlay */}
        <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 rounded px-2 py-1 text-xs font-semibold text-white">
          {Math.floor(short.duration / 60)}:{String(short.duration % 60).padStart(2, '0')}
        </div>
      </div>

      {/* Info */}
      <div className="p-3">
        <h3 className="font-semibold text-white line-clamp-2 text-sm mb-2">{short.title}</h3>
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span>❤️ {short.likes.toLocaleString()}</span>
          <span>👁️ {short.views.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}
