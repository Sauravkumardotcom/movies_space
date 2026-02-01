/**
 * MovieDetailModal Component
 * Displays detailed information about a movie in a modal
 */

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SkeletonMovieDetails } from './SkeletonLoader';

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
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 z-40 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-gray-900 rounded-2xl shadow-2xl z-50 border border-gray-800"
          >
            {/* Loading State */}
            {isLoading ? (
              <div className="p-6">
                <SkeletonMovieDetails />
              </div>
            ) : movie ? (
              <>
                {/* Close Button */}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onClose}
                  className="absolute top-4 right-4 bg-gray-800 hover:bg-red-600 text-white p-2 rounded-full z-10 transition-colors"
                  title="Close"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </motion.button>

                {/* Header with Poster and Title */}
                <div className="relative">
                  {/* Poster Background */}
                  <div className="absolute inset-0 h-64 overflow-hidden opacity-20">
                    <img
                      src={movie.poster}
                      alt={movie.title}
                      className="w-full h-full object-cover blur-lg"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-900" />
                  </div>

                  {/* Content */}
                  <div className="relative p-6 flex gap-6">
                    {/* Poster Image */}
                    <motion.img
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      src={movie.poster}
                      alt={movie.title}
                      className="w-32 h-48 rounded-lg shadow-lg object-cover flex-shrink-0"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/300x450?text=No+Poster';
                      }}
                    />

                    {/* Title and Basic Info */}
                    <div className="flex-1 min-w-0">
                      <h1 className="text-3xl font-bold text-white mb-2 line-clamp-2">
                        {movie.title}
                      </h1>

                      {/* Year and Type */}
                      <div className="flex gap-3 mb-4">
                        <span className="bg-cyan-500/20 text-cyan-400 px-3 py-1 rounded text-sm">
                          {movie.year}
                        </span>
                        {movie.type && (
                          <span className="bg-purple-500/20 text-purple-400 px-3 py-1 rounded text-sm capitalize">
                            {movie.type}
                          </span>
                        )}
                        {movie.rated !== 'N/A' && (
                          <span className="bg-orange-500/20 text-orange-400 px-3 py-1 rounded text-sm">
                            {movie.rated}
                          </span>
                        )}
                      </div>

                      {/* Rating */}
                      <div className="flex items-center gap-4 mb-4">
                        {movie.imdbRating > 0 && (
                          <div className="flex items-center gap-2">
                            <span className="text-yellow-400 text-2xl font-bold">
                              ⭐ {movie.imdbRating}
                            </span>
                            <span className="text-gray-400 text-sm">
                              ({movie.imdbVotes})
                            </span>
                          </div>
                        )}
                        {movie.metascore && (
                          <div className="flex items-center gap-2">
                            <div className="w-12 h-12 bg-cyan-600 rounded flex items-center justify-center">
                              <span className="text-white font-bold">{movie.metascore}</span>
                            </div>
                            <span className="text-gray-400 text-sm">Metascore</span>
                          </div>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-3">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => onAddToFavorites?.(movie)}
                          className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                            isFavorite
                              ? 'bg-red-600 text-white'
                              : 'bg-gray-700 text-white hover:bg-gray-600'
                          }`}
                        >
                          {isFavorite ? '❤️ Favorite' : '🤍 Favorite'}
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => onAddToWatchlist?.(movie)}
                          className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                            isInWatchlist
                              ? 'bg-cyan-600 text-white'
                              : 'bg-gray-700 text-white hover:bg-gray-600'
                          }`}
                        >
                          {isInWatchlist ? '✓ Watchlist' : '+ Watchlist'}
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Main Content */}
                <div className="p-6 border-t border-gray-800 space-y-6">
                  {/* Key Information Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {movie.runtime !== 'N/A' && (
                      <div>
                        <p className="text-gray-500 text-sm">Runtime</p>
                        <p className="text-white font-semibold">{movie.runtime}</p>
                      </div>
                    )}
                    {movie.released !== 'N/A' && (
                      <div>
                        <p className="text-gray-500 text-sm">Released</p>
                        <p className="text-white font-semibold">{movie.released}</p>
                      </div>
                    )}
                    {movie.genre.length > 0 && (
                      <div>
                        <p className="text-gray-500 text-sm">Genre</p>
                        <p className="text-white font-semibold text-sm">{movie.genre.join(', ')}</p>
                      </div>
                    )}
                    {movie.language !== 'N/A' && (
                      <div>
                        <p className="text-gray-500 text-sm">Language</p>
                        <p className="text-white font-semibold">{movie.language}</p>
                      </div>
                    )}
                    {movie.country !== 'N/A' && (
                      <div>
                        <p className="text-gray-500 text-sm">Country</p>
                        <p className="text-white font-semibold">{movie.country}</p>
                      </div>
                    )}
                    {movie.dvdRelease !== 'N/A' && (
                      <div>
                        <p className="text-gray-500 text-sm">DVD Release</p>
                        <p className="text-white font-semibold">{movie.dvdRelease}</p>
                      </div>
                    )}
                  </div>

                  {/* Director, Writer, Actors */}
                  <div className="space-y-4">
                    {movie.director !== 'N/A' && (
                      <div>
                        <p className="text-gray-500 text-sm">Director</p>
                        <p className="text-white">{movie.director}</p>
                      </div>
                    )}
                    {movie.writer !== 'N/A' && (
                      <div>
                        <p className="text-gray-500 text-sm">Writer</p>
                        <p className="text-white">{movie.writer}</p>
                      </div>
                    )}
                    {movie.actors.length > 0 && (
                      <div>
                        <p className="text-gray-500 text-sm">Actors</p>
                        <p className="text-white">{movie.actors.join(', ')}</p>
                      </div>
                    )}
                  </div>

                  {/* Plot */}
                  {movie.plot !== 'N/A' && (
                    <div>
                      <p className="text-gray-500 text-sm">Plot</p>
                      <p className="text-white leading-relaxed">{movie.plot}</p>
                    </div>
                  )}

                  {/* Additional Info */}
                  <div className="space-y-3 pt-4 border-t border-gray-800">
                    {movie.awards !== 'N/A' && (
                      <p className="text-sm text-yellow-400">🏆 {movie.awards}</p>
                    )}
                    {movie.boxOffice !== 'N/A' && (
                      <p className="text-sm text-green-400">💰 {movie.boxOffice}</p>
                    )}
                    {movie.production !== 'N/A' && (
                      <p className="text-sm text-gray-400">🎬 Production: {movie.production}</p>
                    )}
                    <p className="text-xs text-gray-500">IMDb ID: {movie.id}</p>
                  </div>
                </div>
              </>
            ) : (
              <div className="p-6 text-center text-gray-400">
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
