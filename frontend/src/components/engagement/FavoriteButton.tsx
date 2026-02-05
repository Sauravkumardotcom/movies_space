import React from 'react';
import { useAddToFavorites, useRemoveFromFavorites, useIsFavorited } from '../hooks/useEngagement';

interface FavoriteButtonProps {
  entityId: string;
  entityType: string;
  variant?: 'icon' | 'button';
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

/**
 * FavoriteButton Component
 * Toggle favorite status for any entity (movie, music, short)
 */
export const FavoriteButton: React.FC<FavoriteButtonProps> = ({
  entityId,
  entityType,
  variant = 'icon',
  showLabel = true,
  size = 'md',
}) => {
  const { data: isFavorited, isLoading } = useIsFavorited(entityId, entityType);
  const addMutation = useAddToFavorites();
  const removeMutation = useRemoveFromFavorites();

  const isLoading_ = isLoading || addMutation.isPending || removeMutation.isPending;

  const handleToggle = () => {
    if (isFavorited) {
      removeMutation.mutate({ entityId, entityType });
    } else {
      addMutation.mutate({ entityId, entityType });
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
          isFavorited ? 'text-red-500' : 'text-gray-400'
        }`}
        title={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
      >
        {isFavorited ? '❤️' : '🤍'}
      </button>
    );
  }

  return (
    <button
      onClick={handleToggle}
      disabled={isLoading_}
      className={`${sizeClasses[size]} rounded transition-colors ${
        isFavorited
          ? 'bg-red-500 text-white hover:bg-red-600'
          : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
      } disabled:opacity-50 font-medium`}
    >
      {showLabel && (isFavorited ? 'Favorited' : 'Add to Favorites')}
      {!showLabel && (isFavorited ? '❤️' : '🤍')}
    </button>
  );
};
