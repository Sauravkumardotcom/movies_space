import { apiClient } from './api';
import type { Movie, Short, MovieFilters } from '@types/media';
import type { ApiResponse, PaginatedResponse } from '@types/api';

export const movieService = {
  async getMovies(filters?: MovieFilters): Promise<ApiResponse<PaginatedResponse<Movie>>> {
    return apiClient.get('/movies', filters);
  },

  async getMovieById(id: string): Promise<ApiResponse<Movie>> {
    return apiClient.get(`/movies/${id}`);
  },

  async getShorts(page: number = 1, limit: number = 10): Promise<ApiResponse<PaginatedResponse<Short>>> {
    return apiClient.get('/shorts/feed/shorts', { page, limit });
  },

  async getGenres(): Promise<ApiResponse<string[]>> {
    return apiClient.get('/movies/genres');
  },

  async getTrending(limit?: number): Promise<ApiResponse<Movie[]>> {
    return apiClient.get('/movies/trending', { limit });
  },

  async searchMovies(query: string): Promise<ApiResponse<Movie[]>> {
    return apiClient.get('/movies/search', { q: query });
  },

  // Activity endpoints
  async addToWatchlist(movieId: string): Promise<ApiResponse<null>> {
    return apiClient.post('/user/watchlist', { movieId });
  },

  async removeFromWatchlist(movieId: string): Promise<ApiResponse<null>> {
    return apiClient.delete(`/user/watchlist/${movieId}`);
  },

  async getWatchlist(page?: number, limit?: number): Promise<ApiResponse<PaginatedResponse<Movie>>> {
    return apiClient.get('/user/watchlist', { page, limit });
  },

  async addToFavorites(entityId: string, entityType: string): Promise<ApiResponse<null>> {
    return apiClient.post('/user/favorites', { entityId, entityType });
  },

  async removeFromFavorites(entityId: string, entityType: string): Promise<ApiResponse<null>> {
    return apiClient.delete(`/user/favorites/${entityId}/${entityType}`);
  },

  async getFavorites(): Promise<ApiResponse<any[]>> {
    return apiClient.get('/user/favorites');
  },

  async updateHistory(
    entityId: string,
    entityType: string,
    progress: number,
    duration: number
  ): Promise<ApiResponse<null>> {
    return apiClient.post('/user/history', { entityId, entityType, progress, duration });
  },

  async getHistory(limit?: number): Promise<ApiResponse<any[]>> {
    return apiClient.get('/user/history', { limit });
  },

  async submitRating(
    entityId: string,
    entityType: string,
    rating: number,
    comment?: string
  ): Promise<ApiResponse<null>> {
    return apiClient.post('/user/ratings', { entityId, entityType, rating, comment });
  },

  async deleteRating(entityId: string, entityType: string): Promise<ApiResponse<null>> {
    return apiClient.delete(`/user/ratings/${entityId}/${entityType}`);
  },
};
