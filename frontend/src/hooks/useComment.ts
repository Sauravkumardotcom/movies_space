import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { commentService } from '../services/comment';

export function useComments(entityId: string, entityType: string, page = 1) {
  return useQuery({
    queryKey: ['comments', entityId, entityType, page],
    queryFn: () => commentService.getEntityComments(entityId, entityType, page),
  });
}

export function useCommentReplies(commentId: string, page = 1) {
  return useQuery({
    queryKey: ['commentReplies', commentId, page],
    queryFn: () => commentService.getCommentReplies(commentId, page),
  });
}

export function useCreateComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      entityId,
      entityType,
      content,
      rating,
    }: {
      entityId: string;
      entityType: string;
      content: string;
      rating?: number;
    }) =>
      commentService.createComment({ entityId, entityType, content, rating }),
    onSuccess: (data) => {
      // Invalidate comments for this entity
      queryClient.invalidateQueries({ queryKey: ['comments'] });
    },
  });
}

export function useUpdateComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      commentId,
      content,
      rating,
    }: {
      commentId: string;
      content: string;
      rating?: number;
    }) => commentService.updateComment(commentId, { content, rating }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments'] });
      queryClient.invalidateQueries({ queryKey: ['commentReplies'] });
    },
  });
}

export function useDeleteComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (commentId: string) => commentService.deleteComment(commentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments'] });
      queryClient.invalidateQueries({ queryKey: ['commentReplies'] });
    },
  });
}

export function useReplyToComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      commentId,
      content,
    }: {
      commentId: string;
      content: string;
    }) => commentService.replyToComment(commentId, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['commentReplies'] });
    },
  });
}

export function useLikeComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (commentId: string) => commentService.likeComment(commentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments'] });
      queryClient.invalidateQueries({ queryKey: ['commentReplies'] });
    },
  });
}

export function useUnlikeComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (commentId: string) =>
      commentService.unlikeComment(commentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments'] });
      queryClient.invalidateQueries({ queryKey: ['commentReplies'] });
    },
  });
}

export function useCommentLikesCount(commentId: string) {
  return useQuery({
    queryKey: ['commentLikes', commentId],
    queryFn: () => commentService.getCommentLikesCount(commentId),
  });
}

export function useUserComments(userId: string, page = 1) {
  return useQuery({
    queryKey: ['userComments', userId, page],
    queryFn: () => commentService.getUserComments(userId, page),
  });
}
