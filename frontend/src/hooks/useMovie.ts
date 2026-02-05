import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { movieService } from '@services/movie';
import type { Movie, Short, MovieFilters } from '@types/media';

// MOVIES QUERIES
export function useMovies(filters?: MovieFilters) {
  return useQuery({
    queryKey: ['movies', filters],
    queryFn: () => movieService.getMovies(filters),
    select: (response) => response.data,
  });
}

export function useMovie(id: string | undefined) {
  return useQuery({
    queryKey: ['movie', id],
    queryFn: () => movieService.getMovieById(id!),
    enabled: !!id,
    select: (response) => response.data,
  });
}

export function useShorts(page: number = 1, limit: number = 10) {
  return useQuery({
    queryKey: ['shorts', page],
    queryFn: () => movieService.getShorts(page, limit),
    select: (response) => response.data,
  });
}

export function useGenres() {
  return useQuery({
    queryKey: ['genres'],
    queryFn: () => movieService.getGenres(),
    select: (response) => response.data,
  });
}

export function useTrending(limit?: number) {
  return useQuery({
    queryKey: ['trending'],
    queryFn: () => movieService.getTrending(limit),
    select: (response) => response.data,
  });
}

export function useSearchMovies(query: string | undefined, enabled: boolean = true) {
  return useQuery({
    queryKey: ['search', query],
    queryFn: () => movieService.searchMovies(query!),
    enabled: !!query && query.length >= 2 && enabled,
    select: (response) => response.data,
  });
}

// WATCHLIST MUTATIONS
export function useAddToWatchlist() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (movieId: string) => movieService.addToWatchlist(movieId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['watchlist'] });
    },
  });
}

export function useRemoveFromWatchlist() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (movieId: string) => movieService.removeFromWatchlist(movieId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['watchlist'] });
    },
  });
}

export function useWatchlist(page?: number) {
  return useQuery({
    queryKey: ['watchlist', page],
    queryFn: () => movieService.getWatchlist(page, 20),
    select: (response) => response.data,
  });
}

// FAVORITES MUTATIONS
export function useAddToFavorites() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ entityId, entityType }: { entityId: string; entityType: string }) =>
      movieService.addToFavorites(entityId, entityType),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
    },
  });
}

export function useRemoveFromFavorites() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ entityId, entityType }: { entityId: string; entityType: string }) =>
      movieService.removeFromFavorites(entityId, entityType),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
    },
  });
}

export function useFavorites() {
  return useQuery({
    queryKey: ['favorites'],
    queryFn: () => movieService.getFavorites(),
    select: (response) => response.data,
  });
}

// HISTORY MUTATIONS
export function useUpdateHistory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      entityId,
      entityType,
      progress,
      duration,
    }: {
      entityId: string;
      entityType: string;
      progress: number;
      duration: number;
    }) => movieService.updateHistory(entityId, entityType, progress, duration),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['history'] });
    },
  });
}

export function useHistory() {
  return useQuery({
    queryKey: ['history'],
    queryFn: () => movieService.getHistory(),
    select: (response) => response.data,
  });
}

// RATINGS MUTATIONS
export function useSubmitRating() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      entityId,
      entityType,
      rating,
      comment,
    }: {
      entityId: string;
      entityType: string;
      rating: number;
      comment?: string;
    }) => movieService.submitRating(entityId, entityType, rating, comment),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['movie'] });
    },
  });
}

export function useDeleteRating() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ entityId, entityType }: { entityId: string; entityType: string }) =>
      movieService.deleteRating(entityId, entityType),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['movie'] });
    },
  });
}
