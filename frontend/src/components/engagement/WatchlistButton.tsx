import React from 'react';
import { useAddToWatchlist, useRemoveFromWatchlist, useIsInWatchlist } from '../hooks/useEngagement';

interface WatchlistButtonProps {
  movieId: string;
  variant?: 'icon' | 'button';
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

/**
 * WatchlistButton Component
 * Toggle watchlist status for movies
 */
export const WatchlistButton: React.FC<WatchlistButtonProps> = ({
  movieId,
  variant = 'icon',
  showLabel = true,
  size = 'md',
}) => {
  const { data: isInWatchlist, isLoading } = useIsInWatchlist(movieId);
  const addMutation = useAddToWatchlist();
  const removeMutation = useRemoveFromWatchlist();

  const isLoading_ = isLoading || addMutation.isPending || removeMutation.isPending;

  const handleToggle = () => {
    if (isInWatchlist) {
      removeMutation.mutate(movieId);
    } else {
      addMutation.mutate(movieId);
    }
  };

  const sizeClasses = {
    sm: 'text-sm px-2 py-1',
    md: 'text-base px-3 py-2',
    lg: 'text-lg px-4 py-3',
  };

  if (variant === 'icon') {
    return (
      <button
        onClick={handleToggle}
        disabled={isLoading_}
        className={`transition-transform hover:scale-110 disabled:opacity-50 ${
          isInWatchlist ? 'text-blue-500' : 'text-gray-400'
        }`}
        title={isInWatchlist ? 'Remove from watchlist' : 'Add to watchlist'}
      >
        {isInWatchlist ? '📌' : '🔖'}
      </button>
    );
  }

  return (
    <button
      onClick={handleToggle}
      disabled={isLoading_}
      className={`${sizeClasses[size]} rounded transition-colors ${
        isInWatchlist
          ? 'bg-blue-500 text-white hover:bg-blue-600'
          : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
      } disabled:opacity-50 font-medium`}
    >
      {showLabel && (isInWatchlist ? 'In Watchlist' : 'Add to Watchlist')}
      {!showLabel && (isInWatchlist ? '📌' : '🔖')}
    </button>
  );
};
