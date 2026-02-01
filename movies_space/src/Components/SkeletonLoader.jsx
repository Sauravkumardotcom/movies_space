/**
 * SkeletonLoader Component - MOBILE FIRST
 * Multiple skeleton variations with smooth shimmer animation
 * Responsive loading placeholders for all contexts
 */

import React from 'react';
import { motion } from 'framer-motion';

const shimmerAnimation = {
  initial: { backgroundPosition: '200% center' },
  animate: { backgroundPosition: '-200% center' },
  transition: { duration: 2, repeat: Infinity, ease: 'linear' }
};

/**
 * Base Shimmer Background
 */
const ShimmerBg = ({ className = '' }) => (
  <motion.div
    initial={shimmerAnimation.initial}
    animate={shimmerAnimation.animate}
    transition={shimmerAnimation.transition}
    className={`bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700 dark:from-gray-800 dark:via-gray-700 dark:to-gray-800 bg-[length:200%_100%] ${className}`}
  />
);

/**
 * Skeleton Card - Movie card loading placeholder
 * Mobile: 1:1 aspect ratio, Desktop: 2:3 aspect ratio
 */
export const SkeletonCard = () => (
  <div className="space-y-2">
    <div className="w-full aspect-square sm:aspect-[2/3] bg-gray-300 dark:bg-gray-800 rounded-lg overflow-hidden">
      <ShimmerBg className="w-full h-full" />
    </div>
    <div className="sm:hidden space-y-1">
      <ShimmerBg className="h-3 w-3/4 rounded" />
      <ShimmerBg className="h-2 w-1/2 rounded" />
    </div>
  </div>
);

/**
 * Skeleton Grid - Multiple cards responsive
 * 1 col mobile → 2 col tablet → 3-5 col desktop
 */
export const SkeletonGrid = ({ count = 10 }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
    {Array.from({ length: count }).map((_, i) => (
      <SkeletonCard key={i} />
    ))}
  </div>
);

/**
 * Skeleton Movie Details - Modal/Detail view
 * Responsive stacking on mobile, horizontal on desktop
 */
export const SkeletonMovieDetails = () => (
  <div className="space-y-4">
    {/* Header Section - Poster + Title */}
    <div className="flex flex-col sm:flex-row gap-4">
      <ShimmerBg className="w-full sm:w-40 h-auto sm:h-56 rounded-lg flex-shrink-0" />
      <div className="flex-1 space-y-3">
        <ShimmerBg className="h-6 sm:h-8 w-3/4 rounded" />
        <ShimmerBg className="h-4 w-1/2 rounded" />
        <div className="flex gap-2">
          <ShimmerBg className="h-6 w-16 rounded" />
          <ShimmerBg className="h-6 w-20 rounded" />
          <ShimmerBg className="h-6 w-16 rounded" />
        </div>
        <div className="flex gap-2 pt-2">
          <ShimmerBg className="h-10 flex-1 rounded-lg" />
          <ShimmerBg className="h-10 flex-1 rounded-lg" />
        </div>
      </div>
    </div>

    {/* Info Grid */}
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {Array(6).fill(0).map((_, i) => (
        <div key={i} className="space-y-1">
          <ShimmerBg className="h-3 w-12 rounded" />
          <ShimmerBg className="h-4 w-full rounded" />
        </div>
      ))}
    </div>

    {/* Director/Writer Section */}
    <div className="space-y-2">
      <ShimmerBg className="h-3 w-16 rounded" />
      <ShimmerBg className="h-4 w-full rounded" />
    </div>

    {/* Plot Section */}
    <div className="space-y-2">
      <ShimmerBg className="h-3 w-10 rounded" />
      <ShimmerBg className="h-4 w-full rounded" />
      <ShimmerBg className="h-4 w-full rounded" />
      <ShimmerBg className="h-4 w-3/4 rounded" />
    </div>
  </div>
);

/**
 * Skeleton Search Bar
 */
export const SkeletonSearchBar = () => (
  <ShimmerBg className="h-10 sm:h-11 w-full rounded-lg" />
);

/**
 * Skeleton Recent Searches - List style
 */
export const SkeletonSearchResults = ({ count = 5 }) => (
  <div className="space-y-2">
    {Array.from({ length: count }).map((_, i) => (
      <ShimmerBg key={i} className="h-10 w-full rounded-lg" />
    ))}
  </div>
);

/**
 * Generic Skeleton Line
 */
export const SkeletonLine = ({ 
  width = 'w-full', 
  height = 'h-4', 
  className = '' 
}) => (
  <ShimmerBg className={`rounded ${width} ${height} ${className}`} />
);

/**
 * Skeleton Header - Navigation bar loading
 */
export const SkeletonHeader = () => (
  <div className="space-y-3 p-4 sm:p-6">
    {/* Mobile Header */}
    <div className="lg:hidden space-y-3">
      <div className="flex justify-between items-center">
        <ShimmerBg className="h-6 w-24 rounded" />
        <div className="flex gap-2">
          <ShimmerBg className="h-10 w-10 rounded-lg" />
          <ShimmerBg className="h-10 w-10 rounded-lg" />
        </div>
      </div>
      <SkeletonSearchBar />
      <div className="flex gap-2 overflow-x-auto">
        {Array(3).fill(0).map((_, i) => (
          <ShimmerBg key={i} className="h-8 w-24 rounded-lg flex-shrink-0" />
        ))}
      </div>
    </div>

    {/* Desktop Header */}
    <div className="hidden lg:flex justify-between items-center gap-4">
      <ShimmerBg className="h-8 w-32 rounded" />
      <ShimmerBg className="h-11 w-48 rounded-lg" />
      <div className="flex gap-2">
        {Array(3).fill(0).map((_, i) => (
          <ShimmerBg key={i} className="h-10 w-28 rounded-lg" />
        ))}
      </div>
      <ShimmerBg className="h-10 w-10 rounded-lg" />
    </div>
  </div>
);

/**
 * Legacy SkeletonLoader for backward compatibility
 */
export const SkeletonLoader = ({
  variant = 'card',
  count = 1,
  className = '',
}) => {
  const renderers = {
    card: () => (
      <div className="space-y-4">
        {Array(count).fill(0).map((_, i) => (
          <div key={i} className="space-y-2">
            <ShimmerBg className="h-48 w-full rounded-lg" />
            <ShimmerBg className="h-4 w-3/4 rounded" />
            <ShimmerBg className="h-3 w-1/2 rounded" />
          </div>
        ))}
      </div>
    ),

    grid: () => <SkeletonGrid count={count} />,

    text: () => (
      <div className="space-y-2">
        {Array(count).fill(0).map((_, i) => (
          <ShimmerBg key={i} className="h-4 w-full rounded" />
        ))}
      </div>
    ),

    image: () => (
      <ShimmerBg className="h-48 w-full rounded-lg" />
    ),

    hero: () => (
      <div className="space-y-4">
        <ShimmerBg className="h-64 sm:h-96 w-full rounded-lg" />
        <div className="space-y-2">
          <ShimmerBg className="h-8 w-2/3 rounded" />
          <ShimmerBg className="h-4 w-full rounded" />
          <ShimmerBg className="h-4 w-3/4 rounded" />
        </div>
      </div>
    ),
  };

  return renderers[variant]?.();
};

export default SkeletonLoader;
