/**
 * MovieCard Component
 * Displays a single movie with poster, title, year, rating, and type
 * Minimal, modern design with hover effects
 */

import React from 'react';
import { motion } from 'framer-motion';

const MovieCard = ({ movie, onSelect, isLoading = false }) => {
  if (isLoading) {
    return (
      <div className="bg-gray-800 rounded-lg overflow-hidden aspect-[2/3] animate-pulse" />
    );
  }

  if (!movie) {
    return null;
  }

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => onSelect?.(movie)}
      className="group cursor-pointer rounded-lg overflow-hidden aspect-[2/3] bg-gray-900 border border-gray-800 hover:border-cyan-500/50 transition-all duration-300 shadow-lg hover:shadow-cyan-500/20"
    >
      {/* Poster Image */}
      <div className="relative w-full h-full overflow-hidden bg-gray-800">
        <img
          src={movie.poster}
          alt={movie.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          loading="lazy"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/300x450?text=No+Poster';
          }}
        />

        {/* Overlay on Hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-3">
          {/* Top Badge */}
          <div className="flex justify-between items-start">
            <span className="bg-yellow-500/90 text-black text-xs font-bold px-2 py-1 rounded">
              ⭐ {movie.imdbRating || 'N/A'}
            </span>
            {movie.type && (
              <span className="bg-cyan-500/90 text-black text-xs font-bold px-2 py-1 rounded capitalize">
                {movie.type}
              </span>
            )}
          </div>

          {/* Bottom Info */}
          <div>
            <p className="text-white text-xs font-semibold line-clamp-2 mb-1">
              {movie.title}
            </p>
            <p className="text-gray-300 text-xs">
              {movie.year}
            </p>
          </div>
        </div>
      </div>

      {/* Card Footer (Below Image) */}
      <div className="hidden group-hover:block absolute -bottom-24 left-0 right-0 bg-gray-900 p-3 rounded-b-lg border-t border-gray-700">
        <p className="text-white text-xs font-semibold line-clamp-2 mb-2">
          {movie.title}
        </p>
        <div className="flex justify-between text-xs text-gray-400">
          <span>{movie.year}</span>
          <span className="text-cyan-400">View Details →</span>
        </div>
      </div>
    </motion.div>
  );
};

export default MovieCard;
