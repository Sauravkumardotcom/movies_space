import React from 'react';
import { Star } from 'lucide-react';
import type { Movie } from '@types/media';

interface MovieCardProps {
  movie: Movie;
  onClick?: () => void;
}

export function MovieCard({ movie, onClick }: MovieCardProps): JSX.Element {
  return (
    <div
      onClick={onClick}
      className="group cursor-pointer rounded-lg overflow-hidden bg-slate-900 hover:bg-slate-800 transition-colors duration-200"
    >
      {/* Poster */}
      <div className="relative aspect-video bg-slate-800 overflow-hidden">
        {movie.posterUrl ? (
          <img
            src={movie.posterUrl}
            alt={movie.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-400">
            No image
          </div>
        )}

        {/* Rating badge */}
        <div className="absolute top-2 right-2 bg-black bg-opacity-75 rounded px-2 py-1 flex items-center gap-1">
          <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
          <span className="text-sm font-semibold text-white">{movie.rating.toFixed(1)}</span>
        </div>
      </div>

      {/* Info */}
      <div className="p-3">
        <h3 className="font-semibold text-white line-clamp-2 text-sm mb-1">{movie.title}</h3>
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span>{movie.year}</span>
          <span>{Math.floor(movie.duration / 60)}h {movie.duration % 60}m</span>
        </div>
        <div className="mt-2 flex flex-wrap gap-1">
          {movie.genre.slice(0, 2).map((g) => (
            <span key={g} className="inline-block bg-slate-700 text-white text-xs px-2 py-0.5 rounded">
              {g}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
