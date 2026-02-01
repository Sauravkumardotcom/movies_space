/**
 * MovieCard Component - MODERN PREMIUM DESIGN
 * Displays a single movie with poster, title, year, rating
 * Responsive aspect ratio: 1:1 mobile → 2:3 desktop
 * Enhanced visuals with floating badges and subtle animations
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';

const MovieCard = ({ movie, onSelect, isLoading = false }) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  if (isLoading) {
    return (
      <div className="w-full aspect-square sm:aspect-[2/3] bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl overflow-hidden animate-pulse shadow-lg" />
    );
  }

  if (!movie) {
    return null;
  }

  const rating = parseFloat(movie.imdbRating);
  const ratingColor = rating >= 8 ? 'from-emerald-500 to-teal-600' : 
                      rating >= 7 ? 'from-blue-500 to-cyan-600' : 
                      'from-orange-500 to-red-600';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      whileHover={{ y: -8 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onSelect?.(movie)}
      className="group cursor-pointer flex flex-col rounded-xl overflow-hidden transition-all duration-300 will-change-transform"
    >
      {/* Poster Container - Modern Design */}
      <div className="relative w-full aspect-square sm:aspect-[2/3] overflow-hidden rounded-xl bg-gradient-to-br from-gray-800 to-gray-900 shadow-lg group-hover:shadow-2xl group-hover:shadow-blue-500/20 transition-all duration-300">
        {/* Poster Image with Overlay */}
        <img
          src={movie.poster}
          alt={movie.title}
          className={`w-full h-full object-cover transition-transform duration-500 ${
            imageLoaded ? 'group-hover:sm:scale-110' : 'scale-100'
          }`}
          loading="lazy"
          onLoad={() => setImageLoaded(true)}
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/300x450?text=No+Poster';
            setImageLoaded(true);
          }}
        />

        {/* Gradient Overlay - Premium Effect */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-300" />

        {/* Rating Badge - Floating */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.3 }}
          className={`absolute top-2 right-2 bg-gradient-to-br ${ratingColor} text-white px-2.5 py-1 rounded-full text-sm font-bold shadow-lg flex items-center gap-1 backdrop-blur-sm`}
        >
          <span>⭐</span>
          <span>{movie.imdbRating || 'N/A'}</span>
        </motion.div>

        {/* Type Badge */}
        {movie.type && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.15, duration: 0.3 }}
            className="absolute top-2 left-2 bg-cyan-500/90 backdrop-blur-sm text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-lg capitalize"
          >
            {movie.type === 'movie' ? '🎬' : '📺'} {movie.type}
          </motion.div>
        )}

        {/* Bottom Info - Enhanced Mobile */}
        <div className="absolute inset-0 flex flex-col justify-end p-3 sm:p-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.3 }}
            className="space-y-1"
          >
            <h3 className="text-white text-xs sm:text-sm font-bold line-clamp-2 leading-tight">
              {movie.title}
            </h3>
            <p className="text-gray-300 text-xs">
              {movie.year}
            </p>
            
            {/* Desktop Only CTA */}
            <motion.p
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
              className="text-cyan-300 text-xs hidden sm:block font-medium group-hover:opacity-100 opacity-0 transition-opacity duration-300 pt-1"
            >
              View details →
            </motion.p>
          </motion.div>
        </div>
      </div>

      {/* Card Meta - Mobile Only (Below Poster) */}
      <div className="sm:hidden mt-2 px-1">
        <h3 className="text-sm font-bold text-white line-clamp-2">
          {movie.title}
        </h3>
        <p className="text-xs text-gray-400">
          {movie.year}
        </p>
      </div>
    </motion.div>
  );
};

export default MovieCard;
