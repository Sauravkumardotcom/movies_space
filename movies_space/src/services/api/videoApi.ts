import client from './client';

/**
 * Video API Service - Real Backend Integration (Phase A3)
 * Integrates with MongoDB-backed search, trending, and video endpoints
 * 
 * Endpoints:
 * - GET /api/videos - Search with filters, sorting, pagination
 * - GET /api/videos/trending - Trending videos (30-day window)
 * - GET /api/videos/genre/:genre - Genre-specific browse
 * - GET /api/videos/:id - Video details with auto-incrementing views
 * - GET /api/videos/recommendations/:genre - Genre recommendations
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
   * Search all videos with filters, sorting, and pagination (Phase A3)
   * GET /api/videos?q=query&genre=action&page=1&limit=20&sort=views&order=desc
   * 
   * Query Parameters:
   * - q: Search query (searches title, description, tags)
   * - genre: Filter by genre
   * - language: Filter by language
   * - minRating: Minimum rating (0-10)
   * - director: Filter by director
   * - year: Filter by year
   * - status: Filter by status (public, private)
   * - page: Page number (default 1)
   * - limit: Results per page (max 100, default 20)
   * - sort: Sort field (views, rating, date, title, trending)
   * - order: Sort order (asc, desc)
   */
  searchVideos: async (query: string, filters: any = {}) => {
    if (!query || query.trim().length === 0) {
      return { videos: EMPTY_RESULTS, total: 0, page: 1, totalPages: 0, hasMore: false };
    }

    try {
      const params = {
        q: query,
        ...filters,
        page: filters.page || 1,
        limit: Math.min(filters.limit || 20, 100),
        sort: filters.sort || 'relevance',
        order: filters.order || 'desc',
      };

      const result = await client.get('/api/videos', { params }) as any;
      return result || { videos: EMPTY_RESULTS, total: 0, page: 1, totalPages: 0, hasMore: false };
    } catch (error) {
      const message = getErrorMessage(error);
      console.error(`Failed to search videos for "${query}":`, message);
      return { videos: EMPTY_RESULTS, total: 0, page: 1, totalPages: 0, hasMore: false };
    }
  },

  /**
   * Get all videos with pagination
   * GET /api/videos?page=1&limit=20
   */
  getAllVideos: async (page = 1, limit = 20) => {
    try {
      const result = await client.get('/api/videos', {
        params: { page, limit: Math.min(limit, 100) }
      }) as any;
      return result || { videos: EMPTY_RESULTS, total: 0, page: 1, totalPages: 0, hasMore: false };
    } catch (error) {
      console.error('Failed to fetch videos:', error);
      return { videos: EMPTY_RESULTS, total: 0, page: 1, totalPages: 0, hasMore: false };
    }
  },

  /**
   * Get single video by ID with view increment (Phase A3)
   * GET /api/videos/:id
   * Auto-increments view count when accessed
   */
  getVideoById: async (id: string | number) => {
    try {
      const result = await client.get(`/api/videos/${id}`) as any;
      return result;
    } catch (error) {
      const message = getErrorMessage(error);
      console.error(`Failed to fetch video ${id}:`, message);
      throw new Error(message);
    }
  },

  /**
   * Get trending videos from last 30 days (Phase A3)
   * GET /api/videos/trending
   * Sorted by view count
   */
  getTrendingVideos: async (limit = 20) => {
    try {
      const result = await client.get('/api/videos/trending', {
        params: { limit: Math.min(limit, 100) }
      }) as any;
      return result?.videos || EMPTY_RESULTS;
    } catch (error) {
      const message = getErrorMessage(error);
      console.error('Failed to fetch trending videos:', message);
      return EMPTY_RESULTS;
    }
  },

  /**
   * Get videos by genre with optional filtering (Phase A3)
   * GET /api/videos/genre/:genre
   * Returns all videos in specified genre
   */
  getVideosByGenre: async (genre: string, limit = 20) => {
    if (!genre || genre.trim().length === 0) {
      return EMPTY_RESULTS;
    }

    try {
      const result = await client.get(`/api/videos/genre/${encodeURIComponent(genre)}`, {
        params: { limit: Math.min(limit, 100) }
      }) as any;
      return result?.videos || EMPTY_RESULTS;
    } catch (error) {
      const message = getErrorMessage(error);
      console.error(`Failed to fetch videos for genre ${genre}:`, message);
      return EMPTY_RESULTS;
    }
  },

  /**
   * Get recommended videos for a genre (Phase A3)
   * GET /api/videos/recommendations/:genre
   */
  getRecommendedVideos: async (genre: string, limit = 10) => {
    if (!genre || genre.trim().length === 0) {
      return EMPTY_RESULTS;
    }

    try {
      const result = await client.get(`/api/videos/recommendations/${encodeURIComponent(genre)}`, {
        params: { limit: Math.min(limit, 100) }
      }) as any;
      return result?.videos || EMPTY_RESULTS;
    } catch (error) {
      const message = getErrorMessage(error);
      console.error(`Failed to fetch recommendations for genre ${genre}:`, message);
      return EMPTY_RESULTS;
    }
  },

  /**
   * Advanced search with all filters (Phase A3)
   * Supports: genre, language, rating, director, year, status
   */
  advancedSearch: async (filters: {
    q?: string;
    genre?: string;
    language?: string;
    minRating?: number;
    director?: string;
    year?: number;
    status?: 'public' | 'private';
    page?: number;
    limit?: number;
    sort?: 'views' | 'rating' | 'date' | 'title' | 'trending';
    order?: 'asc' | 'desc';
  }) => {
    try {
      const params = {
        ...filters,
        page: filters.page || 1,
        limit: Math.min(filters.limit || 20, 100),
        sort: filters.sort || 'views',
        order: filters.order || 'desc',
      };

      const result = await client.get('/api/videos', { params }) as any;
      return result || { videos: EMPTY_RESULTS, total: 0, page: 1, totalPages: 0, hasMore: false };
    } catch (error) {
      const message = getErrorMessage(error);
      console.error('Failed to execute advanced search:', message);
      return { videos: EMPTY_RESULTS, total: 0, page: 1, totalPages: 0, hasMore: false };
    }
  },

  /**
   * Upload a new video (requires authentication)
   * POST /api/videos
   */
  uploadVideo: async (videoData: {
    title: string;
    description?: string;
    url: string;
    genre?: string;
    rating?: number;
    director?: string;
    language?: string;
    year?: number;
    tags?: string[];
  }) => {
    if (!videoData.title || !videoData.url) {
      throw new Error('Title and URL are required');
    }

    try {
      const result = await client.post('/api/videos', videoData) as any;
      return result;
    } catch (error) {
      const message = getErrorMessage(error);
      console.error('Failed to upload video:', message);
      throw new Error(message);
    }
  },

  /**
   * Legacy: Get short videos (for backwards compatibility)
   * Maps to trending videos with duration filter
   */
  getShortVideos: async (limit = 20) => {
    try {
      const result = await client.get('/api/videos', {
        params: { 
          limit: Math.min(limit, 100),
          sort: 'views',
          order: 'desc'
        }
      }) as any;
      return result?.videos || EMPTY_RESULTS;
    } catch (error) {
      const message = getErrorMessage(error);
      console.error('Failed to fetch short videos:', message);
      return EMPTY_RESULTS;
    }
  },
};
