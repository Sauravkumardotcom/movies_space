/**
 * MovieDetailModal Component - MOBILE FIRST
 * Fullscreen on mobile, centered on desktop
 * Responsive layout with stacking on small screens
 */

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SkeletonMovieDetails } from './SkeletonLoader';
import { openYouTubeTrailerSearch, getIMDbTrailerLink } from '../services/youtubeService';

const MovieDetailModal = ({ 
  movie, 
  isOpen, 
  onClose, 
  isLoading = false,
  onAddToFavorites,
  onAddToWatchlist,
  isFavorite = false,
  isInWatchlist = false
}) => {
  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop - Premium blur effect */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/85 z-40 backdrop-blur-xl"
          />

          {/* Modal - Mobile Fullscreen, Desktop Premium Centered */}
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="fixed inset-0 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 w-full md:w-full md:max-w-4xl h-full md:h-auto md:max-h-[92vh] overflow-y-auto bg-gradient-to-b from-gray-900 to-black dark:bg-gradient-to-b dark:from-gray-900 dark:to-gray-950 md:rounded-2xl shadow-2xl z-50 md:border md:border-white/10"
          >
            {/* Loading State */}
            {isLoading ? (
              <div className="p-4 sm:p-6 md:p-8">
                <SkeletonMovieDetails />
              </div>
            ) : movie ? (
              <>
                {/* Close Button - Fixed on Mobile, Absolute on Desktop */}
                <motion.button
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onClose}
                  className="fixed md:absolute top-4 right-4 bg-gray-800/80 hover:bg-red-600 backdrop-blur-sm text-white p-3 rounded-full z-50 transition-colors shadow-lg border border-white/20"
                  title="Close"
                  aria-label="Close modal"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </motion.button>

                {/* Header with Poster and Title - Stacked on Mobile */}
                <div className="relative">
                  {/* Poster Background */}
                  <div className="absolute inset-0 h-48 sm:h-64 md:h-64 overflow-hidden opacity-10 dark:opacity-20">
                    <img
                      src={movie.poster}
                      alt={movie.title}
                      className="w-full h-full object-cover blur-lg"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-900" />
                  </div>

                  {/* Content - Stacked on Mobile */}
                  <div className="relative p-4 sm:p-6 md:p-8 flex flex-col md:flex-row gap-4 md:gap-6">
                    {/* Poster Image */}
                    <motion.img
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      src={movie.poster}
                      alt={movie.title}
                      className="w-full sm:w-40 md:w-40 h-auto sm:h-56 md:h-56 rounded-lg shadow-lg object-cover flex-shrink-0"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/300x450?text=No+Poster';
                      }}
                    />

                    {/* Title and Basic Info */}
                    <div className="flex-1 min-w-0">
                      <h1 className="text-3xl sm:text-4xl md:text-4xl font-bold text-white mb-3 line-clamp-3">
                        {movie.title}
                      </h1>

                      {/* Year and Type */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        <span className="bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 px-2.5 py-1 rounded text-xs sm:text-sm font-medium">
                          {movie.year}
                        </span>
                        {movie.type && (
                          <span className="bg-purple-500/20 text-purple-600 dark:text-purple-400 px-2.5 py-1 rounded text-xs sm:text-sm font-medium capitalize">
                            {movie.type}
                          </span>
                        )}
                        {movie.rated !== 'N/A' && (
                          <span className="bg-orange-500/20 text-orange-600 dark:text-orange-400 px-2.5 py-1 rounded text-xs sm:text-sm font-medium">
                            {movie.rated}
                          </span>
                        )}
                      </div>

                      {/* Rating - Responsive */}
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 mb-4">
                        {movie.imdbRating > 0 && (
                          <div className="flex items-center gap-2">
                            <span className="text-yellow-500 text-2xl sm:text-2xl font-bold">
                              ⭐ {movie.imdbRating}
                            </span>
                            <span className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm">
                              ({movie.imdbVotes})
                            </span>
                          </div>
                        )}
                        {movie.metascore && (
                          <div className="flex items-center gap-2">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-cyan-600 rounded flex items-center justify-center flex-shrink-0">
                              <span className="text-white font-bold text-sm sm:text-base">{movie.metascore}</span>
                            </div>
                            <span className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm">Metascore</span>
                          </div>
                        )}
                      </div>

                      {/* Action Buttons - Full Width on Mobile */}
                      <div className="flex gap-2 flex-col sm:flex-row flex-wrap">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => onAddToFavorites?.(movie)}
                          className={`flex-1 min-w-max px-3 sm:px-4 py-2.5 sm:py-2 rounded-lg font-semibold transition-colors text-sm sm:text-base ${
                            isFavorite
                              ? 'bg-red-600 text-white'
                              : 'bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-400 dark:hover:bg-gray-600'
                          }`}
                        >
                          {isFavorite ? '❤️ Favorite' : '🤍 Favorite'}
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => onAddToWatchlist?.(movie)}
                          className={`flex-1 min-w-max px-3 sm:px-4 py-2.5 sm:py-2 rounded-lg font-semibold transition-colors text-sm sm:text-base ${
                            isInWatchlist
                              ? 'bg-cyan-600 text-white'
                              : 'bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-400 dark:hover:bg-gray-600'
                          }`}
                        >
                          {isInWatchlist ? '✓ Watchlist' : '+ Watchlist'}
                        </motion.button>
                        
                        {/* Trailer Button */}
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => openYouTubeTrailerSearch(movie.title, movie.year)}
                          title="Search for trailer on YouTube"
                          className="flex-1 min-w-max px-3 sm:px-4 py-2.5 sm:py-2 rounded-lg font-semibold transition-colors text-sm sm:text-base bg-purple-600 hover:bg-purple-700 text-white"
                        >
                          🎬 Trailer
                        </motion.button>

                        {/* IMDb Link Button */}
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => window.open(`https://www.imdb.com/title/${movie.id}`, '_blank', 'noopener,noreferrer')}
                          title="View on IMDb"
                          className="flex-1 min-w-max px-3 sm:px-4 py-2.5 sm:py-2 rounded-lg font-semibold transition-colors text-sm sm:text-base bg-yellow-600 hover:bg-yellow-700 text-white"
                        >
                          IMDb
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Main Content */}
                <div className="p-4 sm:p-6 md:p-8 border-t border-gray-300 dark:border-gray-800 space-y-4 sm:space-y-6">
                  {/* Key Information Grid - Responsive Columns */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-3 sm:gap-4">
                    {movie.runtime !== 'N/A' && (
                      <div>
                        <p className="text-gray-600 dark:text-gray-500 text-xs sm:text-sm font-medium">Runtime</p>
                        <p className="text-gray-900 dark:text-white font-semibold text-sm sm:text-base">{movie.runtime}</p>
                      </div>
                    )}
                    {movie.released !== 'N/A' && (
                      <div>
                        <p className="text-gray-600 dark:text-gray-500 text-xs sm:text-sm font-medium">Released</p>
                        <p className="text-gray-900 dark:text-white font-semibold text-sm sm:text-base">{movie.released}</p>
                      </div>
                    )}
                    {movie.genre.length > 0 && (
                      <div>
                        <p className="text-gray-600 dark:text-gray-500 text-xs sm:text-sm font-medium">Genre</p>
                        <p className="text-gray-900 dark:text-white font-semibold text-xs sm:text-sm">{movie.genre.join(', ')}</p>
                      </div>
                    )}
                    {movie.language !== 'N/A' && (
                      <div>
                        <p className="text-gray-600 dark:text-gray-500 text-xs sm:text-sm font-medium">Language</p>
                        <p className="text-gray-900 dark:text-white font-semibold text-sm sm:text-base">{movie.language}</p>
                      </div>
                    )}
                    {movie.country !== 'N/A' && (
                      <div>
                        <p className="text-gray-600 dark:text-gray-500 text-xs sm:text-sm font-medium">Country</p>
                        <p className="text-gray-900 dark:text-white font-semibold text-sm sm:text-base">{movie.country}</p>
                      </div>
                    )}
                    {movie.dvdRelease !== 'N/A' && (
                      <div>
                        <p className="text-gray-600 dark:text-gray-500 text-xs sm:text-sm font-medium">DVD Release</p>
                        <p className="text-gray-900 dark:text-white font-semibold text-sm sm:text-base">{movie.dvdRelease}</p>
                      </div>
                    )}
                  </div>

                  {/* Director, Writer, Actors */}
                  <div className="space-y-3 sm:space-y-4">
                    {movie.director !== 'N/A' && (
                      <div>
                        <p className="text-gray-600 dark:text-gray-500 text-xs sm:text-sm font-medium">Director</p>
                        <p className="text-gray-900 dark:text-white text-sm sm:text-base">{movie.director}</p>
                      </div>
                    )}
                    {movie.writer !== 'N/A' && (
                      <div>
                        <p className="text-gray-600 dark:text-gray-500 text-xs sm:text-sm font-medium">Writer</p>
                        <p className="text-gray-900 dark:text-white text-sm sm:text-base">{movie.writer}</p>
                      </div>
                    )}
                    {movie.actors.length > 0 && (
                      <div>
                        <p className="text-gray-600 dark:text-gray-500 text-xs sm:text-sm font-medium">Actors</p>
                        <p className="text-gray-900 dark:text-white text-sm sm:text-base">{movie.actors.join(', ')}</p>
                      </div>
                    )}
                  </div>

                  {/* Plot */}
                  {movie.plot !== 'N/A' && (
                    <div>
                      <p className="text-gray-600 dark:text-gray-500 text-xs sm:text-sm font-medium">Plot</p>
                      <p className="text-gray-900 dark:text-white leading-relaxed text-sm sm:text-base">{movie.plot}</p>
                    </div>
                  )}

                  {/* Additional Info */}
                  <div className="space-y-2 sm:space-y-3 pt-4 border-t border-gray-300 dark:border-gray-800">
                    {movie.awards !== 'N/A' && (
                      <p className="text-xs sm:text-sm text-yellow-600 dark:text-yellow-400">🏆 {movie.awards}</p>
                    )}
                    {movie.boxOffice !== 'N/A' && (
                      <p className="text-xs sm:text-sm text-green-600 dark:text-green-400">💰 {movie.boxOffice}</p>
                    )}
                    {movie.production !== 'N/A' && (
                      <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">🎬 Production: {movie.production}</p>
                    )}
                    <p className="text-xs text-gray-500 dark:text-gray-500">IMDb ID: {movie.id}</p>
                  </div>

                  {/* Bottom Spacing for Mobile */}
                  <div className="h-4 md:h-0" />
                </div>
              </>
            ) : (
              <div className="p-6 text-center text-gray-600 dark:text-gray-400">
                No movie data available
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MovieDetailModal;
