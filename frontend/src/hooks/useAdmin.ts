import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { adminService } from '../services/admin';

export function useAdminUsers(page = 1) {
  return useQuery({
    queryKey: ['adminUsers', page],
    queryFn: () => adminService.getAllUsers(page),
  });
}

export function useAdminUserStats(userId: string) {
  return useQuery({
    queryKey: ['adminUserStats', userId],
    queryFn: () => adminService.getUserStats(userId),
    enabled: !!userId,
  });
}

export function usePlatformStats() {
  return useQuery({
    queryKey: ['platformStats'],
    queryFn: () => adminService.getPlatformStats(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useBanUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string, reason?: string) =>
      adminService.banUser(userId, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminUsers'] });
      queryClient.invalidateQueries({ queryKey: ['adminUserStats'] });
    },
  });
}

export function useUnbanUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => adminService.unbanUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminUsers'] });
      queryClient.invalidateQueries({ queryKey: ['adminUserStats'] });
    },
  });
}

export function useAdminDeleteComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (commentId: string, reason?: string) =>
      adminService.deleteComment(commentId, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments'] });
      queryClient.invalidateQueries({ queryKey: ['modLogs'] });
    },
  });
}

export function useModerationLogs(page = 1) {
  return useQuery({
    queryKey: ['modLogs', page],
    queryFn: () => adminService.getModerationLogs(page),
  });
}

export function useReportContent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: { contentId: string; contentType: string; reason: string }) =>
      adminService.reportContent(input.contentId, input.contentType, input.reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reports'] });
    },
  });
}

export function useAdminReports(page = 1, status?: string) {
  return useQuery({
    queryKey: ['adminReports', page, status],
    queryFn: () => adminService.getReports(page, 20, status),
  });
}

export function useResolveReport() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: { reportId: string; action: string; notes?: string }) =>
      adminService.resolveReport(input.reportId, input.action, input.notes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminReports'] });
      queryClient.invalidateQueries({ queryKey: ['modLogs'] });
    },
  });
}
