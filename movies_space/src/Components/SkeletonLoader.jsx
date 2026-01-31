import React from 'react';

/**
 * Skeleton Loader Component - Shows loading placeholder while content loads
 * @param {Object} props
 * @param {string} props.variant - 'card' | 'text' | 'image' | 'grid'
 * @param {number} props.count - Number of skeleton items to show
 * @param {string} props.className - Additional CSS classes
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
