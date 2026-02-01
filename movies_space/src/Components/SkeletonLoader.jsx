/**
 * SkeletonLoader Component - PREMIUM SHIMMER ANIMATION
 * Multiple skeleton variations with smooth, modern shimmer effects
 * Responsive loading placeholders for all contexts
 */

import React from 'react';
import { motion } from 'framer-motion';

const shimmerAnimation = {
  initial: { backgroundPosition: '200% center' },
  animate: { backgroundPosition: '-200% center' },
  transition: { duration: 2.5, repeat: Infinity, ease: 'linear' }
};

/**
 * Enhanced Shimmer Background with gradient effect
 */
const ShimmerBg = ({ className = '' }) => (
  <motion.div
    initial={shimmerAnimation.initial}
    animate={shimmerAnimation.animate}
    transition={shimmerAnimation.transition}
    className={`bg-gradient-to-r from-gray-800/50 via-gray-700/50 to-gray-800/50 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 bg-[length:200%_100%] ${className}`}
  />
);

/**
 * Skeleton Card - Movie card loading placeholder with depth
 * Mobile: 1:1 aspect ratio, Desktop: 2:3 aspect ratio
 */
export const SkeletonCard = () => (
  <motion.div
    initial={{ opacity: 0.5 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 1.5, repeat: Infinity, repeatType: 'reverse' }}
    className="space-y-2"
  >
    <div className="w-full aspect-square sm:aspect-[2/3] bg-gray-800/40 dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg">
      <ShimmerBg className="w-full h-full" />
    </div>
    <div className="sm:hidden space-y-2">
      <ShimmerBg className="h-3.5 w-3/4 rounded-lg" />
      <ShimmerBg className="h-3 w-1/2 rounded-lg" />
    </div>
  </motion.div>
);

/**
 * Skeleton Grid - Multiple cards responsive with staggered animation
 * 1 col mobile → 2 col tablet → 3-5 col desktop
 */
export const SkeletonGrid = ({ count = 10 }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
    {Array.from({ length: count }).map((_, i) => (
      <motion.div
        key={i}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: i * 0.05, duration: 0.3 }}
      >
        <SkeletonCard />
      </motion.div>
    ))}
  </div>
);

/**
 * Skeleton Movie Details - Modal/Detail view with enhanced visuals
 * Responsive stacking on mobile, horizontal on desktop
 */
export const SkeletonMovieDetails = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.3 }}
    className="space-y-6"
  >
    {/* Header Section - Poster + Title */}
    <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full sm:w-40 h-48 sm:h-56 rounded-xl flex-shrink-0"
      >
        <ShimmerBg className="w-full h-full rounded-xl" />
      </motion.div>
      
      <div className="flex-1 space-y-4">
        <ShimmerBg className="h-7 sm:h-8 w-3/4 rounded-lg" />
        <ShimmerBg className="h-4 w-1/2 rounded-lg" />
        
        <div className="flex flex-wrap gap-2 pt-2">
          <ShimmerBg className="h-7 w-16 rounded-full" />
          <ShimmerBg className="h-7 w-20 rounded-full" />
          <ShimmerBg className="h-7 w-16 rounded-full" />
        </div>
        
        <div className="flex gap-3 pt-4">
          <ShimmerBg className="h-11 flex-1 rounded-lg" />
          <ShimmerBg className="h-11 flex-1 rounded-lg" />
        </div>
      </div>
    </div>

    {/* Info Grid - Enhanced */}
    <div className="border-t border-gray-700/50 pt-6">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {Array(6).fill(0).map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.05 }}
            className="space-y-2"
          >
            <ShimmerBg className="h-3 w-12 rounded-lg" />
            <ShimmerBg className="h-4 w-full rounded-lg" />
          </motion.div>
        ))}
      </div>
    </div>

    {/* Director/Writer Section */}
    <div className="border-t border-gray-700/50 pt-6 space-y-3">
      <ShimmerBg className="h-3.5 w-20 rounded-lg" />
      <ShimmerBg className="h-4 w-full rounded-lg" />
      <ShimmerBg className="h-4 w-4/5 rounded-lg" />
    </div>

    {/* Plot Section */}
    <div className="border-t border-gray-700/50 pt-6 space-y-3">
      <ShimmerBg className="h-3.5 w-16 rounded-lg" />
      <ShimmerBg className="h-4 w-full rounded-lg" />
      <ShimmerBg className="h-4 w-full rounded-lg" />
      <ShimmerBg className="h-4 w-3/4 rounded-lg" />
    </div>
  </motion.div>
);

/**
 * Skeleton Search Bar
 */
export const SkeletonSearchBar = () => (
  <ShimmerBg className="h-10 sm:h-11 w-full rounded-full" />
);

/**
 * Skeleton Recent Searches - List style
 */
export const SkeletonSearchResults = ({ count = 5 }) => (
  <div className="space-y-3">
    {Array.from({ length: count }).map((_, i) => (
      <motion.div
        key={i}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: i * 0.05, duration: 0.3 }}
      >
        <ShimmerBg className="h-10 w-full rounded-lg" />
      </motion.div>
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
  <ShimmerBg className={`rounded-lg ${width} ${height} ${className}`} />
);

/**
 * Skeleton Header - Navigation bar loading with premium feel
 */
export const SkeletonHeader = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.3 }}
    className="space-y-3 p-4 sm:p-6 border-b border-gray-700/50"
  >
    {/* Mobile Header */}
    <div className="lg:hidden space-y-3">
      <div className="flex justify-between items-center">
        <ShimmerBg className="h-6 w-24 rounded-lg" />
        <div className="flex gap-2">
          <ShimmerBg className="h-10 w-10 rounded-lg" />
          <ShimmerBg className="h-10 w-10 rounded-lg" />
        </div>
      </div>
      <SkeletonSearchBar />
    </div>

    {/* Desktop Header */}
    <div className="hidden lg:flex justify-between items-center gap-6">
      <ShimmerBg className="h-8 w-32 rounded-lg" />
      <ShimmerBg className="h-11 w-64 rounded-full" />
      <div className="flex gap-3 flex-1 justify-end">
        {Array(3).fill(0).map((_, i) => (
          <ShimmerBg key={i} className="h-10 w-24 rounded-lg" />
        ))}
      </div>
    </div>
  </motion.div>
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
      <div className="space-y-6">
        {Array(count).fill(0).map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.1, duration: 0.3 }}
            className="space-y-3"
          >
            <ShimmerBg className="h-48 w-full rounded-xl" />
            <ShimmerBg className="h-4 w-3/4 rounded-lg" />
            <ShimmerBg className="h-3 w-1/2 rounded-lg" />
          </motion.div>
        ))}
      </div>
    ),

    grid: () => <SkeletonGrid count={count} />,

    text: () => (
      <div className="space-y-3">
        {Array(count).fill(0).map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.05 }}
          >
            <ShimmerBg className="h-4 w-full rounded-lg" />
          </motion.div>
        ))}
      </div>
    ),

    image: () => (
      <ShimmerBg className="h-48 w-full rounded-xl" />
    ),

    hero: () => (
      <div className="space-y-6">
        <ShimmerBg className="h-64 sm:h-96 w-full rounded-xl" />
        <div className="space-y-3">
          <ShimmerBg className="h-8 w-2/3 rounded-lg" />
          <ShimmerBg className="h-4 w-full rounded-lg" />
          <ShimmerBg className="h-4 w-3/4 rounded-lg" />
        </div>
      </div>
    ),
  };

  return renderers[variant]?.();
};

export default SkeletonLoader;
