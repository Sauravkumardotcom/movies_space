import React, { useState } from 'react';
import { useMovie, useAddToWatchlist, useRemoveFromWatchlist, useSubmitRating } from '@hooks/useMovie';
import { LoadingSpinner } from '@components/Loading';
import { ErrorDisplay } from '@components/ErrorState';
import { Heart, Star, Bookmark } from 'lucide-react';

interface MovieDetailProps {
  movieId: string;
  onClose: () => void;
}

export function MovieDetailPage({ movieId, onClose }: MovieDetailProps): JSX.Element {
  const [userRating, setUserRating] = useState(0);
  const { data: movie, isLoading, error } = useMovie(movieId);
  const addToWatchlist = useAddToWatchlist();
  const removeFromWatchlist = useRemoveFromWatchlist();
  const submitRating = useSubmitRating();

  if (error) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
        <ErrorDisplay message="Failed to load movie details" onRetry={onClose} />
      </div>
    );
  }

  if (isLoading || !movie) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  const handleAddToWatchlist = async (): Promise<void> => {
    try {
      await addToWatchlist.mutateAsync(movie.id);
    } catch (err) {
      console.error('Error adding to watchlist:', err);
    }
  };

  const handleRating = async (rating: number): Promise<void> => {
    try {
      setUserRating(rating);
      await submitRating.mutateAsync({
        entityId: movie.id,
        entityType: 'movie',
        rating,
      });
    } catch (err) {
      console.error('Error submitting rating:', err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 z-50 overflow-y-auto">
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-slate-900 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header with close button */}
          <div className="sticky top-0 flex items-center justify-between p-4 bg-slate-800 border-b border-slate-700">
            <h2 className="text-2xl font-bold text-white">{movie.title}</h2>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white text-2xl font-bold"
            >
              ✕
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Poster & Info */}
            <div className="flex gap-6">
              {movie.posterUrl && (
                <img
                  src={movie.posterUrl}
                  alt={movie.title}
                  className="w-40 h-60 rounded-lg object-cover"
                />
              )}
              <div className="flex-1 space-y-4">
                <div>
                  <p className="text-sm text-slate-400 mb-1">Type</p>
                  <p className="text-white font-semibold capitalize">{movie.type}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-400 mb-1">Year</p>
                  <p className="text-white font-semibold">{movie.year}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-400 mb-1">Director</p>
                  <p className="text-white font-semibold">{movie.director}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-400 mb-1">Genres</p>
                  <div className="flex flex-wrap gap-2">
                    {movie.genre.map((g) => (
                      <span key={g} className="inline-block bg-slate-700 text-white text-xs px-3 py-1 rounded-full">
                        {g}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <p className="text-sm text-slate-400 mb-2">Description</p>
              <p className="text-white leading-relaxed">{movie.description}</p>
            </div>

            {/* Rating */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Star className="w-5 h-5 text-yellow-400" />
                <span className="text-white font-semibold">{movie.rating.toFixed(1)}/5</span>
              </div>
              <p className="text-sm text-slate-400 mb-3">Rate this movie</p>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <button
                    key={rating}
                    onClick={() => handleRating(rating)}
                    className={`w-10 h-10 rounded-lg font-semibold transition-colors ${
                      userRating >= rating
                        ? 'bg-yellow-500 text-white'
                        : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                    }`}
                  >
                    {rating}
                  </button>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={handleAddToWatchlist}
                disabled={addToWatchlist.isPending}
                className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
              >
                <Bookmark className="w-5 h-5" />
                Add to Watchlist
              </button>
              <button className="flex-1 px-4 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-semibold transition-colors flex items-center justify-center gap-2">
                <Heart className="w-5 h-5" />
                Like
              </button>
            </div>

            {/* Reviews section */}
            {movie.ratings && movie.ratings.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Recent Reviews</h3>
                <div className="space-y-3">
                  {movie.ratings.slice(0, 5).map((rating) => (
                    <div key={rating.id} className="bg-slate-800 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-white font-semibold text-sm">{rating.user.username}</span>
                        <div className="flex items-center gap-1">
                          {Array.from({ length: rating.rating }).map((_, i) => (
                            <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                          ))}
                        </div>
                      </div>
                      {rating.comment && (
                        <p className="text-slate-300 text-sm">{rating.comment}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
