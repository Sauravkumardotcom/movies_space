import client from './client';

/**
 * Video API Service
 * Fetches video data from backend/Google Sheets
 */

export const videoApi = {
  /**
   * Get all videos (with custom movies merged)
   */
  getAllVideos: async () => {
    try {
      return await client.post('/api/apps-script', {
        action: 'getVideos',
        data: {},
      });
    } catch (error) {
      console.error('Failed to fetch videos:', error);
      throw error;
    }
  },

  /**
   * Get single video by ID
   */
  getVideoById: async (id: string | number) => {
    try {
      return await client.post('/api/apps-script', {
        action: 'getVideoById',
        data: { id },
      });
    } catch (error) {
      console.error(`Failed to fetch video ${id}:`, error);
      throw error;
    }
  },

  /**
   * Search videos
   */
  searchVideos: async (query: string) => {
    if (!query || query.trim().length === 0) {
      return [];
    }

    try {
      return await client.post('/api/apps-script', {
        action: 'searchVideos',
        data: { query },
      });
    } catch (error) {
      console.error(`Failed to search videos for "${query}":`, error);
      throw error;
    }
  },

  /**
   * Get trending videos (sorted by views)
   */
  getTrendingVideos: async () => {
    try {
      return await client.post('/api/apps-script', {
        action: 'getTrendingVideos',
        data: {},
      });
    } catch (error) {
      console.error('Failed to fetch trending videos:', error);
      throw error;
    }
  },

  /**
   * Get videos by genre
   */
  getVideosByGenre: async (genre: string) => {
    try {
      return await client.post('/api/apps-script', {
        action: 'getVideosByGenre',
        data: { genre },
      });
    } catch (error) {
      console.error(`Failed to fetch videos for genre ${genre}:`, error);
      throw error;
    }
  },

  /**
   * Get short videos
   */
  getShortVideos: async () => {
    try {
      return await client.post('/api/apps-script', {
        action: 'getShortVideos',
        data: {},
      });
    } catch (error) {
      console.error('Failed to fetch short videos:', error);
      throw error;
    }
  },
};
