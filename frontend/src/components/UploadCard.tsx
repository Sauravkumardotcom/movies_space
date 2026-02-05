import React from 'react';
import { Upload as UploadIcon, Check, AlertCircle, Clock } from 'lucide-react';
import type { Upload } from '../services/music';

interface UploadCardProps {
  upload: Upload;
  onRetry?: (uploadId: string) => void;
  onDelete?: (uploadId: string) => void;
  isLoading?: boolean;
}

const STATUS_CONFIG = {
  processing: {
    icon: Clock,
    color: 'text-yellow-400',
    bg: 'bg-yellow-900/20',
    label: 'Processing',
  },
  ready: {
    icon: Check,
    color: 'text-green-400',
    bg: 'bg-green-900/20',
    label: 'Ready',
  },
  failed: {
    icon: AlertCircle,
    color: 'text-red-400',
    bg: 'bg-red-900/20',
    label: 'Failed',
  },
};

export const UploadCard: React.FC<UploadCardProps> = ({
  upload,
  onRetry,
  onDelete,
  isLoading = false,
}) => {
  const statusConfig = STATUS_CONFIG[upload.status];
  const StatusIcon = statusConfig.icon;

  const formatFileSize = (bytes: number) => {
    const mb = (bytes / 1024 / 1024).toFixed(2);
    return `${mb}MB`;
  };

  return (
    <div className="bg-slate-800 rounded-lg p-4 space-y-3 border border-slate-700 hover:border-slate-600 transition-all">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <div className="mt-1">
            <UploadIcon size={20} className="text-slate-400" />
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-white text-sm truncate">{upload.title}</h3>
            <p className="text-slate-400 text-xs mt-1">
              {upload.duration}s • {formatFileSize(upload.fileSize)}
            </p>
          </div>
        </div>

        {/* Status badge */}
        <div className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-medium whitespace-nowrap ${statusConfig.bg} ${statusConfig.color}`}>
          <StatusIcon size={14} />
          {statusConfig.label}
        </div>
      </div>

      {/* Progress bar (for processing) */}
      {upload.status === 'processing' && (
        <div className="w-full bg-slate-700 rounded-full h-1 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-purple-500 animate-pulse"
            style={{ width: '60%' }}
          />
        </div>
      )}

      {/* Upload date */}
      <p className="text-slate-500 text-xs">
        {new Date(upload.createdAt).toLocaleDateString()} at{' '}
        {new Date(upload.createdAt).toLocaleTimeString()}
      </p>

      {/* Actions */}
      <div className="flex gap-2 pt-2 border-t border-slate-700">
        {upload.status === 'failed' && (
          <button
            onClick={() => onRetry?.(upload.id)}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-xs py-1.5 rounded transition-colors disabled:opacity-50"
            disabled={isLoading}
          >
            Retry
          </button>
        )}

        <button
          onClick={() => onDelete?.(upload.id)}
          className="flex-1 bg-slate-700 hover:bg-red-700 text-white text-xs py-1.5 rounded transition-colors disabled:opacity-50"
          disabled={isLoading || upload.status === 'processing'}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default UploadCard;
