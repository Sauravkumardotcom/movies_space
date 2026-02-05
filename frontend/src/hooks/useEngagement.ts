import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { engagementService } from '../services/engagement';
import { useCallback } from 'react';

// ============================================
// Query Hooks (GET)
// ============================================

/**
 * Hook to fetch user's rating for an entity
 */
export const useUserRating = (entityId?: string, entityType?: string) => {
  return useQuery({
    queryKey: ['rating', entityId, entityType],
    queryFn: () => engagementService.getUserRating(entityId!, entityType!),
    enabled: !!entityId && !!entityType,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Hook to fetch ratings summary for an entity
 */
export const useRatingsSummary = (entityId?: string, entityType?: string) => {
  return useQuery({
    queryKey: ['ratings-summary', entityId, entityType],
    queryFn: () => engagementService.getRatingsSummary(entityId!, entityType!),
    enabled: !!entityId && !!entityType,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

/**
 * Hook to fetch user's favorites
 */
export const useFavorites = (entityType?: string, page: number = 1, limit: number = 20) => {
  return useQuery({
    queryKey: ['favorites', entityType, page, limit],
    queryFn: () => engagementService.getUserFavorites(entityType, page, limit),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Hook to check if entity is favorited
 */
export const useIsFavorited = (entityId?: string, entityType?: string) => {
  return useQuery({
    queryKey: ['is-favorited', entityId, entityType],
    queryFn: () => engagementService.isFavorited(entityId!, entityType!),
    enabled: !!entityId && !!entityType,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Hook to fetch user's watchlist
 */
export const useWatchlist = (page: number = 1, limit: number = 20) => {
  return useQuery({
    queryKey: ['watchlist', page, limit],
    queryFn: () => engagementService.getUserWatchlist(page, limit),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Hook to check if movie is in watchlist
 */
export const useIsInWatchlist = (movieId?: string) => {
  return useQuery({
    queryKey: ['is-in-watchlist', movieId],
    queryFn: () => engagementService.isInWatchlist(movieId!),
    enabled: !!movieId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Hook to fetch user's watch history
 */
export const useHistory = (entityType?: string, page: number = 1, limit: number = 20) => {
  return useQuery({
    queryKey: ['history', entityType, page, limit],
    queryFn: () => engagementService.getUserHistory(entityType, page, limit),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Hook to fetch watch progress for an entity
 */
export const useWatchProgress = (entityId?: string, entityType?: string) => {
  return useQuery({
    queryKey: ['watch-progress', entityId, entityType],
    queryFn: () => engagementService.getWatchProgress(entityId!, entityType!),
    enabled: !!entityId && !!entityType,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

/**
 * Hook to fetch engagement statistics
 */
export const useEngagementStats = () => {
  return useQuery({
    queryKey: ['engagement-stats'],
    queryFn: () => engagementService.getEngagementStats(),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

// ============================================
// Mutation Hooks (POST, PUT, DELETE)
// ============================================

/**
 * Hook to create or update a rating
 */
export const useCreateRating = () => {
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
    }) => engagementService.createRating(entityId, entityType, rating, comment),
    onSuccess: (data) => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['rating'] });
      queryClient.invalidateQueries({ queryKey: ['ratings-summary'] });
      queryClient.invalidateQueries({ queryKey: ['engagement-stats'] });
    },
  });
};

/**
 * Hook to delete a rating
 */
export const useDeleteRating = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ entityId, entityType }: { entityId: string; entityType: string }) =>
      engagementService.deleteRating(entityId, entityType),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rating'] });
      queryClient.invalidateQueries({ queryKey: ['ratings-summary'] });
      queryClient.invalidateQueries({ queryKey: ['engagement-stats'] });
    },
  });
};

/**
 * Hook to add to favorites
 */
export const useAddToFavorites = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ entityId, entityType }: { entityId: string; entityType: string }) =>
      engagementService.addToFavorites(entityId, entityType),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
      queryClient.invalidateQueries({ queryKey: ['is-favorited'] });
      queryClient.invalidateQueries({ queryKey: ['engagement-stats'] });
    },
  });
};

/**
 * Hook to remove from favorites
 */
export const useRemoveFromFavorites = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ entityId, entityType }: { entityId: string; entityType: string }) =>
      engagementService.removeFromFavorites(entityId, entityType),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
      queryClient.invalidateQueries({ queryKey: ['is-favorited'] });
      queryClient.invalidateQueries({ queryKey: ['engagement-stats'] });
    },
  });
};

/**
 * Hook to add to watchlist
 */
export const useAddToWatchlist = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (movieId: string) => engagementService.addToWatchlist(movieId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['watchlist'] });
      queryClient.invalidateQueries({ queryKey: ['is-in-watchlist'] });
      queryClient.invalidateQueries({ queryKey: ['engagement-stats'] });
    },
  });
};

/**
 * Hook to remove from watchlist
 */
export const useRemoveFromWatchlist = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (movieId: string) => engagementService.removeFromWatchlist(movieId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['watchlist'] });
      queryClient.invalidateQueries({ queryKey: ['is-in-watchlist'] });
      queryClient.invalidateQueries({ queryKey: ['engagement-stats'] });
    },
  });
};

/**
 * Hook to update watch history
 */
export const useUpdateHistory = () => {
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
    }) => engagementService.updateHistory(entityId, entityType, progress, duration),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['history'] });
      queryClient.invalidateQueries({ queryKey: ['watch-progress'] });
      queryClient.invalidateQueries({ queryKey: ['engagement-stats'] });
    },
  });
};

// ============================================
// Convenience Hooks
// ============================================

/**
 * Hook to toggle favorite status
 */
export const useToggleFavorite = () => {
  const addMutation = useAddToFavorites();
  const removeMutation = useRemoveFromFavorites();
  const { data: isFavorited } = useIsFavorited();

  return {
    mutate: useCallback(
      (entityId: string, entityType: string) => {
        if (isFavorited) {
          removeMutation.mutate({ entityId, entityType });
        } else {
          addMutation.mutate({ entityId, entityType });
        }
      },
      [isFavorited, addMutation, removeMutation]
    ),
    isLoading: addMutation.isPending || removeMutation.isPending,
    isFavorited,
  };
};

/**
 * Hook to toggle watchlist status
 */
export const useToggleWatchlist = (movieId?: string) => {
  const addMutation = useAddToWatchlist();
  const removeMutation = useRemoveFromWatchlist();
  const { data: isInWatchlist } = useIsInWatchlist(movieId);

  return {
    mutate: useCallback(
      (id: string) => {
        if (isInWatchlist) {
          removeMutation.mutate(id);
        } else {
          addMutation.mutate(id);
        }
      },
      [isInWatchlist, addMutation, removeMutation]
    ),
    isLoading: addMutation.isPending || removeMutation.isPending,
    isInWatchlist,
  };
};
