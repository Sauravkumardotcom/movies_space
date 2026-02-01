/**
 * OMDbMoviesPage - Main page component for OMDb movie search and exploration
 * Mobile-first responsive design with clean header
 * Features: Search with debounce, favorites, watchlist, sorting, filtering
 */

import React, { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SearchBar from '../Components/SearchBar';
import MovieCard from '../Components/MovieCard';
import MovieDetailModal from '../Components/MovieDetailModal';
import { SkeletonGrid } from '../Components/SkeletonLoader';
import useOMDb from '../hooks/useOMDb';
import useMovieStore from '../store/useMovieStore';

const OMDbMoviesPage = () => {
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('search'); // 'search', 'favorites', 'watchlist', 'recent'
  const [sortBy, setSortBy] = useState('relevance');
  const [filterType, setFilterType] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);

  // OMDb Hook
  const {
    searchResults,
    totalResults,
    currentMovie,
    loading,
    error,
    search,
    fetchDetails,
    clearSearch
  } = useOMDb();

  // Movie Store
  const {
    isDarkMode,
    toggleDarkMode,
    favorites,
    watchlist,
    recentlySearched,
    addToFavorites,
    addToWatchlist,
    isFavorite,
    isInWatchlist,
    searchQuery,
    setSearchQuery
  } = useMovieStore();

  /**
   * Handle search
   */
  const handleSearch = useCallback((query) => {
    if (query.trim().length > 0) {
      setSearchQuery(query);
      setCurrentPage(1);
      search(query, { page: 1, type: filterType === 'all' ? '' : filterType });
      // Add to recently searched
      useMovieStore.getState().addToRecentlySearched(query);
    } else {
      clearSearch();
      setSearchQuery('');
    }
  }, [search, filterType, clearSearch, setSearchQuery]);

  /**
   * Handle movie selection
   */
  const handleSelectMovie = useCallback((movie) => {
    setSelectedMovie(movie);
    setIsDetailOpen(true);
    // Fetch full details
    if (movie.id) {
      fetchDetails(movie.id);
    }
  }, [fetchDetails]);

  /**
   * Handle close modal
   */
  const handleCloseModal = useCallback(() => {
    setIsDetailOpen(false);
    setTimeout(() => setSelectedMovie(null), 300);
  }, []);

  /**
   * Filter and sort results
   */
  const getDisplayedResults = useCallback(() => {
    let results = [...searchResults];

    // Filter by type
    if (filterType !== 'all') {
      results = results.filter((m) => m.type === filterType);
    }

    // Sort
    if (sortBy === 'year') {
      results.sort((a, b) => {
        const yearA = parseInt(a.year) || 0;
        const yearB = parseInt(b.year) || 0;
        return yearB - yearA;
      });
    } else if (sortBy === 'rating') {
      results.sort((a, b) => {
        const ratingA = parseFloat(a.imdbRating) || 0;
        const ratingB = parseFloat(b.imdbRating) || 0;
        return ratingB - ratingA;
      });
    }

    return results;
  }, [searchResults, sortBy, filterType]);

  const displayedResults = getDisplayedResults();

  /**
   * Tab content renderer
   */
  const renderTabContent = () => {
    switch (activeTab) {
      case 'search':
        return (
          <div className="space-y-6">
            {/* Search Input */}
            <SearchBar
              onSearch={handleSearch}
              placeholder="Search movies, series, episodes..."
              isLoading={loading}
            />

            {/* Filters and Sort */}
            {searchQuery && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between bg-gray-800 p-4 rounded-lg"
              >
                <div className="flex gap-4">
                  {/* Type Filter */}
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="bg-gray-900 text-white border border-gray-700 rounded px-3 py-2 text-sm hover:border-cyan-500 focus:outline-none transition-colors"
                  >
                    <option value="all">All Types</option>
                    <option value="movie">Movies</option>
                    <option value="series">Series</option>
                    <option value="episode">Episodes</option>
                  </select>

                  {/* Sort By */}
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-gray-900 text-white border border-gray-700 rounded px-3 py-2 text-sm hover:border-cyan-500 focus:outline-none transition-colors"
                  >
                    <option value="relevance">Relevance</option>
                    <option value="year">Year (Newest First)</option>
                    <option value="rating">Rating (Highest First)</option>
                  </select>
                </div>

                {/* Results Count */}
                <p className="text-gray-400 text-sm">
                  {displayedResults.length > 0
                    ? `Showing ${displayedResults.length} of ${totalResults} results`
                    : 'No results found'}
                </p>
              </motion.div>
            )}

            {/* Error Message */}
            {error && searchQuery && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-900/30 border border-red-700 text-red-400 p-4 rounded-lg"
              >
                ⚠️ {error}
              </motion.div>
            )}

            {/* Loading State */}
            {loading && searchQuery ? (
              <SkeletonGrid count={10} />
            ) : displayedResults.length > 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
              >
                {displayedResults.map((movie) => (
                  <MovieCard
                    key={movie.id}
                    movie={movie}
                    onSelect={handleSelectMovie}
                  />
                ))}
              </motion.div>
            ) : searchQuery ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <p className="text-gray-400 text-lg">
                  🎬 No movies found for "{searchQuery}"
                </p>
                <p className="text-gray-500 text-sm mt-2">
                  Try searching with different keywords
                </p>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <p className="text-gray-400 text-lg">
                  🔍 Start searching for movies
                </p>
                {recentlySearched.length > 0 && (
                  <div className="mt-6">
                    <p className="text-gray-500 text-sm mb-3">Recently searched:</p>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {recentlySearched.slice(0, 5).map((query) => (
                        <motion.button
                          key={query}
                          whileHover={{ scale: 1.05 }}
                          onClick={() => handleSearch(query)}
                          className="bg-gray-800 hover:bg-cyan-600 text-white px-3 py-1 rounded-full text-sm transition-colors"
                        >
                          {query}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </div>
        );

      case 'favorites':
        return (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            {favorites.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {favorites.map((movie) => (
                  <MovieCard
                    key={movie.id}
                    movie={movie}
                    onSelect={handleSelectMovie}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-400 text-lg">❤️ No favorites yet</p>
                <p className="text-gray-500 text-sm mt-2">
                  Add movies to your favorites from search results
                </p>
              </div>
            )}
          </motion.div>
        );

      case 'watchlist':
        return (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            {watchlist.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {watchlist.map((movie) => (
                  <MovieCard
                    key={movie.id}
                    movie={movie}
                    onSelect={handleSelectMovie}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-400 text-lg">📋 Watchlist is empty</p>
                <p className="text-gray-500 text-sm mt-2">
                  Add movies to your watchlist to watch later
                </p>
              </div>
            )}
          </motion.div>
        );

      case 'recent':
        return (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-2"
          >
            {recentlySearched.length > 0 ? (
              <div className="space-y-2">
                {recentlySearched.map((query, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ x: 5 }}
                    onClick={() => handleSearch(query)}
                    className="w-full text-left bg-gray-800 hover:bg-gray-700 p-3 rounded-lg transition-colors flex items-center justify-between group"
                  >
                    <span className="text-white">🕐 {query}</span>
                    <span className="text-gray-500 group-hover:text-cyan-400 transition-colors">→</span>
                  </motion.button>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-400">📭 No recent searches</p>
              </div>
            )}
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className={`min-h-screen flex flex-col ${isDarkMode ? 'bg-gray-950 text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* ===== HEADER - MOBILE FIRST ===== */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.3 }}
        className={`sticky top-0 z-40 w-full border-b transition-colors ${
          isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 py-3 sm:py-4">
          {/* Mobile Header (stacked) */}
          <div className="lg:hidden space-y-3">
            {/* Top Row: Logo + Icons */}
            <div className="flex items-center justify-between">
              {/* Logo */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => { setActiveTab('search'); setSearchQuery(''); clearSearch(); }}
              >
                <span className="text-2xl">🎬</span>
                <span className="text-lg font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
                  MovieDB
                </span>
              </motion.div>

              {/* Right Icons */}
              <div className="flex items-center gap-2">
                {/* Favorites Indicator */}
                {favorites.length > 0 && (
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    onClick={() => setActiveTab('favorites')}
                    className="relative p-2 rounded-lg hover:bg-gray-800 transition"
                    title="View favorites"
                  >
                    <span className="text-lg">❤️</span>
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                      {favorites.length > 9 ? '9+' : favorites.length}
                    </span>
                  </motion.button>
                )}

                {/* Theme Toggle */}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  onClick={toggleDarkMode}
                  className={`p-2 rounded-lg transition ${isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}
                  title="Toggle theme"
                >
                  {isDarkMode ? '☀️' : '🌙'}
                </motion.button>
              </div>
            </div>

            {/* Search Bar Full Width */}
            <SearchBar onSearch={handleSearch} isLoading={loading} />

            {/* Tabs - Horizontal Scroll */}
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
              {[
                { key: 'search', label: 'Search', icon: '🔍' },
                { key: 'favorites', label: 'Favorites', icon: '❤️', count: favorites.length },
                { key: 'watchlist', label: 'Watchlist', icon: '📋', count: watchlist.length },
                { key: 'recent', label: 'Recent', icon: '🕐' }
              ].map((tab) => (
                <motion.button
                  key={tab.key}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveTab(tab.key)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition ${
                    activeTab === tab.key
                      ? 'bg-cyan-600 text-white shadow-lg'
                      : isDarkMode
                      ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                      : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                  }`}
                >
                  <span>{tab.icon}</span> {tab.label} {tab.count ? `(${tab.count})` : ''}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Desktop Header (horizontal) */}
          <div className="hidden lg:flex items-center justify-between gap-6">
            {/* Logo */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-2 cursor-pointer flex-shrink-0"
              onClick={() => { setActiveTab('search'); setSearchQuery(''); clearSearch(); }}
            >
              <span className="text-3xl">🎬</span>
              <span className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
                MovieDB
              </span>
            </motion.div>

            {/* Search Bar */}
            <div className="flex-1 max-w-md">
              <SearchBar onSearch={handleSearch} isLoading={loading} />
            </div>

            {/* Tabs */}
            <div className="flex gap-2">
              {[
                { key: 'search', label: 'Search', icon: '🔍' },
                { key: 'favorites', label: 'Favorites', icon: '❤️', count: favorites.length },
                { key: 'watchlist', label: 'Watchlist', icon: '📋', count: watchlist.length },
                { key: 'recent', label: 'Recent', icon: '🕐' }
              ].map((tab) => (
                <motion.button
                  key={tab.key}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveTab(tab.key)}
                  className={`px-4 py-2 rounded-lg font-medium transition ${
                    activeTab === tab.key
                      ? 'bg-cyan-600 text-white shadow-lg'
                      : isDarkMode
                      ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                      : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                  }`}
                >
                  {tab.icon} {tab.label} {tab.count ? `(${tab.count})` : ''}
                </motion.button>
              ))}
            </div>

            {/* Theme Toggle */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              onClick={toggleDarkMode}
              className={`p-2.5 rounded-lg transition ${isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}
              title="Toggle theme"
            >
              {isDarkMode ? '☀️' : '🌙'}
            </motion.button>
          </div>
        </div>
      </motion.header>

      {/* ===== MAIN CONTENT - MOBILE FIRST ===== */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-4 sm:py-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            {renderTabContent()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* ===== MOVIE DETAIL MODAL ===== */}
      <MovieDetailModal
        movie={currentMovie}
        isOpen={isDetailOpen}
        onClose={handleCloseModal}
        isLoading={loading}
        onAddToFavorites={addToFavorites}
        onAddToWatchlist={addToWatchlist}
        isFavorite={selectedMovie ? isFavorite(selectedMovie.id) : false}
        isInWatchlist={selectedMovie ? isInWatchlist(selectedMovie.id) : false}
      />
    </div>
  );
};

export default OMDbMoviesPage;
