import React from 'react';
import { useWatchProgress } from '../hooks/useEngagement';

interface ProgressBarProps {
  entityId: string;
  entityType: string;
  showPercentage?: boolean;
  height?: 'sm' | 'md' | 'lg';
}

/**
 * ProgressBar Component
 * Display watch progress as a bar with percentage
 */
export const ProgressBar: React.FC<ProgressBarProps> = ({
  entityId,
  entityType,
  showPercentage = true,
  height = 'md',
}) => {
  const { data: progress, isLoading } = useWatchProgress(entityId, entityType);

  if (isLoading || !progress) {
    return null;
  }

  const heightClasses = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3',
  };

  const percentage = progress.percentage || 0;
  const formattedDuration = formatDuration(progress.duration);
  const formattedProgress = formatDuration(progress.progress);

  return (
    <div className='w-full'>
      {/* Progress Bar */}
      <div className={`w-full bg-gray-200 rounded-full overflow-hidden ${heightClasses[height]}`}>
        <div
          className='bg-blue-500 h-full transition-all duration-300'
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Info */}
      {showPercentage && (
        <div className='flex justify-between items-center mt-1 text-xs text-gray-600'>
          <span>{formattedProgress}</span>
          <span>{percentage}%</span>
          <span>{formattedDuration}</span>
        </div>
      )}
    </div>
  );
};

/**
 * Helper function to format duration in seconds to readable format
 */
function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  if (minutes > 0) {
    return `${minutes}m ${secs}s`;
  }
  return `${secs}s`;
}

interface ResumeWatchingProps {
  entityId: string;
  entityType: string;
  title: string;
  onResume?: (entityId: string) => void;
}

/**
 * ResumeWatching Component
 * Prompt user to resume watching from where they left off
 */
export const ResumeWatching: React.FC<ResumeWatchingProps> = ({
  entityId,
  entityType,
  title,
  onResume,
}) => {
  const { data: progress } = useWatchProgress(entityId, entityType);

  if (!progress || progress.percentage === 100) {
    return null;
  }

  return (
    <div className='bg-blue-50 border border-blue-200 rounded p-3 flex items-center justify-between'>
      <div>
        <p className='text-sm font-medium text-gray-800'>{title}</p>
        <p className='text-xs text-gray-600'>
          Resume from {formatDuration(progress.progress)} ({progress.percentage}%)
        </p>
      </div>
      <button
        onClick={() => onResume?.(entityId)}
        className='px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition-colors'
      >
        Resume
      </button>
    </div>
  );
};
