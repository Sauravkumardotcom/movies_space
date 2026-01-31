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
      whileHover={{ scale: 1.05 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`group relative overflow-hidden rounded-lg bg-gray-800 cursor-pointer ${className}`}
    >
      <Link to={`/watch/${video.id}`} className="block">
        {/* Poster Image */}
        <div className="relative h-64 md:h-48 overflow-hidden bg-gray-700">
          <img
            src={video.poster || `https://placehold.co/300x450?text=${encodeURIComponent(video.title)}&font=raleway`}
            alt={video.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Duration Badge */}
          {video.duration && (
            <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 px-2 py-1 rounded text-xs font-semibold">
              {formatDuration(video.duration)}
            </div>
          )}

          {/* Favorite Button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleFavoriteClick}
            className="absolute top-2 right-2 w-10 h-10 bg-red-600 hover:bg-red-700 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
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

          {/* Play Button */}
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={isHovered ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center group-hover:bg-red-700 transition">
              <svg
                className="w-8 h-8 ml-1 text-white"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </motion.div>
        </div>

        {/* Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isHovered ? { opacity: 1 } : { opacity: 1 }}
          className="p-4"
        >
          {/* Title */}
          <h3 className="font-bold text-sm md:text-base line-clamp-2 group-hover:text-red-600 transition">
            {video.title}
          </h3>

          {/* Meta Info */}
          <div className="mt-2 flex items-center gap-2 text-xs md:text-sm text-gray-400">
            {video.rating && (
              <>
                <span className="flex items-center gap-1">
                  <svg className="w-3 h-3 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  {video.rating}
                </span>
                <span>•</span>
              </>
            )}
            <span>{video.year}</span>
            {video.watched && (
              <>
                <span>•</span>
                <span>{formatNumber(video.watched)} views</span>
              </>
            )}
          </div>

          {/* Description - Show on hover */}
          {isHovered && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-3 text-xs text-gray-400 line-clamp-3"
            >
              {video.description}
            </motion.p>
          )}

          {/* Genre Tags */}
          {isHovered && video.genre && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-3 flex gap-2 flex-wrap"
            >
              {(Array.isArray(video.genre) ? video.genre : [video.genre])
                .slice(0, 2)
                .map((g) => (
                  <span
                    key={g}
                    className="text-xs bg-gray-700 px-2 py-1 rounded text-gray-300"
                  >
                    {g}
                  </span>
                ))}
            </motion.div>
          )}
        </motion.div>
      </Link>
    </motion.div>
  );
};

export default VideoCard;
