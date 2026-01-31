import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { useAppStore } from '../store/useAppStore';

describe('useAppStore', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    // Reset store to initial state
    useAppStore.getState().customMovies = [];
    useAppStore.getState().favorites = [];
    useAppStore.getState().watchHistory = [];
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe('Authentication', () => {
    it('should initialize with no user', () => {
      const state = useAppStore.getState();
      expect(state.user).toBeNull();
      expect(state.isAuthenticated).toBe(false);
    });

    it('should set user and authentication', () => {
      const testUser = { id: 1, name: 'Test User' };
      useAppStore.getState().setUser(testUser);
      const state = useAppStore.getState();
      expect(state.user).toEqual(testUser);
      expect(state.isAuthenticated).toBe(true);
    });

    it('should logout user', () => {
      const testUser = { id: 1, name: 'Test User' };
      useAppStore.getState().setUser(testUser);
      useAppStore.getState().logout();
      const state = useAppStore.getState();
      expect(state.user).toBeNull();
      expect(state.isAuthenticated).toBe(false);
    });
  });

  describe('Theme', () => {
    it('should initialize with dark theme', () => {
      expect(useAppStore.getState().theme).toBe('dark');
    });

    it('should change theme', () => {
      useAppStore.getState().setTheme('light');
      expect(useAppStore.getState().theme).toBe('light');
    });
  });

  describe('Custom Movies', () => {
    it('should initialize with empty custom movies', () => {
      expect(useAppStore.getState().customMovies).toEqual([]);
    });

    it('should add custom movie with auto-generated ID', () => {
      const movie = {
        title: 'Test Movie',
        src: 'https://example.com/video.mp4',
        description: 'Test description',
      };
      useAppStore.getState().addCustomMovie(movie);
      const state = useAppStore.getState();
      expect(state.customMovies.length).toBe(1);
      expect(state.customMovies[0].id).toMatch(/custom_\d+/);
      expect(state.customMovies[0].title).toBe('Test Movie');
    });

    it('should remove custom movie', () => {
      const movie = {
        title: 'Test Movie',
        src: 'https://example.com/video.mp4',
      };
      useAppStore.getState().addCustomMovie(movie);
      const movieId = useAppStore.getState().customMovies[0].id;
      useAppStore.getState().removeCustomMovie(movieId);
      expect(useAppStore.getState().customMovies.length).toBe(0);
    });

    it('should persist custom movies to localStorage', () => {
      const movie = {
        title: 'Persistent Movie',
        src: 'https://example.com/video.mp4',
      };
      useAppStore.getState().addCustomMovie(movie);
      const stored = localStorage.getItem('moviespace-storage');
      expect(stored).toBeTruthy();
      const parsed = JSON.parse(stored);
      expect(parsed.state.customMovies.length).toBe(1);
    });
  });

  describe('Favorites', () => {
    it('should initialize with empty favorites', () => {
      expect(useAppStore.getState().favorites).toEqual([]);
    });

    it('should add video to favorites', () => {
      const video = {
        id: 1,
        title: 'Test Video',
        src: 'https://example.com/video.mp4',
      };
      useAppStore.getState().addToFavorites(video);
      expect(useAppStore.getState().favorites.length).toBe(1);
      expect(useAppStore.getState().favorites[0].id).toBe(1);
    });

    it('should not add duplicate favorites', () => {
      const video = {
        id: 1,
        title: 'Test Video',
        src: 'https://example.com/video.mp4',
      };
      useAppStore.getState().addToFavorites(video);
      useAppStore.getState().addToFavorites(video);
      expect(useAppStore.getState().favorites.length).toBe(1);
    });

    it('should remove from favorites', () => {
      const video = {
        id: 1,
        title: 'Test Video',
        src: 'https://example.com/video.mp4',
      };
      useAppStore.getState().addToFavorites(video);
      useAppStore.getState().removeFromFavorites(1);
      expect(useAppStore.getState().favorites.length).toBe(0);
    });
  });

  describe('Watch History', () => {
    it('should initialize with empty watch history', () => {
      expect(useAppStore.getState().watchHistory).toEqual([]);
    });

    it('should add video to watch history', () => {
      const video = {
        id: 1,
        title: 'Test Video',
        src: 'https://example.com/video.mp4',
      };
      useAppStore.getState().addToWatchHistory(video);
      const history = useAppStore.getState().watchHistory;
      expect(history.length).toBe(1);
      expect(history[0].watchedAt).toBeDefined();
    });

    it('should maintain max 100 entries in watch history', () => {
      for (let i = 0; i < 105; i++) {
        const video = {
          id: i,
          title: `Video ${i}`,
          src: `https://example.com/video${i}.mp4`,
        };
        useAppStore.getState().addToWatchHistory(video);
      }
      expect(useAppStore.getState().watchHistory.length).toBe(100);
    });
  });

  describe('Movie Requests', () => {
    it('should initialize with empty movie requests', () => {
      expect(useAppStore.getState().movieRequests).toEqual([]);
    });

    it('should add movie request', () => {
      const request = {
        title: 'Requested Movie',
        description: 'A great movie',
      };
      useAppStore.getState().addMovieRequest(request);
      const requests = useAppStore.getState().movieRequests;
      expect(requests.length).toBe(1);
      expect(requests[0].id).toBeDefined();
      expect(requests[0].status).toBe('pending');
    });
  });

  describe('Admin Authentication', () => {
    it('should initialize not logged in as admin', () => {
      expect(useAppStore.getState().isAdminLoggedIn).toBe(false);
    });

    it('should set admin logged in', () => {
      useAppStore.getState().setAdminLoggedIn(true);
      expect(useAppStore.getState().isAdminLoggedIn).toBe(true);
    });

    it('should logout admin', () => {
      useAppStore.getState().setAdminLoggedIn(true);
      useAppStore.getState().adminLogout();
      expect(useAppStore.getState().isAdminLoggedIn).toBe(false);
    });
  });

  describe('Modal States', () => {
    it('should initialize with closed modals', () => {
      expect(useAppStore.getState().isUploadModalOpen).toBe(false);
      expect(useAppStore.getState().isRequestModalOpen).toBe(false);
    });

    it('should toggle upload modal', () => {
      useAppStore.getState().setUploadModalOpen(true);
      expect(useAppStore.getState().isUploadModalOpen).toBe(true);
      useAppStore.getState().setUploadModalOpen(false);
      expect(useAppStore.getState().isUploadModalOpen).toBe(false);
    });

    it('should toggle request modal', () => {
      useAppStore.getState().setRequestModalOpen(true);
      expect(useAppStore.getState().isRequestModalOpen).toBe(true);
      useAppStore.getState().setRequestModalOpen(false);
      expect(useAppStore.getState().isRequestModalOpen).toBe(false);
    });
  });
});
