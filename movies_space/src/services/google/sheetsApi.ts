import client from '../api/client';

/**
 * Google Sheets API Service
 * Proxied through backend to avoid CORS issues
 */

interface SheetData {
  id?: string;
  title: string;
  genre: string[];
  description: string;
  director?: string;
  imdbRating?: number;
  duration?: number;
  releaseYear: number;
  videoUrl?: string;
  thumbnailUrl?: string;
  type: 'movie' | 'series' | 'short';
  trending?: boolean;
  status?: 'pending' | 'approved' | 'rejected';
}

export const sheetsApi = {
  /**
   * Fetch all videos from Google Sheets
   */
  getAllVideos: async (): Promise<SheetData[]> => {
    return await client.get('/api/google/sheets/videos');
  },

  /**
   * Fetch a single video by ID
   */
  getVideoById: async (id: string): Promise<SheetData> => {
    return await client.get(`/api/google/sheets/videos/${id}`);
  },

  /**
   * Fetch videos by genre
   */
  getVideosByGenre: async (genre: string): Promise<SheetData[]> => {
    return await client.get(`/api/google/sheets/videos/genre/${genre}`);
  },

  /**
   * Search videos by title
   */
  searchVideos: async (query: string): Promise<SheetData[]> => {
    return await client.get('/api/google/sheets/search', {
      params: { q: query }
    });
  },

  /**
   * Get trending videos
   */
  getTrendingVideos: async (): Promise<SheetData[]> => {
    return await client.get('/api/google/sheets/videos/trending');
  },

  /**
   * Add a new video to Sheets
   */
  addVideo: async (videoData: SheetData): Promise<SheetData> => {
    return await client.post('/api/google/sheets/videos', videoData);
  },

  /**
   * Update an existing video
   */
  updateVideo: async (id: string, videoData: Partial<SheetData>): Promise<SheetData> => {
    return await client.put(`/api/google/sheets/videos/${id}`, videoData);
  },

  /**
   * Delete a video
   */
  deleteVideo: async (id: string): Promise<{ success: boolean }> => {
    return await client.delete(`/api/google/sheets/videos/${id}`);
  },

  /**
   * Get all genres
   */
  getAllGenres: async (): Promise<string[]> => {
    return await client.get('/api/google/sheets/genres');
  },
};

export default sheetsApi;
