import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as musicService from '../services/music';

// ============================================
// MUSIC QUERY HOOKS
// ============================================

/**
 * Get paginated music with optional filters
 */
export const useMusic = (
  artist?: string,
  genre?: string,
  page: number = 1,
  limit: number = 20
) => {
  return useQuery({
    queryKey: ['music', { artist, genre, page, limit }],
    queryFn: () => musicService.getMusic(artist, genre, page, limit),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Get single music with details
 */
export const useMusicDetail = (id: string | null | undefined) => {
  return useQuery({
    queryKey: ['music', id],
    queryFn: () => musicService.getMusicById(id!),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Search music
 */
export const useSearchMusic = (
  query: string,
  enabled: boolean = false,
  page: number = 1,
  limit: number = 20
) => {
  return useQuery({
    queryKey: ['music-search', { query, page, limit }],
    queryFn: () => musicService.searchMusic(query, page, limit),
    enabled: enabled && query.length >= 2,
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Get trending music
 */
export const useTrendingMusic = (limit: number = 10) => {
  return useQuery({
    queryKey: ['music-trending', limit],
    queryFn: () => musicService.getTrendingMusic(limit),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

/**
 * Get all artists
 */
export const useArtists = () => {
  return useQuery({
    queryKey: ['artists'],
    queryFn: () => musicService.getArtists(),
    staleTime: 60 * 60 * 1000, // 1 hour
  });
};

/**
 * Get all genres
 */
export const useGenres = () => {
  return useQuery({
    queryKey: ['genres'],
    queryFn: () => musicService.getGenres(),
    staleTime: 60 * 60 * 1000, // 1 hour
  });
};

// ============================================
// PLAYLIST QUERY HOOKS
// ============================================

/**
 * Get user's playlists
 */
export const useUserPlaylists = (page: number = 1, limit: number = 20) => {
  return useQuery({
    queryKey: ['playlists', { page, limit }],
    queryFn: () => musicService.getUserPlaylists(page, limit),
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Get playlist details
 */
export const usePlaylistDetail = (id: string | null | undefined) => {
  return useQuery({
    queryKey: ['playlist', id],
    queryFn: () => musicService.getPlaylistById(id!),
    enabled: !!id,
    staleTime: 3 * 60 * 1000,
  });
};

// ============================================
// UPLOAD QUERY HOOKS
// ============================================

/**
 * Get user's uploads
 */
export const useUserUploads = (page: number = 1, limit: number = 20) => {
  return useQuery({
    queryKey: ['uploads', { page, limit }],
    queryFn: () => musicService.getUserUploads(page, limit),
    staleTime: 2 * 60 * 1000, // 2 minutes (more frequent updates for status)
  });
};

/**
 * Get upload details
 */
export const useUploadDetail = (id: string | null | undefined) => {
  return useQuery({
    queryKey: ['upload', id],
    queryFn: () => musicService.getUploadById(id!),
    enabled: !!id,
    staleTime: 1 * 60 * 1000,
  });
};

/**
 * Get upload statistics
 */
export const useUploadStats = () => {
  return useQuery({
    queryKey: ['upload-stats'],
    queryFn: () => musicService.getUploadStats(),
    staleTime: 2 * 60 * 1000,
  });
};

// ============================================
// PLAYLIST MUTATION HOOKS
// ============================================

/**
 * Create playlist
 */
export const useCreatePlaylist = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ title, description }: { title: string; description?: string }) =>
      musicService.createPlaylist(title, description),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['playlists'] });
    },
  });
};

/**
 * Update playlist
 */
export const useUpdatePlaylist = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      title,
      description,
    }: {
      id: string;
      title?: string;
      description?: string;
    }) => musicService.updatePlaylist(id, title, description),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['playlist', id] });
      queryClient.invalidateQueries({ queryKey: ['playlists'] });
    },
  });
};

/**
 * Delete playlist
 */
export const useDeletePlaylist = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => musicService.deletePlaylist(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['playlists'] });
    },
  });
};

/**
 * Add song to playlist
 */
export const useAddSongToPlaylist = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ playlistId, musicId }: { playlistId: string; musicId: string }) =>
      musicService.addSongToPlaylist(playlistId, musicId),
    onSuccess: (_, { playlistId }) => {
      queryClient.invalidateQueries({ queryKey: ['playlist', playlistId] });
      queryClient.invalidateQueries({ queryKey: ['playlists'] });
    },
  });
};

/**
 * Remove song from playlist
 */
export const useRemoveSongFromPlaylist = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ playlistId, musicId }: { playlistId: string; musicId: string }) =>
      musicService.removeSongFromPlaylist(playlistId, musicId),
    onSuccess: (_, { playlistId }) => {
      queryClient.invalidateQueries({ queryKey: ['playlist', playlistId] });
      queryClient.invalidateQueries({ queryKey: ['playlists'] });
    },
  });
};

// ============================================
// UPLOAD MUTATION HOOKS
// ============================================

/**
 * Create upload
 */
export const useCreateUpload = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      title,
      duration,
      fileSize,
      mimeType,
    }: {
      title: string;
      duration: number;
      fileSize: number;
      mimeType: string;
    }) => musicService.createUpload(title, duration, fileSize, mimeType),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['uploads'] });
      queryClient.invalidateQueries({ queryKey: ['upload-stats'] });
    },
  });
};

/**
 * Update upload status
 */
export const useUpdateUploadStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      status,
      streamUrl,
    }: {
      id: string;
      status: 'processing' | 'ready' | 'failed';
      streamUrl?: string;
    }) => musicService.updateUploadStatus(id, status, streamUrl),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['upload', id] });
      queryClient.invalidateQueries({ queryKey: ['uploads'] });
      queryClient.invalidateQueries({ queryKey: ['upload-stats'] });
    },
  });
};

/**
 * Delete upload
 */
export const useDeleteUpload = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => musicService.deleteUpload(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['uploads'] });
      queryClient.invalidateQueries({ queryKey: ['upload-stats'] });
    },
  });
};
