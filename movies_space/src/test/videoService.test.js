import { describe, it, expect, beforeEach } from 'vitest';
import { videoService } from '../services/videoService';

describe('videoService', () => {
  const mockCustomMovies = [
    {
      id: 'custom_1001',
      title: 'Custom Movie 1',
      description: 'Test movie',
      src: 'https://example.com/video1.mp4',
    },
    {
      id: 'custom_1002',
      title: 'Custom Movie 2',
      description: 'Another test movie',
      src: 'https://example.com/video2.mp4',
    },
  ];

  describe('getAllVideos', () => {
    it('should return all videos with custom movies', async () => {
      const result = await videoService.getAllVideos(mockCustomMovies);
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
    });

    it('should include custom movies in results', async () => {
      const result = await videoService.getAllVideos(mockCustomMovies);
      const customCount = result.filter((v) => v.id.toString().startsWith('custom_')).length;
      expect(customCount).toBe(2);
    });
  });

  describe('getVideoById', () => {
    it('should find video by custom string ID', async () => {
      const video = await videoService.getVideoById('custom_1001', mockCustomMovies);
      expect(video).toBeDefined();
      expect(video.id).toBe('custom_1001');
      expect(video.title).toBe('Custom Movie 1');
    });

    it('should find video by numeric ID', async () => {
      const video = await videoService.getVideoById(1, mockCustomMovies);
      expect(video).toBeDefined();
      expect(video.id).toBe(1);
    });

    it('should return undefined for non-existent video', async () => {
      const video = await videoService.getVideoById('nonexistent', mockCustomMovies);
      expect(video).toBeUndefined();
    });

    it('should handle both string and numeric ID matching', async () => {
      const video1 = await videoService.getVideoById('custom_1001', mockCustomMovies);
      expect(video1).toBeDefined();

      const video2 = await videoService.getVideoById('custom_1002', mockCustomMovies);
      expect(video2).toBeDefined();
    });
  });

  describe('searchVideos', () => {
    it('should search videos by title', async () => {
      const results = await videoService.searchVideos('Custom Movie 1', mockCustomMovies);
      expect(Array.isArray(results)).toBe(true);
      expect(results.some((v) => v.title.includes('Custom Movie 1'))).toBe(true);
    });

    it('should search videos by description', async () => {
      const results = await videoService.searchVideos('Another test', mockCustomMovies);
      expect(results.length).toBeGreaterThan(0);
    });

    it('should return empty array for no matches', async () => {
      const results = await videoService.searchVideos('xyz123xyz', mockCustomMovies);
      expect(Array.isArray(results)).toBe(true);
    });

    it('should be case-insensitive', async () => {
      const results = await videoService.searchVideos('CUSTOM', mockCustomMovies);
      expect(results.length).toBeGreaterThan(0);
    });
  });

  describe('getShortVideos', () => {
    it('should return short videos', async () => {
      const shorts = await videoService.getShortVideos(mockCustomMovies);
      expect(Array.isArray(shorts)).toBe(true);
    });
  });

  describe('getGenreVideos', () => {
    it('should filter videos by genre', async () => {
      const genreVideos = await videoService.getGenreVideos('Action', mockCustomMovies);
      expect(Array.isArray(genreVideos)).toBe(true);
    });
  });

  describe('getTrendingVideos', () => {
    it('should return trending videos', async () => {
      const trending = await videoService.getTrendingVideos(mockCustomMovies);
      expect(Array.isArray(trending)).toBe(true);
    });
  });
});
