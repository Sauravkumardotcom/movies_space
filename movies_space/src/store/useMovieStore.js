/**
 * OMDb Movie Store - Zustand
 * Manages favorites, watchlist, search history, theme, and sorting preferences
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useMovieStore = create(
  persist(
    (set, get) => ({
      // Theme
      isDarkMode: true,
      setDarkMode: (isDark) => set({ isDarkMode: isDark }),
      toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),

      // Favorites
      favorites: [],
      addToFavorites: (movie) =>
        set((state) => {
          const exists = state.favorites.some((m) => m.id === movie.id);
          if (exists) {
            return {
              favorites: state.favorites.filter((m) => m.id !== movie.id)
            };
          }
          return {
            favorites: [...state.favorites, movie]
          };
        }),
      removeFromFavorites: (movieId) =>
        set((state) => ({
          favorites: state.favorites.filter((m) => m.id !== movieId)
        })),
      isFavorite: (movieId) => {
        const state = get();
        return state.favorites.some((m) => m.id === movieId);
      },
      clearFavorites: () => set({ favorites: [] }),

      // Watchlist
      watchlist: [],
      addToWatchlist: (movie) =>
        set((state) => {
          const exists = state.watchlist.some((m) => m.id === movie.id);
          if (exists) {
            return {
              watchlist: state.watchlist.filter((m) => m.id !== movie.id)
            };
          }
          return {
            watchlist: [...state.watchlist, movie]
          };
        }),
      removeFromWatchlist: (movieId) =>
        set((state) => ({
          watchlist: state.watchlist.filter((m) => m.id !== movieId)
        })),
      isInWatchlist: (movieId) => {
        const state = get();
        return state.watchlist.some((m) => m.id === movieId);
      },
      clearWatchlist: () => set({ watchlist: [] }),

      // Recently Searched
      recentlySearched: [],
      addToRecentlySearched: (query) =>
        set((state) => {
          const updated = [
            query,
            ...state.recentlySearched.filter((q) => q !== query)
          ].slice(0, 20); // Keep only 20 most recent
          return { recentlySearched: updated };
        }),
      clearRecentlySearched: () => set({ recentlySearched: [] }),

      // Sort and Filter Preferences
      sortBy: 'relevance', // 'relevance', 'year', 'rating'
      setSortBy: (sort) => set({ sortBy: sort }),

      filterType: 'all', // 'all', 'movie', 'series'
      setFilterType: (type) => set({ filterType: type }),

      // Search Results
      searchResults: [],
      totalResults: 0,
      setSearchResults: (results, total) =>
        set({
          searchResults: results,
          totalResults: total
        }),
      clearSearchResults: () =>
        set({
          searchResults: [],
          totalResults: 0
        }),

      // Current Movie
      currentMovie: null,
      setCurrentMovie: (movie) => set({ currentMovie: movie }),
      clearCurrentMovie: () => set({ currentMovie: null }),

      // Search State
      searchQuery: '',
      setSearchQuery: (query) => set({ searchQuery: query }),

      // Helper function to sort movies
      getSortedMovies: (movies) => {
        const state = get();
        const sorted = [...movies];

        if (state.sortBy === 'year') {
          return sorted.sort((a, b) => {
            const yearA = parseInt(a.year) || 0;
            const yearB = parseInt(b.year) || 0;
            return yearB - yearA; // Newest first
          });
        }

        if (state.sortBy === 'rating') {
          return sorted.sort((a, b) => {
            const ratingA = parseFloat(a.imdbRating) || 0;
            const ratingB = parseFloat(b.imdbRating) || 0;
            return ratingB - ratingA; // Highest rated first
          });
        }

        return sorted; // Default: relevance (as provided)
      },

      // Helper function to filter movies by type
      getFilteredMovies: (movies) => {
        const state = get();
        if (state.filterType === 'all') {
          return movies;
        }
        return movies.filter((m) => m.type === state.filterType);
      },

      // Get sorted and filtered movies
      getProcessedMovies: (movies) => {
        const state = get();
        const filtered = state.getFilteredMovies(movies);
        const sorted = state.getSortedMovies(filtered);
        return sorted;
      },

      // Reset all
      resetAll: () =>
        set({
          isDarkMode: true,
          favorites: [],
          watchlist: [],
          recentlySearched: [],
          sortBy: 'relevance',
          filterType: 'all',
          searchResults: [],
          totalResults: 0,
          currentMovie: null,
          searchQuery: ''
        })
    }),
    {
      name: 'omdb-movie-store',
      version: 1,
      // Optional: use custom storage
      // storage: createJSONStorage(() => sessionStorage),
    }
  )
);

export default useMovieStore;
