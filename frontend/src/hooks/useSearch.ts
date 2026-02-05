import { useQuery } from '@tanstack/react-query';
import { searchService } from '../services/search';

export function useSearch(query: string, entityType?: string, page = 1, enabled = true) {
  return useQuery({
    queryKey: ['search', query, entityType, page],
    queryFn: () => searchService.search(query, entityType, page),
    enabled: enabled && query.length > 0,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useTrendingMovies(page = 1) {
  return useQuery({
    queryKey: ['trendingMovies', page],
    queryFn: () => searchService.getTrendingMovies(page),
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
}

export function useTrendingMusic(page = 1) {
  return useQuery({
    queryKey: ['trendingMusic', page],
    queryFn: () => searchService.getTrendingMusic(page),
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
}

export function useRecommendations(page = 1) {
  return useQuery({
    queryKey: ['recommendations', page],
    queryFn: () => searchService.getRecommendations(page),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
