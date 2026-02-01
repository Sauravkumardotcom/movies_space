/**
 * SkeletonLoader Component
 * Multiple skeleton variations for different contexts
 * Loading placeholders with smooth animations
 */

import React from 'react';
import { motion } from 'framer-motion';

/**
 * Skeleton Card - for movie cards grid
 */
export const SkeletonCard = () => (
  <div className="bg-gray-800 rounded-lg overflow-hidden aspect-[2/3] animate-pulse">
    <div className="w-full h-full bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 bg-[length:200%_100%] animate-[shimmer_2s_infinite]" />
  </div>
);

/**
 * Skeleton Grid - multiple cards
 */
export const SkeletonGrid = ({ count = 10 }) => (
  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
    {Array.from({ length: count }).map((_, i) => (
      <SkeletonCard key={i} />
    ))}
  </div>
);

/**
 * Skeleton Movie Details
 */
export const SkeletonMovieDetails = () => (
  <div className="space-y-4 p-6 bg-gray-900 rounded-lg">
    {/* Poster + Title Section */}
    <div className="flex gap-6">
      <div className="w-32 h-48 bg-gray-800 rounded-lg animate-pulse" />
      <div className="flex-1 space-y-3">
        <div className="h-8 bg-gray-800 rounded-lg w-3/4 animate-pulse" />
        <div className="h-4 bg-gray-800 rounded-lg w-1/2 animate-pulse" />
        <div className="h-4 bg-gray-800 rounded-lg w-2/3 animate-pulse" />
      </div>
    </div>

    {/* Info Section */}
    <div className="space-y-2">
      <div className="h-4 bg-gray-800 rounded-lg w-full animate-pulse" />
      <div className="h-4 bg-gray-800 rounded-lg w-full animate-pulse" />
      <div className="h-4 bg-gray-800 rounded-lg w-3/4 animate-pulse" />
    </div>

    {/* Plot Section */}
    <div className="space-y-2">
      <div className="h-4 bg-gray-800 rounded-lg w-full animate-pulse" />
      <div className="h-4 bg-gray-800 rounded-lg w-full animate-pulse" />
      <div className="h-4 bg-gray-800 rounded-lg w-1/2 animate-pulse" />
    </div>
  </div>
);

/**
 * Skeleton Search Results
 */
export const SkeletonSearchResults = ({ count = 5 }) => (
  <div className="space-y-3">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="flex gap-3 p-3 bg-gray-800 rounded-lg">
        <div className="w-20 h-28 bg-gray-700 rounded-lg animate-pulse flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-700 rounded w-3/4 animate-pulse" />
          <div className="h-3 bg-gray-700 rounded w-1/2 animate-pulse" />
          <div className="h-3 bg-gray-700 rounded w-2/3 animate-pulse" />
        </div>
      </div>
    ))}
  </div>
);

/**
 * Skeleton Search Bar
 */
export const SkeletonSearchBar = () => (
  <div className="h-12 bg-gray-800 rounded-lg animate-pulse w-full" />
);

/**
 * Generic Skeleton Line
 */
export const SkeletonLine = ({ width = 'w-full', height = 'h-4', className = '' }) => (
  <div
    className={`bg-gray-800 rounded-lg animate-pulse ${width} ${height} ${className}`}
  />
);

/**
 * Legacy SkeletonLoader for backward compatibility
 */
export const SkeletonLoader = ({
  variant = 'card',
  count = 1,
  className = '',
}) => {
  const getSkeletonClass = () => {
    return `animate-pulse bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700 ${className}`;
  };

  const renderers = {
    card: () => (
      <div className="space-y-4">
        {Array(count).fill(0).map((_, i) => (
          <div key={i} className="bg-gray-800 rounded-lg overflow-hidden">
            <div className={`${getSkeletonClass()} h-48 w-full`} />
            <div className="p-4 space-y-3">
              <div className={`${getSkeletonClass()} h-4 w-3/4`} />
              <div className={`${getSkeletonClass()} h-3 w-1/2`} />
            </div>
          </div>
        ))}
      </div>
    ),

    grid: () => (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {Array(count).fill(0).map((_, i) => (
          <div key={i} className="bg-gray-800 rounded-lg overflow-hidden">
            <div className={`${getSkeletonClass()} h-48 w-full`} />
            <div className="p-3 space-y-2">
              <div className={`${getSkeletonClass()} h-3 w-4/5`} />
              <div className={`${getSkeletonClass()} h-2 w-1/3`} />
            </div>
          </div>
        ))}
      </div>
    ),

    text: () => (
      <div className="space-y-2">
        {Array(count).fill(0).map((_, i) => (
          <div key={i} className={`${getSkeletonClass()} h-4 w-full`} />
        ))}
      </div>
    ),

    image: () => (
      <div className={`${getSkeletonClass()} h-48 w-full rounded-lg`} />
    ),

    hero: () => (
      <div className="space-y-4">
        <div className={`${getSkeletonClass()} h-96 w-full rounded-lg`} />
        <div className="space-y-2">
          <div className={`${getSkeletonClass()} h-8 w-2/3`} />
          <div className={`${getSkeletonClass()} h-4 w-full`} />
          <div className={`${getSkeletonClass()} h-4 w-3/4`} />
        </div>
      </div>
    ),
  };

  return renderers[variant]?.();
};

export default SkeletonLoader;
