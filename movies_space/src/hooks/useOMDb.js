/**
 * useOMDb - Custom hook for OMDb API integration
 * Handles loading, error, and data states for movie searches and details
 */

import { useState, useCallback, useRef } from 'react';
import { searchMovies, fetchMovieById } from '../services/omdbService';

export const useOMDb = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [totalResults, setTotalResults] = useState(0);
  const [currentMovie, setCurrentMovie] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const abortControllerRef = useRef(null);

  /**
   * Search for movies by title
   */
  const search = useCallback(async (title, options = {}) => {
    // Cancel previous request if still pending
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Reset state
    setLoading(true);
    setError(null);
    setSearchResults([]);
    setTotalResults(0);

    try {
      const { results, totalResults: total, error: searchError } = await searchMovies(title, options);

      if (searchError) {
        setError(searchError);
        setSearchResults([]);
        setTotalResults(0);
      } else {
        setSearchResults(results);
        setTotalResults(total);
      }
    } catch (err) {
      setError(err.message || 'An error occurred while searching');
      setSearchResults([]);
      setTotalResults(0);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Fetch movie details by IMDb ID
   */
  const fetchDetails = useCallback(async (imdbID) => {
    setLoading(true);
    setError(null);
    setCurrentMovie(null);

    try {
      const movie = await fetchMovieById(imdbID);
      setCurrentMovie(movie);
    } catch (err) {
      setError(err.message || 'An error occurred while fetching movie details');
      setCurrentMovie(null);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Clear search results
   */
  const clearSearch = useCallback(() => {
    setSearchResults([]);
    setTotalResults(0);
    setError(null);
  }, []);

  /**
   * Clear current movie
   */
  const clearCurrentMovie = useCallback(() => {
    setCurrentMovie(null);
    setError(null);
  }, []);

  /**
   * Reset all state
   */
  const reset = useCallback(() => {
    setSearchResults([]);
    setTotalResults(0);
    setCurrentMovie(null);
    setLoading(false);
    setError(null);
  }, []);

  return {
    // State
    searchResults,
    totalResults,
    currentMovie,
    loading,
    error,

    // Methods
    search,
    fetchDetails,
    clearSearch,
    clearCurrentMovie,
    reset
  };
};

export default useOMDb;
