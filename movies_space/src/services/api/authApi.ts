import client from './client';

/**
 * Authentication API Service - Real Backend Integration (Phase A2)
 * Integrates with: POST /api/auth/register, /login, /refresh-token, /me, /logout
 */

export const authApi = {
  /**
   * User Registration - Creates new user account
   * Endpoint: POST /api/auth/register
   * Returns: { accessToken, refreshToken, user }
   */
  register: async (email: string, password: string) => {
    if (!email || !password) {
      throw new Error('Email and password are required');
    }

    try {
      const response = await client.post('/api/auth/register', { 
        email: email.toLowerCase(), 
        password 
      }) as any;
      
      // Store both tokens (from Phase A2 implementation)
      if (response?.accessToken) {
        localStorage.setItem('accessToken', response.accessToken);
      }
      if (response?.refreshToken) {
        localStorage.setItem('refreshToken', response.refreshToken);
      }
      
      return response;
    } catch (error) {
      const err = error as any;
      if (err.message?.includes('409')) {
        throw new Error('Email already registered. Please login or use a different email.');
      }
      throw error;
    }
  },

  /**
   * User Login - Authenticates user credentials
   * Endpoint: POST /api/auth/login
   * Returns: { accessToken, refreshToken, user }
   */
  userLogin: async (email: string, password: string) => {
    if (!email || !password) {
      throw new Error('Email and password are required');
    }

    try {
      const response = await client.post('/api/auth/login', { 
        email: email.toLowerCase(), 
        password 
      }) as any;
      
      // Store both tokens
      if (response?.accessToken) {
        localStorage.setItem('accessToken', response.accessToken);
      }
      if (response?.refreshToken) {
        localStorage.setItem('refreshToken', response.refreshToken);
      }
      
      return response;
    } catch (error) {
      throw new Error('Login failed. Please check your credentials.');
    }
  },

  /**
   * Get Current User Profile
   * Endpoint: GET /api/auth/me (protected)
   * Returns: { id, email, firstName, lastName, avatar, bio, role }
   */
  getCurrentUser: async () => {
    try {
      const response = await client.get('/api/auth/me') as any;
      return response;
    } catch (error) {
      console.error('Failed to fetch current user:', error);
      throw error;
    }
  },

  /**
   * Refresh Access Token
   * Endpoint: POST /api/auth/refresh-token
   * Returns: { accessToken, refreshToken }
   */
  refreshToken: async (refreshToken: string) => {
    if (!refreshToken) {
      throw new Error('Refresh token is required');
    }

    try {
      const response = await client.post('/api/auth/refresh-token', { 
        refreshToken 
      }) as any;
      
      // Update stored tokens
      if (response?.accessToken) {
        localStorage.setItem('accessToken', response.accessToken);
      }
      if (response?.refreshToken) {
        localStorage.setItem('refreshToken', response.refreshToken);
      }
      
      return response;
    } catch (error) {
      // Clear tokens if refresh fails
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      throw new Error('Token refresh failed. Please login again.');
    }
  },

  /**
   * Logout - Clear local auth state
   * Endpoint: POST /api/auth/logout (optional, for audit trails)
   */
  logout: async () => {
    try {
      // Notify backend (optional)
      await client.post('/api/auth/logout', {}).catch(() => {
        // Ignore logout endpoint errors - still clear local storage
      });
    } finally {
      // Always clear local storage
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('authToken');
      localStorage.removeItem('adminToken');
    }
    return Promise.resolve();
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('accessToken') || !!localStorage.getItem('authToken');
  },

  /**
   * Get access token
   */
  getAccessToken: (): string | null => {
    return localStorage.getItem('accessToken') || localStorage.getItem('authToken');
  },

  /**
   * Admin login - validates password via backend
   * Note: Admin functionality may be separate - keeping for backwards compatibility
   */
  adminLogin: async (password: string) => {
    if (!password || password.trim().length === 0) {
      throw new Error('Password is required');
    }

    try {
      const response = await client.post('/api/auth/admin/login', { password }) as any;
      
      // Store token for future requests
      if (response?.token) {
        localStorage.setItem('adminToken', response.token);
      }
      
      return response;
    } catch (error) {
      if ((error as Error).message.includes('401') || (error as Error).message.includes('Invalid')) {
        throw new Error('Invalid admin password');
      }
      throw error;
    }
  },

  /**
   * Check if admin token is valid
   */
  isAdminAuthenticated: (): boolean => {
    return !!localStorage.getItem('adminToken');
  },

  /**
   * Get admin token
   */
  getAdminToken: (): string | null => {
    return localStorage.getItem('adminToken');
  },
};
