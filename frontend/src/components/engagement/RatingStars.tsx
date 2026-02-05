import React, { useState } from 'react';
import { useCreateRating, useDeleteRating, useUserRating, useRatingsSummary } from '../hooks/useEngagement';

interface RatingStarsProps {
  entityId: string;
  entityType: string;
  size?: 'sm' | 'md' | 'lg';
  showSummary?: boolean;
}

/**
 * RatingStars Component
 * Displays and allows rating an entity (movie, music, short)
 */
export const RatingStars: React.FC<RatingStarsProps> = ({
  entityId,
  entityType,
  size = 'md',
  showSummary = true,
}) => {
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [comment, setComment] = useState('');
  const [showCommentForm, setShowCommentForm] = useState(false);

  const { data: userRating } = useUserRating(entityId, entityType);
  const { data: summary } = useRatingsSummary(entityId, entityType);
  const createRatingMutation = useCreateRating();
  const deleteRatingMutation = useDeleteRating();

  const currentRating = userRating?.rating || 0;
  const displayRating = hoverRating || currentRating;

  const sizeClasses = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl',
  };

  const handleRatingClick = (rating: number) => {
    if (showCommentForm && comment) {
      createRatingMutation.mutate({
        entityId,
        entityType,
        rating,
        comment,
      });
      setComment('');
      setShowCommentForm(false);
    } else if (!showCommentForm) {
      createRatingMutation.mutate({
        entityId,
        entityType,
        rating,
        comment: userRating?.comment || '',
      });
    } else {
      setShowCommentForm(true);
    }
  };

  const handleDeleteRating = () => {
    deleteRatingMutation.mutate({ entityId, entityType });
  };

  return (
    <div className='flex flex-col gap-3'>
      {/* Stars */}
      <div className='flex items-center gap-2'>
        <div className='flex gap-1'>
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() => handleRatingClick(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(null)}
              className={`${sizeClasses[size]} transition-colors ${
                star <= displayRating ? 'text-yellow-400' : 'text-gray-300'
              } hover:text-yellow-300`}
            >
              ★
            </button>
          ))}
        </div>
        {currentRating > 0 && (
          <button
            onClick={handleDeleteRating}
            disabled={deleteRatingMutation.isPending}
            className='text-sm text-red-500 hover:text-red-700 disabled:opacity-50'
          >
            Remove
          </button>
        )}
      </div>

      {/* Comment Form */}
      {showCommentForm && (
        <div className='flex flex-col gap-2'>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder='Add a comment about your rating...'
            className='w-full p-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-500'
            rows={3}
          />
          <button
            onClick={() => {
              setShowCommentForm(false);
              setComment('');
            }}
            className='text-sm text-gray-500 hover:text-gray-700'
          >
            Cancel
          </button>
        </div>
      )}

      {/* Rating Summary */}
      {showSummary && summary && (
        <div className='flex items-center gap-2 text-sm text-gray-600'>
          <span>
            {summary.average.toFixed(1)} ⭐ ({summary.count} ratings)
          </span>
        </div>
      )}

      {/* Loading State */}
      {(createRatingMutation.isPending || deleteRatingMutation.isPending) && (
        <div className='text-xs text-gray-400'>Loading...</div>
      )}
    </div>
  );
};
