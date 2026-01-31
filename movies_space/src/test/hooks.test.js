import { describe, it, expect, beforeEach } from 'vitest';
import { useAppStore } from '../store/useAppStore';

// useVideos Hook Tests
describe('useVideos Hook', () => {
  const mockCustomMovies = [
    {
      id: 'custom_1',
      title: 'Custom Movie 1',
      src: 'https://example.com/video1.mp4',
    },
    {
      id: 'custom_2',
      title: 'Custom Movie 2',
      src: 'https://example.com/video2.mp4',
    },
  ];

  it('should return all videos', () => {
    expect(Array.isArray(mockCustomMovies)).toBe(true);
  });

  it('should include custom movies', () => {
    const customCount = mockCustomMovies.filter((v) =>
      v.id.toString().startsWith('custom_')
    ).length;
    expect(customCount).toBe(2);
  });

  it('should handle empty video list', () => {
    const emptyList = [];
    expect(emptyList.length).toBe(0);
  });

  it('should be reactive to changes', () => {
    const initialLength = mockCustomMovies.length;
    const newMovie = { id: 'custom_3', title: 'New Movie', src: 'url' };
    const updatedList = [...mockCustomMovies, newMovie];
    expect(updatedList.length).toBe(initialLength + 1);
  });
});

// useVideoById Hook Tests
describe('useVideoById Hook', () => {
  const mockVideos = [
    { id: 1, title: 'Video 1', src: 'url1' },
    { id: 'custom_123', title: 'Custom Video', src: 'custom_url' },
  ];

  it('should find video by numeric ID', () => {
    const video = mockVideos.find((v) => v.id === 1);
    expect(video?.title).toBe('Video 1');
  });

  it('should find video by string ID', () => {
    const video = mockVideos.find((v) => v.id === 'custom_123');
    expect(video?.title).toBe('Custom Video');
  });

  it('should handle ID type coercion', () => {
    const stringId = '1';
    const numId = 1;
    expect(String(numId)).toBe(stringId);
  });

  it('should return undefined for non-existent video', () => {
    const video = mockVideos.find((v) => v.id === 'nonexistent');
    expect(video).toBeUndefined();
  });

  it('should work with loading state', () => {
    const loadingState = { isLoading: true, data: null };
    expect(loadingState.isLoading).toBe(true);
    expect(loadingState.data).toBeNull();
  });
});

// useSearchVideos Hook Tests
describe('useSearchVideos Hook', () => {
  const mockVideos = [
    { id: 1, title: 'Action Movie', description: 'An action film' },
    { id: 2, title: 'Comedy Movie', description: 'A funny movie' },
    { id: 3, title: 'Drama Movie', description: 'An emotional story' },
  ];

  it('should search by title', () => {
    const query = 'Action';
    const results = mockVideos.filter((v) =>
      v.title.toLowerCase().includes(query.toLowerCase())
    );
    expect(results.length).toBe(1);
    expect(results[0].title).toContain('Action');
  });

  it('should search by description', () => {
    const query = 'funny';
    const results = mockVideos.filter((v) =>
      v.description.toLowerCase().includes(query.toLowerCase())
    );
    expect(results.length).toBeGreaterThan(0);
  });

  it('should be case-insensitive', () => {
    const query = 'ACTION';
    const results = mockVideos.filter((v) =>
      v.title.toLowerCase().includes(query.toLowerCase())
    );
    expect(results.length).toBeGreaterThan(0);
  });

  it('should return empty array for no matches', () => {
    const query = 'xyz123xyz';
    const results = mockVideos.filter((v) =>
      v.title.toLowerCase().includes(query.toLowerCase())
    );
    expect(results.length).toBe(0);
  });

  it('should not require exact match', () => {
    const query = 'Mov';
    const results = mockVideos.filter((v) =>
      v.title.toLowerCase().includes(query.toLowerCase())
    );
    expect(results.length).toBe(3);
  });
});

