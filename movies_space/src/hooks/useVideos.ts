import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { videoApi } from '../services/api/videoApi';

export interface Video {
  id: string;
  title: string;
  genre: string[];
  description: string;
  director?: string;
  imdbRating?: number;
  duration?: number;
  releaseYear: number;
  videoUrl?: string;
  thumbnailUrl?: string;
  type: 'movie' | 'series' | 'short';
  trending?: boolean;
}

/**
 * Fetch all videos
 */
export const useVideos = (options?: any): any => {
  return useQuery({
    queryKey: ['videos'],
    queryFn: () => videoApi.getAllVideos(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...options,
  });
};

/**
 * Fetch a single video by ID
 */
export const useVideoById = (
  videoId: string,
  options?: any
): any => {
  return useQuery({
    queryKey: ['video', videoId],
    queryFn: () => videoApi.getVideoById(videoId),
    enabled: !!videoId,
    staleTime: 10 * 60 * 1000, // 10 minutes
    ...options,
  });
};

/**
 * Search videos by query
 */
export const useSearchVideos = (
  query: string,
  options?: any
): any => {
  return useQuery({
    queryKey: ['videos', 'search', query],
    queryFn: () => videoApi.searchVideos(query),
    enabled: query.length > 0,
    staleTime: 3 * 60 * 1000, // 3 minutes
    ...options,
  });
};

/**
 * Fetch trending videos
 */
export const useTrendingVideos = (options?: any): any => {
  return useQuery({
    queryKey: ['videos', 'trending'],
    queryFn: () => videoApi.getTrendingVideos(),
    staleTime: 10 * 60 * 1000, // 10 minutes
    ...options,
  });
};

/**
 * Fetch videos by genre
 */
export const useVideosByGenre = (
  genre: string,
  options?: any
): any => {
  return useQuery({
    queryKey: ['videos', 'genre', genre],
    queryFn: () => videoApi.getVideosByGenre(genre),
    enabled: !!genre,
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...options,
  });
};

/**
 * Fetch short-form videos
 */
export const useShortVideos = (options?: any): any => {
  return useQuery({
    queryKey: ['videos', 'shorts'],
    queryFn: () => videoApi.getShortVideos(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...options,
  });
};
