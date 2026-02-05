import React, { useState } from 'react';
import { useShorts } from '@hooks/useMovie';
import { ShortCard } from '@components/ShortCard';
import { LoadingSpinner } from '@components/Loading';
import { ErrorDisplay, EmptyState } from '@components/ErrorState';

export function ShortsPage(): JSX.Element {
  const [page, setPage] = useState(1);
  const { data: shortsData, isLoading, error } = useShorts(page, 20);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>): void => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (scrollHeight - scrollTop <= clientHeight * 1.5 && shortsData?.hasMore) {
      setPage((prev) => prev + 1);
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-slate-950 p-4">
        <ErrorDisplay message="Failed to load shorts" onRetry={() => window.location.reload()} />
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-slate-950 overflow-y-auto"
      onScroll={handleScroll}
      style={{ height: 'calc(100vh - 64px)' }}
    >
      <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-8">🎞️ Shorts</h1>

        {/* Shorts Grid */}
        {shortsData && shortsData.items.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {shortsData.items.map((short) => (
              <ShortCard key={short.id} short={short} />
            ))}
          </div>
        ) : (
          <EmptyState title="No shorts available" />
        )}

        {/* Loading indicator */}
        {isLoading && shortsData && shortsData.items.length > 0 && (
          <div className="mt-8">
            <LoadingSpinner />
          </div>
        )}
      </div>
    </div>
  );
}
