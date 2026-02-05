import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import * as authService from '../services/auth';
import type { User, SignupInput, LoginInput, ProfileUpdateInput } from '../services/auth';

// ============================================
// TYPES
// ============================================

export interface AuthState {
  // User state
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  setUser: (user: User | null) => void;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
  setIsLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;

  // Auth operations
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<void>;
  updateProfile: (data: ProfileUpdateInput) => Promise<void>;
}

// ============================================
// STORE
// ============================================

export const useAuth = create<AuthState>()(
  persist(
    (set, get) => ({
      // Initial state
      user: authService.getCurrentUser(),
      isAuthenticated: authService.isAuthenticated(),
      isLoading: false,
      error: null,

      // State setters
      setUser: (user) => {
        set({ user });
        if (user) {
          authService.setCurrentUser(user);
        }
      },

      setIsAuthenticated: (isAuthenticated) => set({ isAuthenticated }),

      setIsLoading: (isLoading) => set({ isLoading }),

      setError: (error) => set({ error }),

      // Login action
      login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authService.login({ email, password });
          if (response.status === 'success' && response.data?.user) {
            set({
              user: response.data.user,
              isAuthenticated: true,
              error: null,
            });
          } else {
            const errorMsg = response.message || 'Login failed';
            set({ error: errorMsg });
            throw new Error(errorMsg);
          }
        } catch (error: any) {
          const errorMsg = error.message || 'Login failed';
          set({ error: errorMsg });
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      // Signup action
      signup: async (email, username, password) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authService.signup({ email, username, password });
          if (response.status === 'success' && response.data?.user) {
            set({
              user: response.data.user,
              isAuthenticated: true,
              error: null,
            });
          } else {
            const errorMsg = response.message || 'Signup failed';
            set({ error: errorMsg });
            throw new Error(errorMsg);
          }
        } catch (error: any) {
          const errorMsg = error.message || 'Signup failed';
          set({ error: errorMsg });
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      // Logout action
      logout: async () => {
        set({ isLoading: true, error: null });
        try {
          await authService.logout();
          set({
            user: null,
            isAuthenticated: false,
            error: null,
          });
        } catch (error: any) {
          const errorMsg = error.message || 'Logout failed';
          set({ error: errorMsg });
          // Still clear auth state even if API call fails
          set({ user: null, isAuthenticated: false });
        } finally {
          set({ isLoading: false });
        }
      },

      // Refresh token action
      refreshToken: async () => {
        try {
          await authService.refreshAccessToken();
          // Token refreshed, update auth state
          const user = authService.getCurrentUser();
          set({ user, isAuthenticated: !!user });
        } catch (error: any) {
          set({ error: error.message || 'Token refresh failed' });
        }
      },

      // Update profile action
      updateProfile: async (data: ProfileUpdateInput) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authService.updateProfile(data);
          if (response.status === 'success' && response.data) {
            set({
              user: response.data,
              error: null,
            });
          } else {
            const errorMsg = response.message || 'Profile update failed';
            set({ error: errorMsg });
            throw new Error(errorMsg);
          }
        } catch (error: any) {
          const errorMsg = error.message || 'Profile update failed';
          set({ error: errorMsg });
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },
    }),
    {
      name: 'auth-storage', // localStorage key
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
