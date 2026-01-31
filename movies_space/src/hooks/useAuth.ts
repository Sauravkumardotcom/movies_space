import { useState, useCallback, useEffect } from 'react';
import { authApi } from '../services/api/authApi';

export interface User {
  id?: string;
  email?: string;
  name?: string;
  role?: 'admin' | 'user';
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  loading: boolean;
  error: string | null;
}

const STORAGE_KEYS = {
  AUTH_TOKEN: 'authToken',
  ADMIN_TOKEN: 'adminToken',
  USER: 'user',
};

/**
 * Hook for managing user and admin authentication
 */
export const useAuth = () => {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isAdmin: false,
    loading: true,
    error: null,
  });

  // Check if user is authenticated on mount
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      const adminToken = localStorage.getItem(STORAGE_KEYS.ADMIN_TOKEN);
      const userData = localStorage.getItem(STORAGE_KEYS.USER);

      if (token || adminToken) {
        try {
          const user = userData ? JSON.parse(userData) : null;
          setState({
            user,
            isAuthenticated: !!token,
            isAdmin: !!adminToken,
            loading: false,
            error: null,
          });
        } catch {
          clearAuth();
        }
      } else {
        setState(prev => ({ ...prev, loading: false }));
      }
    };

    checkAuth();
  }, []);

  /**
   * Admin login
   */
  const adminLogin = useCallback(async (password: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const response = await authApi.adminLogin(password) as any;
      if (response?.token) {
        localStorage.setItem(STORAGE_KEYS.ADMIN_TOKEN, response.token);
        setState({
          user: { role: 'admin' },
          isAuthenticated: false,
          isAdmin: true,
          loading: false,
          error: null,
        });
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Login failed';
      setState(prev => ({
        ...prev,
        loading: false,
        error: message,
      }));
      throw error;
    }
  }, []);

  /**
   * User login
   */
  const userLogin = useCallback(async (email: string, password: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const response = await authApi.userLogin(email, password) as any;
      if (response?.token) {
        localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, response.token);
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(response.user || { email }));
        setState({
          user: response.user || { email },
          isAuthenticated: true,
          isAdmin: false,
          loading: false,
          error: null,
        });
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Login failed';
      setState(prev => ({
        ...prev,
        loading: false,
        error: message,
      }));
      throw error;
    }
  }, []);

  /**
   * Logout
   */
  const logout = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true }));
    try {
      await authApi.logout();
      clearAuth();
      setState({
        user: null,
        isAuthenticated: false,
        isAdmin: false,
        loading: false,
        error: null,
      });
    } catch (error) {
      console.error('Logout failed:', error);
      // Still clear local storage even if backend logout fails
      clearAuth();
      setState({
        user: null,
        isAuthenticated: false,
        isAdmin: false,
        loading: false,
        error: null,
      });
    }
  }, []);

  /**
   * Clear authentication data
   */
  const clearAuth = () => {
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.ADMIN_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
  };

  /**
   * Check if admin token is still valid
   */
  const isAdminAuthenticated = useCallback(async () => {
    try {
      return await authApi.isAdminAuthenticated();
    } catch {
      return false;
    }
  }, []);

  return {
    ...state,
    adminLogin,
    userLogin,
    logout,
    isAdminAuthenticated,
  };
};
