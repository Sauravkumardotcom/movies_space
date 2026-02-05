import React from 'react';
import { MoreVertical, Trash2 } from 'lucide-react';
import type { PlaylistPreview } from '../services/music';

interface PlaylistCardProps {
  playlist: PlaylistPreview;
  onClick?: (playlist: PlaylistPreview) => void;
  onDelete?: (playlistId: string) => void;
  isLoading?: boolean;
}

export const PlaylistCard: React.FC<PlaylistCardProps> = ({
  playlist,
  onClick,
  onDelete,
  isLoading = false,
}) => {
  const [showMenu, setShowMenu] = React.useState(false);

  return (
    <div
      onClick={() => onClick?.(playlist)}
      className="bg-slate-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all cursor-pointer group"
    >
      {/* Playlist Cover (Grid of first 4 songs or placeholder) */}
      <div className="relative w-full aspect-square bg-gradient-to-br from-purple-600 to-blue-600 p-2">
        <div className="grid grid-cols-2 gap-2 w-full h-full">
          {playlist.songs.slice(0, 4).length > 0 ? (
            playlist.songs.slice(0, 4).map((song, idx) => (
              <div
                key={idx}
                className="bg-slate-700 rounded flex items-center justify-center text-xs text-slate-300 p-1 text-center truncate"
              >
                {song.title}
              </div>
            ))
          ) : (
            <div className="col-span-2 flex items-center justify-center text-slate-400">
              <span className="text-xs">Empty Playlist</span>
            </div>
          )}
        </div>

        {/* Song count overlay */}
        <div className="absolute bottom-2 right-2 bg-black/70 px-2 py-1 rounded text-xs text-white font-medium">
          {playlist._count.songs} song{playlist._count.songs !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Content */}
      <div className="p-3 space-y-2 relative">
        <div className="flex justify-between items-start gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-white truncate text-sm group-hover:text-blue-400 transition-colors">
              {playlist.title}
            </h3>

            {playlist.description && (
              <p className="text-slate-400 text-xs truncate mt-1">{playlist.description}</p>
            )}
          </div>

          {/* Menu button */}
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowMenu(!showMenu);
              }}
              className="p-1 hover:bg-slate-700 rounded transition-colors opacity-0 group-hover:opacity-100"
              disabled={isLoading}
            >
              <MoreVertical size={16} className="text-slate-300" />
            </button>

            {/* Dropdown menu */}
            {showMenu && (
              <div className="absolute right-0 mt-1 bg-slate-700 rounded shadow-lg z-10">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete?.(playlist.id);
                    setShowMenu(false);
                  }}
                  className="w-full text-left px-3 py-2 text-red-400 hover:bg-slate-600 text-sm flex items-center gap-2 transition-colors"
                  disabled={isLoading}
                >
                  <Trash2 size={14} />
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Created date */}
        <p className="text-slate-500 text-xs">
          {new Date(playlist.createdAt).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
};

export default PlaylistCard;
