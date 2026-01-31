import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAppStore = create(
  persist(
    (set) => ({
  // Auth state
  user: null,
  isAuthenticated: false,
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  logout: () => set({ user: null, isAuthenticated: false }),

  // Theme state
  theme: 'dark',
  setTheme: (theme) => set({ theme }),

  // Video player state
  currentVideo: null,
  currentTime: 0,
  watchHistory: [],
  setCurrentVideo: (video) => set({ currentVideo: video }),
  setCurrentTime: (time) => set({ currentTime: time }),
  addToWatchHistory: (video) => set((state) => ({
    watchHistory: [{ ...video, watchedAt: Date.now() }, ...state.watchHistory].slice(0, 100),
  })),

  // Favorites/Watchlist
  favorites: [],
  addToFavorites: (video) => set((state) => ({
    favorites: state.favorites.find((v) => v.id === video.id)
      ? state.favorites
      : [...state.favorites, video],
  })),
  removeFromFavorites: (videoId) => set((state) => ({
    favorites: state.favorites.filter((v) => v.id !== videoId),
  })),

  // Search state
  searchQuery: '',
  setSearchQuery: (query) => set({ searchQuery: query }),

  // Modal states
  isUploadModalOpen: false,
  setUploadModalOpen: (open) => set({ isUploadModalOpen: open }),

  isRequestModalOpen: false,
  setRequestModalOpen: (open) => set({ isRequestModalOpen: open }),

  // Movie requests
  movieRequests: [],
  addMovieRequest: (request) => set((state) => ({
    movieRequests: [
      { ...request, id: Date.now(), requestedAt: new Date(), status: 'pending' },
      ...state.movieRequests,
    ],
  })),

  // Uploaded videos
  uploadedVideos: [],
  addUploadedVideo: (video) => set((state) => ({
    uploadedVideos: [video, ...state.uploadedVideos],
  })),

  // Admin authentication
  isAdminLoggedIn: false,
  setAdminLoggedIn: (loggedIn) => set({ isAdminLoggedIn: loggedIn }),
  adminLogout: () => set({ isAdminLoggedIn: false }),

  // Custom movies (added via admin panel)
  customMovies: [],
  addCustomMovie: (movie) => set((state) => ({
    customMovies: [{ ...movie, id: `custom_${Date.now()}`, addedAt: new Date() }, ...state.customMovies],
  })),
  removeCustomMovie: (movieId) => set((state) => ({
    customMovies: state.customMovies.filter((m) => m.id !== movieId),
  })),
    }),
    {
      name: 'moviespace-storage', // localStorage key
      partialize: (state) => ({
        customMovies: state.customMovies,
        uploadedVideos: state.uploadedVideos,
        favorites: state.favorites,
        watchHistory: state.watchHistory,
        movieRequests: state.movieRequests,
        theme: state.theme,
      }),
    }
  )
);
