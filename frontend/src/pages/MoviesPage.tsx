import React, { useState } from 'react';
import { useMovies, useGenres } from '@hooks/useMovie';
import { MovieCard } from '@components/MovieCard';
import { SearchBar } from '@components/SearchBar';
import { GenreFilter } from '@components/GenreFilter';
import { Pagination } from '@components/Pagination';
import { SkeletonLoader, LoadingSpinner } from '@components/Loading';
import { ErrorDisplay, EmptyState } from '@components/ErrorState';
import type { MovieFilters } from '@types/media';

export function MoviesPage(): JSX.Element {
  const [filters, setFilters] = useState<MovieFilters>({ page: 1, limit: 20 });

  const { data: moviesData, isLoading: moviesLoading, error: moviesError } = useMovies(filters);
  const { data: genres, isLoading: genresLoading } = useGenres();

  const handleGenreChange = (genre: string | undefined): void => {
    setFilters((prev) => ({ ...prev, genre, page: 1 }));
  };

  const handlePageChange = (page: number): void => {
    setFilters((prev) => ({ ...prev, page }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (moviesError) {
    return (
      <div className="min-h-screen bg-slate-950 p-4 sm:p-6 lg:p-8">
        <ErrorDisplay message="Failed to load movies" onRetry={() => window.location.reload()} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-8">🎬 Movies & TV</h1>

        {/* Genre Filter */}
        {genres && (
          <div className="mb-6">
            <GenreFilter
              genres={genres}
              selectedGenre={filters.genre}
              onSelect={handleGenreChange}
              isLoading={moviesLoading}
            />
          </div>
        )}

        {/* Movies Grid */}
        {moviesLoading && genres === undefined ? (
          <SkeletonLoader />
        ) : moviesData && moviesData.items.length > 0 ? (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-8">
              {moviesData.items.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>

            {/* Pagination */}
            {moviesData.total > 20 && (
              <Pagination
                page={filters.page || 1}
                hasMore={moviesData.hasMore}
                onPageChange={handlePageChange}
                isLoading={moviesLoading}
              />
            )}
          </>
        ) : (
          <EmptyState
            title="No movies found"
            description="Try adjusting your filters"
            action={{ label: 'Clear filters', onClick: () => setFilters({ page: 1, limit: 20 }) }}
          />
        )}
      </div>
    </div>
  );
}
