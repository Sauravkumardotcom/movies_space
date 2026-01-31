import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { useAppStore } from '../store/useAppStore';

// Integration Tests - End-to-End Workflows
describe('MovieSpace Integration Tests', () => {
  beforeEach(() => {
    localStorage.clear();
    const store = useAppStore.getState();
    store.customMovies = [];
    store.favorites = [];
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe('User Workflow: Add Movie and Watch', () => {
    it('should add movie, persist, retrieve, and watch', () => {
      const store = useAppStore.getState();

      // Step 1: Add custom movie
      const newMovie = {
        title: 'Integration Test Movie',
        description: 'Testing the full workflow',
        src: 'https://commondatastorage.googleapis.com/gtv-videos-library/sample/ForBiggerBlazes.mp4',
        poster: 'https://placehold.co/300x450',
        year: 2024,
        genre: ['Action', 'Drama'],
        rating: 8.5,
      };

      store.addCustomMovie(newMovie);

      // Step 2: Verify it's in state
      expect(store.customMovies.length).toBe(1);
      expect(store.customMovies[0].title).toBe('Integration Test Movie');
      expect(store.customMovies[0].id).toMatch(/custom_\d+/);

      // Step 3: Verify it persists to localStorage
      const stored = localStorage.getItem('moviespace-storage');
      expect(stored).toBeTruthy();
      const parsed = JSON.parse(stored);
      expect(parsed.state.customMovies.length).toBe(1);

      // Step 4: Add to watch history
      store.addToWatchHistory(store.customMovies[0]);
      expect(store.watchHistory.length).toBe(1);
      expect(store.watchHistory[0].watchedAt).toBeDefined();

      // Step 5: Add to favorites
      store.addToFavorites(store.customMovies[0]);
      expect(store.favorites.length).toBe(1);
      expect(store.favorites[0].title).toBe('Integration Test Movie');
    });
  });

  describe('Admin Workflow: Login, Add Movie, Verify', () => {
    it('should handle admin panel workflow', () => {
      const store = useAppStore.getState();

      // Step 1: Admin login
      expect(store.isAdminLoggedIn).toBe(false);
      store.setAdminLoggedIn(true);
      expect(store.isAdminLoggedIn).toBe(true);

      // Step 2: Add multiple movies
      const movies = [
        {
          title: 'Admin Test Movie 1',
          src: 'https://example.com/video1.mp4',
          genre: ['Action'],
        },
        {
          title: 'Admin Test Movie 2',
          src: 'https://example.com/video2.mp4',
          genre: ['Drama'],
        },
      ];

      movies.forEach((movie) => {
        store.addCustomMovie(movie);
      });

      expect(store.customMovies.length).toBe(2);

      // Step 3: Verify persistence
      const stored = JSON.parse(localStorage.getItem('moviespace-storage'));
      expect(stored.state.customMovies.length).toBe(2);

      // Step 4: Admin logout
      store.adminLogout();
      expect(store.isAdminLoggedIn).toBe(false);

      // Step 5: Movies should still exist
      expect(store.customMovies.length).toBe(2);
    });
  });

  describe('Search and Discovery Workflow', () => {
    it('should search and filter movies', () => {
      const store = useAppStore.getState();

      // Add test movies
      const moviesData = [
        { title: 'Action Movie 1', genre: ['Action'], year: 2024 },
        { title: 'Drama Movie 1', genre: ['Drama'], year: 2023 },
        { title: 'Action Drama Mix', genre: ['Action', 'Drama'], year: 2024 },
      ];

      moviesData.forEach((movie) => {
        store.addCustomMovie({
          ...movie,
          src: 'https://example.com/video.mp4',
        });
      });

      // Search by title
      const actionMovies = store.customMovies.filter((m) =>
        m.title.toLowerCase().includes('action')
      );
      expect(actionMovies.length).toBe(2);

      // Filter by genre
      const dramass = store.customMovies.filter((m) =>
        m.genre && m.genre.includes('Drama')
      );
      expect(dramass.length).toBe(2);

      // Filter by year
      const recent = store.customMovies.filter((m) => m.year === 2024);
      expect(recent.length).toBe(2);
    });
  });

  describe('Movie Request Workflow', () => {
    it('should handle complete request flow', () => {
      const store = useAppStore.getState();

      // Step 1: User creates request
      const request = {
        title: 'Requested Movie',
        director: 'Test Director',
        description: 'Please add this movie',
      };

      store.addMovieRequest(request);

      // Step 2: Verify request is tracked
      expect(store.movieRequests.length).toBe(1);
      expect(store.movieRequests[0].status).toBe('pending');
      expect(store.movieRequests[0].id).toBeDefined();

      // Step 3: Verify persistence
      const stored = JSON.parse(localStorage.getItem('moviespace-storage'));
      expect(stored.state.movieRequests.length).toBe(1);

      // Step 4: Create another request
      const request2 = {
        title: 'Another Requested Movie',
        director: 'Another Director',
      };

      store.addMovieRequest(request2);
      expect(store.movieRequests.length).toBe(2);

      // Step 5: Requests are ordered by most recent first
      expect(store.movieRequests[0].title).toBe('Another Requested Movie');
    });
  });

  describe('Theme Management Workflow', () => {
    it('should change and persist theme', () => {
      const store = useAppStore.getState();

      // Initial theme
      expect(store.theme).toBe('dark');

      // Change theme
      store.setTheme('light');
      expect(store.theme).toBe('light');

      // Verify persistence
      const stored = JSON.parse(localStorage.getItem('moviespace-storage'));
      expect(stored.state.theme).toBe('light');

      // Switch back
      store.setTheme('dark');
      expect(store.theme).toBe('dark');
    });
  });

  describe('User Authentication Workflow', () => {
    it('should handle complete auth flow', () => {
      const store = useAppStore.getState();

      // Initial state
      expect(store.isAuthenticated).toBe(false);
      expect(store.user).toBeNull();

      // Login
      const testUser = {
        id: 1,
        name: 'Test User',
        email: 'test@example.com',
      };

      store.setUser(testUser);
      expect(store.isAuthenticated).toBe(true);
      expect(store.user.name).toBe('Test User');

      // Add to favorites while logged in
      const movie = {
        id: 1,
        title: 'Test Movie',
        src: 'url',
      };
      store.addToFavorites(movie);
      expect(store.favorites.length).toBe(1);

      // Logout
      store.logout();
      expect(store.isAuthenticated).toBe(false);
      expect(store.user).toBeNull();

      // Favorites persist even after logout
      expect(store.favorites.length).toBe(1);
    });
  });

  describe('Concurrent Operations Workflow', () => {
    it('should handle multiple simultaneous state updates', () => {
      const store = useAppStore.getState();

      // Add multiple movies
      const movies = Array.from({ length: 5 }, (_, i) => ({
        title: `Movie ${i + 1}`,
        src: `url${i}`,
      }));

      movies.forEach((m) => store.addCustomMovie(m));
      expect(store.customMovies.length).toBe(5);

      // Add multiple to favorites
      movies.forEach((m) => {
        store.addToFavorites(store.customMovies[0]);
      });
      // Should not duplicate
      expect(store.favorites.length).toBe(1);

      // Add to watch history
      movies.forEach(() => {
        store.addToWatchHistory(store.customMovies[0]);
      });
      expect(store.watchHistory.length).toBe(5);
    });
  });

  describe('Data Consistency Workflow', () => {
    it('should maintain consistency across operations', () => {
      const store = useAppStore.getState();

      // Add movie
      const movie = {
        title: 'Consistency Test',
        src: 'url',
      };
      store.addCustomMovie(movie);
      const movieId = store.customMovies[0].id;

      // Add to favorites
      store.addToFavorites(store.customMovies[0]);

      // Add to watch history
      store.addToWatchHistory(store.customMovies[0]);

      // Remove movie
      store.removeCustomMovie(movieId);

      // Movie should be gone from custom movies
      expect(store.customMovies.length).toBe(0);

      // But still in favorites (loose references)
      expect(store.favorites.length).toBe(1);

      // And still in watch history
      expect(store.watchHistory.length).toBe(1);

      // All data persisted
      const stored = JSON.parse(localStorage.getItem('moviespace-storage'));
      expect(stored.state.customMovies.length).toBe(0);
      expect(stored.state.favorites.length).toBe(1);
      expect(stored.state.watchHistory.length).toBe(1);
    });
  });

  describe('Performance Workflow', () => {
    it('should handle large number of movies efficiently', () => {
      const store = useAppStore.getState();

      const startTime = performance.now();

      // Add 100 movies
      for (let i = 0; i < 100; i++) {
        store.addCustomMovie({
          title: `Movie ${i}`,
          src: `url${i}`,
        });
      }

      const endTime = performance.now();
      const duration = endTime - startTime;

      expect(store.customMovies.length).toBe(100);
      // Should complete in less than 1 second
      expect(duration).toBeLessThan(1000);
    });
  });

  describe('Error Recovery Workflow', () => {
    it('should recover from invalid operations', () => {
      const store = useAppStore.getState();

      // Add valid movie
      store.addCustomMovie({ title: 'Valid', src: 'url' });
      expect(store.customMovies.length).toBe(1);

      // Try to remove non-existent movie
      store.removeCustomMovie('nonexistent');
      expect(store.customMovies.length).toBe(1);

      // Try to add same to favorites twice
      const movie = store.customMovies[0];
      store.addToFavorites(movie);
      store.addToFavorites(movie);
      expect(store.favorites.length).toBe(1);

      // Try invalid ID operations
      store.removeFromFavorites('invalid');
      expect(store.favorites.length).toBe(1);
    });
  });

  describe('State Persistence Recovery', () => {
    it('should recover state from localStorage after app restart', () => {
      const store = useAppStore.getState();

      // Add data
      store.addCustomMovie({ title: 'Persist Test', src: 'url' });
      store.setTheme('light');
      store.setUser({ id: 1, name: 'Test' });

      // Simulate app restart - verify data still in localStorage
      const stored = localStorage.getItem('moviespace-storage');
      expect(stored).toBeTruthy();

      const parsed = JSON.parse(stored);
      expect(parsed.state.customMovies.length).toBe(1);
      expect(parsed.state.theme).toBe('light');
      expect(parsed.state.user).toBeTruthy();
    });
  });
});
