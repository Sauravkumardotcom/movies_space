/**
 * MovieCard Component - MOBILE FIRST
 * Displays a single movie with poster, title, year, rating
 * Responsive aspect ratio: 1:1 mobile → 2:3 desktop
 * Touch-friendly with always-visible mobile info
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';

const MovieCard = ({ movie, onSelect, isLoading = false }) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  if (isLoading) {
    return (
      <div className="w-full aspect-square sm:aspect-[2/3] bg-gray-700 dark:bg-gray-800 rounded-lg overflow-hidden animate-pulse" />
    );
  }

  if (!movie) {
    return null;
  }

  return (
    <motion.div
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onSelect?.(movie)}
      className="group cursor-pointer flex flex-col rounded-lg overflow-hidden transition-all duration-300 will-change-transform"
    >
      {/* Poster Container - Mobile First */}
      <div className="relative w-full aspect-square sm:aspect-[2/3] overflow-hidden rounded-lg bg-gray-700 dark:bg-gray-800 border border-gray-600 dark:border-gray-700 group-hover:border-cyan-500/50 shadow-md group-hover:shadow-lg group-hover:shadow-cyan-500/20 transition-all duration-300">
        {/* Poster Image */}
        <img
          src={movie.poster}
          alt={movie.title}
          className={`w-full h-full object-cover transition-all duration-500 ${
            imageLoaded ? 'group-hover:sm:scale-110' : 'scale-100'
          }`}
          loading="lazy"
          onLoad={() => setImageLoaded(true)}
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/300x450?text=No+Poster';
            setImageLoaded(true);
          }}
        />

        {/* Mobile Info Overlay - Always Visible */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent flex flex-col justify-between p-2 sm:p-3">
          {/* Top Badges */}
          <div className="flex justify-between items-start gap-1">
            <span className="bg-yellow-500/95 text-black text-xs font-bold px-1.5 py-0.5 sm:px-2 sm:py-1 rounded">
              ⭐ {movie.imdbRating || 'N/A'}
            </span>
            {movie.type && (
              <span className="bg-cyan-500/95 text-black text-xs font-bold px-1.5 py-0.5 sm:px-2 sm:py-1 rounded capitalize">
                {movie.type}
              </span>
            )}
          </div>

          {/* Bottom Info - Mobile Visible */}
          <div className="space-y-1">
            <p className="text-white text-xs sm:text-sm font-semibold line-clamp-2">
              {movie.title}
            </p>
            <p className="text-gray-200 text-xs">
              {movie.year}
            </p>
            {/* Desktop Only Call-to-Action */}
            <p className="text-cyan-300 text-xs hidden sm:block group-hover:opacity-100 opacity-75 transition-opacity">
              Click to view details →
            </p>
          </div>
        </div>
      </div>

      {/* Card Meta - Mobile Only (Below Poster) */}
      <div className="sm:hidden mt-2 px-1">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white line-clamp-2">
          {movie.title}
        </h3>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {movie.year}
        </p>
      </div>
    </motion.div>
  );
};

export default MovieCard;
