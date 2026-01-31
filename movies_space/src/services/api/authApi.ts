import client from './client';

/**
 * Authentication API Service
 * Fixes Issue #01: Removes hardcoded password, uses backend validation
 */

export const authApi = {
  /**
   * Admin login - validates password via backend
   * Backend compares against hashed password in .env (not in code)
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
   * User login
   */
  userLogin: async (email: string, password: string) => {
    if (!email || !password) {
      throw new Error('Email and password are required');
    }

    try {
      const response = await client.post('/api/auth/login', { email, password }) as any;
      
      if (response?.token) {
        localStorage.setItem('authToken', response.token);
      }
      
      return response;
    } catch (error) {
      throw new Error('Login failed. Please check your credentials.');
    }
  },

  /**
   * Logout
   */
  logout: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('adminToken');
    return Promise.resolve();
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
