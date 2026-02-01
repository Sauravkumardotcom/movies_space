import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { formatNumber, formatDuration } from '../utils/helpers';
import { useAppStore } from '../store/useAppStore';

const VideoCard = ({ video, className = '' }) => {
  const [isHovered, setIsHovered] = useState(false);
  const { favorites, addToFavorites, removeFromFavorites } = useAppStore();
  const isFavorite = favorites.some((v) => v.id === video.id);

  const handleFavoriteClick = (e) => {
    e.preventDefault();
    if (isFavorite) {
      removeFromFavorites(video.id);
    } else {
      addToFavorites(video);
    }
  };

  return (
    <motion.div
      whileHover={{ y: -8, boxShadow: "0 20px 40px rgba(6, 182, 212, 0.2)" }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`group relative overflow-hidden rounded-xl bg-gradient-to-br from-gray-800 to-gray-900 cursor-pointer shadow-lg ${className}`}
    >
      <Link to={`/watch/${video.id}`} className="block">
        {/* Poster Image */}
        <div className="relative h-64 md:h-48 overflow-hidden bg-gray-700">
          <motion.img
            src={video.poster || `https://placehold.co/300x450?text=${encodeURIComponent(video.title)}&font=raleway`}
            alt={video.title}
            className="w-full h-full object-cover"
            whileHover={{ scale: 1.15 }}
            transition={{ duration: 0.3 }}
          />

          {/* Premium Gradient Overlay */}
          <motion.div 
            className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
          />

          {/* Duration Badge - Premium Style */}
          {video.duration && (
            <motion.div 
              className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-sm px-2.5 py-1.5 rounded-lg text-xs font-semibold text-white border border-white/10"
              animate={isHovered ? { scale: 1.1 } : { scale: 1 }}
            >
              {formatDuration(video.duration)}
            </motion.div>
          )}

          {/* Favorite Button - Enhanced */}
          <motion.button
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleFavoriteClick}
            className={`absolute top-3 right-3 w-11 h-11 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 backdrop-blur-sm border border-white/20 ${
              isFavorite 
                ? 'bg-red-600 shadow-lg shadow-red-500/50' 
                : 'bg-red-600/80 hover:bg-red-600'
            }`}
          >
            <svg
              className={`w-5 h-5 ${isFavorite ? 'fill-white' : ''}`}
              fill={isFavorite ? 'currentColor' : 'none'}
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          </motion.button>

          {/* Play Button - Centered and Premium */}
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={isHovered ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <motion.div
              whileHover={{ scale: 1.15 }}
              className="w-16 h-16 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-full flex items-center justify-center shadow-lg shadow-cyan-500/50 border border-white/20"
            >
              <svg
                className="w-8 h-8 ml-1 text-white"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            </motion.div>
          </motion.div>
        </div>

        {/* Info - Premium Background */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-4 bg-gradient-to-b from-gray-800 to-gray-900"
        >
          {/* Title - Enhanced Typography */}
          <motion.h3 
            className="font-bold text-sm md:text-base line-clamp-2 text-white group-hover:text-cyan-400 transition-colors duration-200"
            animate={isHovered ? { color: "#22d3ee" } : { color: "#fff" }}
          >
            {video.title}
          </motion.h3>

          {/* Meta Info - Premium Style */}
          <motion.div 
            className="mt-2 flex items-center gap-2 text-xs md:text-sm text-gray-400"
            animate={isHovered ? { opacity: 1 } : { opacity: 1 }}
          >
            {video.rating && (
              <>
                <motion.span 
                  className="flex items-center gap-1 bg-white/5 px-2 py-1 rounded-lg backdrop-blur-sm"
                  whileHover={{ bg: "white/10" }}
                >
                  <svg className="w-3 h-3 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  {video.rating}
                </motion.span>
                <span>•</span>
              </>
            )}
            <span className="text-gray-500">{video.year}</span>
            {video.watched && (
              <>
                <span>•</span>
                <span className="text-gray-500">{formatNumber(video.watched)} views</span>
              </>
            )}
          </motion.div>

          {/* Description - Enhanced Reveal */}
          {isHovered && (
            <motion.p
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="mt-3 text-xs text-gray-400 line-clamp-3"
            >
              {video.description}
            </motion.p>
          )}

          {/* Genre Tags - Premium Badges */}
          {isHovered && video.genre && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="mt-3 flex gap-2 flex-wrap"
            >
              {(Array.isArray(video.genre) ? video.genre : [video.genre])
                .slice(0, 2)
                .map((g) => (
                  <motion.span
                    key={g}
                    className="text-xs bg-white/5 border border-white/10 px-2.5 py-1 rounded-lg text-cyan-400 backdrop-blur-sm"
                    whileHover={{ bg: "white/10", borderColor: "cyan-400" }}
                  >
                    {g}
                  </motion.span>
                ))}
            </motion.div>
          )}
        </motion.div>
      </Link>
    </motion.div>
  );
};

export default VideoCard;
