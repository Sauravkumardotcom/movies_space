import client from '../api/client';

/**
 * Google Authentication Service
 * Manages OAuth tokens and Google API access
 */

interface GoogleAuthToken {
  accessToken: string;
  refreshToken?: string;
  expiresIn: number;
  tokenType: string;
  scope?: string;
}

interface GoogleAuthState {
  isAuthenticated: boolean;
  userInfo?: {
    id: string;
    email: string;
    name: string;
    picture?: string;
  };
  token?: GoogleAuthToken;
}

export const googleAuthApi = {
  /**
   * Get current Google Auth state
   */
  getAuthState: async (): Promise<GoogleAuthState> => {
    return await client.get('/api/google/auth/state');
  },

  /**
   * Get authorization URL for user to login
   */
  getAuthorizationUrl: async (scopes?: string[]): Promise<{ authorizationUrl: string }> => {
    return await client.post('/api/google/auth/authorization-url', {
      scopes: scopes || [
        'https://www.googleapis.com/auth/drive.readonly',
        'https://www.googleapis.com/auth/spreadsheets.readonly'
      ]
    });
  },

  /**
   * Exchange authorization code for tokens
   */
  exchangeCodeForToken: async (code: string): Promise<GoogleAuthToken> => {
    return await client.post('/api/google/auth/exchange-token', { code });
  },

  /**
   * Refresh access token using refresh token
   */
  refreshToken: async (): Promise<GoogleAuthToken> => {
    return await client.post('/api/google/auth/refresh-token');
  },

  /**
   * Get user info from Google
   */
  getUserInfo: async (): Promise<{
    id: string;
    email: string;
    name: string;
    picture?: string;
  }> => {
    return await client.get('/api/google/auth/user-info');
  },

  /**
   * Revoke Google authentication
   */
  revokeAuth: async (): Promise<{ success: boolean }> => {
    return await client.post('/api/google/auth/revoke');
  },

  /**
   * Check if user is authenticated with Google
   */
  isAuthenticated: async (): Promise<boolean> => {
    try {
      const state = await googleAuthApi.getAuthState();
      return state.isAuthenticated;
    } catch {
      return false;
    }
  },
};

export default googleAuthApi;