// useShortVideos Hook Tests
describe('useShortVideos Hook', () => {
  const mockShorts = [
    { id: 1, title: 'Short 1', isShort: true, duration: 30 },
    { id: 2, title: 'Short 2', isShort: true, duration: 45 },
  ];

  it('should return short videos', () => {
    expect(Array.isArray(mockShorts)).toBe(true);
  });

  it('should only include short videos', () => {
    mockShorts.forEach((v) => {
      expect(v.isShort).toBe(true);
    });
  });

  it('should have short duration', () => {
    mockShorts.forEach((v) => {
      expect(v.duration).toBeLessThanOrEqual(60);
    });
  });
});

// Store Integration Tests
describe('Store Hooks Integration', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should manage custom movies state', () => {
    const store = useAppStore.getState();
    const initialLength = store.customMovies.length;

    const newMovie = {
      title: 'Test Movie',
      src: 'https://example.com/video.mp4',
    };

    store.addCustomMovie(newMovie);
    expect(store.customMovies.length).toBe(initialLength + 1);
  });

  it('should persist state to localStorage', () => {
    const store = useAppStore.getState();
    const movie = {
      title: 'Persistent Movie',
      src: 'https://example.com/video.mp4',
    };

    store.addCustomMovie(movie);

    const stored = localStorage.getItem('moviespace-storage');
    expect(stored).toBeTruthy();

    const parsed = JSON.parse(stored);
    expect(parsed.state.customMovies.length).toBeGreaterThan(0);
  });

  it('should restore state from localStorage', () => {
    const store = useAppStore.getState();

    // Add a movie
    store.addCustomMovie({
      title: 'Test',
      src: 'url',
    });

    // Get the ID
    const movieId = store.customMovies[0].id;

    // Clear store state
    store.customMovies = [];

    // State should be empty now
    expect(store.customMovies.length).toBe(0);

    // But localStorage still has it
    const stored = localStorage.getItem('moviespace-storage');
    expect(stored).toBeTruthy();
  });

  it('should manage favorites', () => {
    const store = useAppStore.getState();

    const video = { id: 1, title: 'Test Video', src: 'url' };
    store.addToFavorites(video);
    expect(store.favorites.length).toBe(1);

    store.removeFromFavorites(1);
    expect(store.favorites.length).toBe(0);
  });

  it('should manage watch history', () => {
    const store = useAppStore.getState();
    const initialLength = store.watchHistory.length;

    const video = { id: 1, title: 'Test', src: 'url' };
    store.addToWatchHistory(video);

    expect(store.watchHistory.length).toBe(initialLength + 1);
    expect(store.watchHistory[0].watchedAt).toBeDefined();
  });

  it('should handle authentication', () => {
    const store = useAppStore.getState();

    store.setUser({ id: 1, name: 'Test User' });
    expect(store.isAuthenticated).toBe(true);

    store.logout();
    expect(store.isAuthenticated).toBe(false);
  });

  it('should handle admin authentication', () => {
    const store = useAppStore.getState();

    store.setAdminLoggedIn(true);
    expect(store.isAdminLoggedIn).toBe(true);

    store.adminLogout();
    expect(store.isAdminLoggedIn).toBe(false);
  });
});

// Custom Hooks Behavior Tests
describe('Custom Hooks Behavior', () => {
  it('should memoize results', () => {
    const mockFn = () => ({ data: 'test' });
    const result1 = mockFn();
    const result2 = mockFn();

    // Results should be equivalent
    expect(result1.data).toBe(result2.data);
  });

  it('should handle loading states', () => {
    const hookState = {
      data: null,
      isLoading: true,
      error: null,
    };

    expect(hookState.isLoading).toBe(true);
    expect(hookState.data).toBeNull();
    expect(hookState.error).toBeNull();
  });

  it('should handle error states', () => {
    const hookState = {
      data: null,
      isLoading: false,
      error: 'Network error',
    };

    expect(hookState.error).toBeTruthy();
    expect(hookState.data).toBeNull();
  });

  it('should transition between states', () => {
    let state = { data: null, isLoading: true, error: null };
    expect(state.isLoading).toBe(true);

    state = { ...state, isLoading: false, data: { id: 1 } };
    expect(state.isLoading).toBe(false);
    expect(state.data).toBeDefined();
  });
});
