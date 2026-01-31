import { useQuery } from '@tanstack/react-query';
import { videoService } from '../services/videoService';
import { useAppStore } from '../store/useAppStore';

export const useVideos = () => {
  const customMovies = useAppStore((state) => state.customMovies);
  const uploadedVideos = useAppStore((state) => state.uploadedVideos);

  return useQuery({
    queryKey: ['videos', customMovies, uploadedVideos],
    queryFn: () => videoService.getAllVideos([...customMovies, ...uploadedVideos]),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useVideoById = (id) => {
  const customMovies = useAppStore((state) => state.customMovies);
  const uploadedVideos = useAppStore((state) => state.uploadedVideos);

  return useQuery({
    queryKey: ['video', id, customMovies, uploadedVideos],
    queryFn: () => videoService.getVideoById(id, [...customMovies, ...uploadedVideos]),
    enabled: !!id,
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
};

export const useSearchVideos = (query) => {
  const customMovies = useAppStore((state) => state.customMovies);
  const uploadedVideos = useAppStore((state) => state.uploadedVideos);

  return useQuery({
    queryKey: ['searchVideos', query, customMovies, uploadedVideos],
    queryFn: () => videoService.searchVideos(query, [...customMovies, ...uploadedVideos]),
    enabled: !!query && query.length > 0,
  });
};

export const useShortVideos = () => {
  return useQuery({
    queryKey: ['shortVideos'],
    queryFn: videoService.getShortVideos,
    staleTime: 1000 * 60 * 5,
  });
};

export const useTrendingVideos = () => {
  const customMovies = useAppStore((state) => state.customMovies);
  const uploadedVideos = useAppStore((state) => state.uploadedVideos);

  return useQuery({
    queryKey: ['trendingVideos', customMovies, uploadedVideos],
    queryFn: () => videoService.getTrendingVideos([...customMovies, ...uploadedVideos]),
    staleTime: 1000 * 60 * 5,
  });
};

export const useVideosByGenre = (genre) => {
  const customMovies = useAppStore((state) => state.customMovies);
  const uploadedVideos = useAppStore((state) => state.uploadedVideos);

  return useQuery({
    queryKey: ['videosByGenre', genre, customMovies, uploadedVideos],
    queryFn: () => videoService.getVideosByGenre(genre, [...customMovies, ...uploadedVideos]),
    enabled: !!genre,
  });
};
