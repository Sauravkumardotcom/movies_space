/**
 * SearchBar Component - MOBILE FIRST
 * Efficient search input with debounce, responsive touch-friendly
 */

import React, { useState, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';

const SearchBar = ({ 
  onSearch, 
  placeholder = 'Search movies...',
  debounceDelay = 500,
  isLoading = false 
}) => {
  const [query, setQuery] = useState('');
  const [debounceTimer, setDebounceTimer] = useState(null);
  const [isFocused, setIsFocused] = useState(false);

  /**
   * Handle search with debounce
   */
  useEffect(() => {
    // Clear previous timer
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    // Set new timer only if query is not empty
    if (query.trim().length > 0) {
      const timer = setTimeout(() => {
        onSearch?.(query.trim());
      }, debounceDelay);

      setDebounceTimer(timer);
    } else {
      // Clear results if query is empty
      onSearch?.('');
    }

    return () => {
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }
    };
  }, [query, debounceDelay, onSearch, debounceTimer]);

  /**
   * Handle clear button
   */
  const handleClear = useCallback(() => {
    setQuery('');
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }
  }, [debounceTimer]);

  /**
   * Handle input change
   */
  const handleChange = useCallback((e) => {
    setQuery(e.target.value);
  }, []);

  /**
   * Handle key press
   */
  const handleKeyPress = useCallback((e) => {
    if (e.key === 'Enter' && query.trim().length > 0) {
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }
      onSearch?.(query.trim());
    }
  }, [query, debounceTimer, onSearch]);

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full"
    >
      <div className="relative">
        {/* Search Icon - Larger on Mobile */}
        <svg
          className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-5 h-5 sm:w-5 sm:h-5 text-gray-400 dark:text-gray-500 pointer-events-none flex-shrink-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>

        {/* Input Field - Mobile First Sizing */}
        <input
          type="text"
          value={query}
          onChange={handleChange}
          onKeyPress={handleKeyPress}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className="w-full bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white pl-10 sm:pl-12 pr-10 sm:pr-12 py-2.5 sm:py-3 rounded-lg border-2 border-gray-300 dark:border-gray-700 hover:border-cyan-400 dark:hover:border-cyan-500/50 focus:border-cyan-500 focus:outline-none transition-all duration-200 placeholder-gray-500 dark:placeholder-gray-400 text-base sm:text-base disabled:opacity-50"
          disabled={isLoading}
          autoComplete="off"
          spellCheck="false"
        />

        {/* Right Actions Container - Touch Friendly Spacing */}
        <div className="absolute right-1 sm:right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
          {/* Clear Button - Larger touch target */}
          {query.length > 0 && !isLoading && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={handleClear}
              className="p-1.5 sm:p-2 text-gray-400 dark:text-gray-400 hover:text-gray-600 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-all duration-150 active:scale-95"
              title="Clear search"
              aria-label="Clear search"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </motion.button>
          )}

          {/* Loading Indicator */}
          {isLoading && (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              className="p-1.5 sm:p-2 text-cyan-500 flex-shrink-0"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </motion.div>
          )}
        </div>
      </div>

      {/* Search Hints - Mobile Friendly */}
      {query.length === 0 && !isFocused && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm mt-1.5 px-1"
        >
          💡 Start typing to search movies
        </motion.p>
      )}
    </motion.div>
  );
};

export default SearchBar;
