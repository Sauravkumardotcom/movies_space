import React from 'react';
import { X } from 'lucide-react';

interface GenreFilterProps {
  genres: string[];
  selectedGenre: string | undefined;
  onSelect: (genre: string | undefined) => void;
  isLoading?: boolean;
}

export function GenreFilter({
  genres,
  selectedGenre,
  onSelect,
  isLoading,
}: GenreFilterProps): JSX.Element {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2">
      <button
        onClick={() => onSelect(undefined)}
        className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors flex-shrink-0 ${
          !selectedGenre
            ? 'bg-blue-600 text-white'
            : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
        }`}
      >
        All
      </button>

      {genres.map((genre) => (
        <button
          key={genre}
          onClick={() => onSelect(selectedGenre === genre ? undefined : genre)}
          className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors flex-shrink-0 ${
            selectedGenre === genre
              ? 'bg-blue-600 text-white'
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
          }`}
          disabled={isLoading}
        >
          {genre}
        </button>
      ))}
    </div>
  );
}
