import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { socialService } from '../services/social';

export function useFollow(userId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => socialService.followUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['followers', userId] });
      queryClient.invalidateQueries({ queryKey: ['following'] });
      queryClient.invalidateQueries({ queryKey: ['followerStats', userId] });
      queryClient.invalidateQueries({ queryKey: ['isFollowing'] });
    },
  });
}

export function useUnfollow(userId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => socialService.unfollowUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['followers', userId] });
      queryClient.invalidateQueries({ queryKey: ['following'] });
      queryClient.invalidateQueries({ queryKey: ['followerStats', userId] });
      queryClient.invalidateQueries({ queryKey: ['isFollowing'] });
    },
  });
}

export function useFollowers(userId: string, page = 1) {
  return useQuery({
    queryKey: ['followers', userId, page],
    queryFn: () => socialService.getFollowers(userId, page),
  });
}

export function useFollowing(userId: string, page = 1) {
  return useQuery({
    queryKey: ['following', userId, page],
    queryFn: () => socialService.getFollowing(userId, page),
  });
}

export function useIsFollowing(userId: string) {
  return useQuery({
    queryKey: ['isFollowing', userId],
    queryFn: () => socialService.isFollowing(userId),
    enabled: !!userId,
  });
}

export function useFollowerStats(userId: string) {
  return useQuery({
    queryKey: ['followerStats', userId],
    queryFn: () => socialService.getFollowerStats(userId),
  });
}

export function useCreateList() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: { name: string; description?: string; isPublic?: boolean }) =>
      socialService.createList(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userLists'] });
    },
  });
}

export function useUpdateList() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      listId,
      input,
    }: {
      listId: string;
      input: { name: string; description?: string; isPublic?: boolean };
    }) => socialService.updateList(listId, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userLists'] });
      queryClient.invalidateQueries({ queryKey: ['list'] });
    },
  });
}

export function useDeleteList() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (listId: string) => socialService.deleteList(listId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userLists'] });
    },
  });
}

export function useList(listId: string, page = 1) {
  return useQuery({
    queryKey: ['list', listId, page],
    queryFn: () => socialService.getList(listId, page),
    enabled: !!listId,
  });
}

export function useUserLists(userId: string, page = 1) {
  return useQuery({
    queryKey: ['userLists', userId, page],
    queryFn: () => socialService.getUserLists(userId, page),
  });
}

export function useAddToList() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      listId,
      entityId,
      entityType,
    }: {
      listId: string;
      entityId: string;
      entityType: string;
    }) => socialService.addItemToList(listId, entityId, entityType),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['list'] });
      queryClient.invalidateQueries({ queryKey: ['userLists'] });
    },
  });
}

export function useRemoveFromList() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      listId,
      entityId,
      entityType,
    }: {
      listId: string;
      entityId: string;
      entityType: string;
    }) => socialService.removeItemFromList(listId, entityId, entityType),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['list'] });
      queryClient.invalidateQueries({ queryKey: ['userLists'] });
    },
  });
}
