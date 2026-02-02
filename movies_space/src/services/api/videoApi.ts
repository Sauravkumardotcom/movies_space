import client from './client';

/**
 * Video API Service with PRODUCTION ERROR HANDLING
 * Fetches video data from backend/Google Sheets
 * Gracefully handles network failures and API errors
 */

// Fallback empty array for graceful degradation
const EMPTY_RESULTS = [];

// Helper to provide user-friendly error messages
const getErrorMessage = (error: any): string => {
  if (error?.message?.includes('timeout')) {
    return 'Request timed out. Please try again.';
  }
  if (error?.message?.includes('CORS')) {
    return 'Network error. Please check your connection.';
  }
  if (error?.message?.includes('401')) {
    return 'Authentication failed. Please log in again.';
  }
  if (error?.message?.includes('404')) {
    return 'Resource not found.';
  }
  if (error?.message?.includes('Network')) {
    return 'Network error. Check your internet connection.';
  }
  return error?.message || 'An error occurred. Please try again.';
};

export const videoApi = {
  /**
   * Get all videos (with custom movies merged)
   * Falls back gracefully if API fails
   */
  getAllVideos: async () => {
    try {
      const result = await client.post('/api/apps-script', {
        action: 'getVideos',
        data: {},
      });
      return result || EMPTY_RESULTS;
    } catch (error) {
      console.error('Failed to fetch videos:', error);
      // Don't throw - return empty array with warning
      console.warn('⚠️ Using fallback: No videos available');
      return EMPTY_RESULTS;
    }
  },

  /**
   * Get single video by ID
   */
  getVideoById: async (id: string | number) => {
    try {
      const result = await client.post('/api/apps-script', {
        action: 'getVideoById',
        data: { id },
      });
      return result;
    } catch (error) {
      const message = getErrorMessage(error);
      console.error(`Failed to fetch video ${id}:`, message);
      throw new Error(message);
    }
  },

  /**
   * Search videos with enhanced error handling
   */
  searchVideos: async (query: string) => {
    if (!query || query.trim().length === 0) {
      return EMPTY_RESULTS;
    }

    try {
      const result = await client.post('/api/apps-script', {
        action: 'searchVideos',
        data: { query },
      });
      return result || EMPTY_RESULTS;
    } catch (error) {
      const message = getErrorMessage(error);
      console.error(`Failed to search videos for "${query}":`, message);
      // Don't throw - return empty array so UI doesn't crash
      return EMPTY_RESULTS;
    }
  },

  /**
   * Get trending videos (sorted by views)
   */
  getTrendingVideos: async () => {
    try {
      const result = await client.post('/api/apps-script', {
        action: 'getTrendingVideos',
        data: {},
      });
      return result || EMPTY_RESULTS;
    } catch (error) {
      const message = getErrorMessage(error);
      console.error('Failed to fetch trending videos:', message);
      return EMPTY_RESULTS;
    }
  },

  /**
   * Get videos by genre with error handling
   */
  getVideosByGenre: async (genre: string) => {
    try {
      const result = await client.post('/api/apps-script', {
        action: 'getVideosByGenre',
        data: { genre },
      });
      return result || EMPTY_RESULTS;
    } catch (error) {
      const message = getErrorMessage(error);
      console.error(`Failed to fetch videos for genre ${genre}:`, message);
      return EMPTY_RESULTS;
    }
  },

  /**
   * Get short videos
   */
  getShortVideos: async () => {
    try {
      const result = await client.post('/api/apps-script', {
        action: 'getShortVideos',
        data: {},
      });
      return result || EMPTY_RESULTS;
    } catch (error) {
      const message = getErrorMessage(error);
      console.error('Failed to fetch short videos:', message);
      return EMPTY_RESULTS;
    }
  },
};
