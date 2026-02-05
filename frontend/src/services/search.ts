import axios from 'axios';

const API = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api/v1/search`,
  withCredentials: true,
});

export interface SearchResult {
  id: string;
  title: string;
  type: 'movie' | 'music' | 'short';
  posterUrl?: string;
  coverUrl?: string;
  thumbnailUrl?: string;
  description?: string;
  artist?: string;
}

export interface SearchResponse {
  data: SearchResult[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const searchService = {
  /**
   * Search content
   */
  async search(query: string, type?: string, page: number = 1, limit: number = 20) {
    const res = await API.get('/', {
      params: { q: query, type, page, limit },
    });
    return res.data.data as SearchResponse;
  },

  /**
   * Get trending movies
   */
  async getTrendingMovies(page: number = 1, limit: number = 20) {
    const res = await API.get('/trending/movies', {
      params: { page, limit },
    });
    return res.data.data as SearchResponse;
  },

  /**
   * Get trending music
   */
  async getTrendingMusic(page: number = 1, limit: number = 20) {
    const res = await API.get('/trending/music', {
      params: { page, limit },
    });
    return res.data.data as SearchResponse;
  },

  /**
   * Get recommendations
   */
  async getRecommendations(page: number = 1, limit: number = 20) {
    const res = await API.get('/recommendations', {
      params: { page, limit },
    });
    return res.data.data as SearchResponse;
  },
};
