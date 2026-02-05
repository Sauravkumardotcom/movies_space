import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as authService from '../services/auth';

// ============================================
// AUTH QUERY HOOKS
// ============================================

/**
 * Get current user profile
 */
export const useUser = () => {
  return useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const token = authService.getAccessToken();
      if (!token) return null;

      try {
        const response = await authService.getProfile();
        return response.data;
      } catch {
        return null;
      }
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    retry: false,
  });
};

/**
 * Get current user from localStorage (synchronous)
 */
export const useCurrentUser = () => {
  const user = authService.getCurrentUser();

  return {
    user,
    isAuthenticated: !!user,
  };
};

// ============================================
// AUTH MUTATION HOOKS
// ============================================

/**
 * Sign up new user
 */
export const useSignup = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: Parameters<typeof authService.signup>[0]) =>
      authService.signup(input),
    onSuccess: (data) => {
      if (data.data?.user) {
        queryClient.setQueryData(['user'], data.data.user);
      }
    },
  });
};

/**
 * Login user
 */
export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: Parameters<typeof authService.login>[0]) =>
      authService.login(input),
    onSuccess: (data) => {
      if (data.data?.user) {
        queryClient.setQueryData(['user'], data.data.user);
      }
    },
  });
};

/**
 * Logout user
 */
export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      // Clear all cached data
      queryClient.clear();
    },
  });
};

/**
 * Update user profile
 */
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: Parameters<typeof authService.updateProfile>[0]) =>
      authService.updateProfile(input),
    onSuccess: (data) => {
      if (data.data) {
        queryClient.setQueryData(['user'], data.data);
      }
    },
  });
};

/**
 * Change password
 */
export const useChangePassword = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: Parameters<typeof authService.changePassword>[0]) =>
      authService.changePassword(input),
    onSuccess: () => {
      // Password changed, user will need to login again
      queryClient.clear();
    },
  });
};

/**
 * Refresh access token
 */
export const useRefreshToken = () => {
  return useMutation({
    mutationFn: () => authService.refreshAccessToken(),
  });
};
