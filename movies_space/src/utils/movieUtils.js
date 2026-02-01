/**
 * OMDb Movie Utilities
 * Helper functions for data formatting, validation, and transformations
 */

/**
 * Format movie title for display (truncate if too long)
 */
export const formatTitle = (title, maxLength = 50) => {
  if (title.length > maxLength) {
    return title.substring(0, maxLength) + '...';
  }
  return title;
};

/**
 * Format year as range or single year
 */
export const formatYear = (year) => {
  if (!year || year === 'N/A') return 'Unknown';
  return year;
};

/**
 * Format rating with validation
 */
export const formatRating = (rating) => {
  if (!rating || rating === 'N/A') return 'N/A';
  const parsed = parseFloat(rating);
  if (isNaN(parsed)) return 'N/A';
  return parsed.toFixed(1);
};

/**
 * Format actors list
 */
export const formatActors = (actors, limit = 5) => {
  if (!Array.isArray(actors) || actors.length === 0) return [];
  return actors.slice(0, limit);
};

/**
 * Format genres list
 */
export const formatGenres = (genres) => {
  if (!Array.isArray(genres)) return [];
  return genres.filter(g => g && g !== 'N/A');
};

/**
 * Validate IMDb ID format
 */
export const isValidIMDbID = (id) => {
  return /^tt\d{7,8}$/.test(id);
};

/**
 * Validate search query
 */
export const isValidSearchQuery = (query) => {
  if (!query || typeof query !== 'string') return false;
  const trimmed = query.trim();
  return trimmed.length >= 1 && trimmed.length <= 255;
};

/**
 * Clean search query
 */
export const cleanSearchQuery = (query) => {
  return query
    .trim()
    .replace(/\s+/g, ' ')
    .substring(0, 255);
};

/**
 * Get color for rating badge
 */
export const getRatingColor = (rating) => {
  const parsed = parseFloat(rating);
  if (parsed >= 8) return 'text-green-400';
  if (parsed >= 7) return 'text-yellow-400';
  if (parsed >= 5) return 'text-orange-400';
  return 'text-red-400';
};

/**
 * Get background color for rating badge
 */
export const getRatingBgColor = (rating) => {
  const parsed = parseFloat(rating);
  if (parsed >= 8) return 'bg-green-900/30';
  if (parsed >= 7) return 'bg-yellow-900/30';
  if (parsed >= 5) return 'bg-orange-900/30';
  return 'bg-red-900/30';
};

/**
 * Compare two movies by a property
 */
export const compareMovies = (a, b, property = 'title') => {
  const aVal = a[property];
  const bVal = b[property];

  if (aVal < bVal) return -1;
  if (aVal > bVal) return 1;
  return 0;
};

/**
 * Group movies by a property
 */
export const groupMoviesBy = (movies, property) => {
  return movies.reduce((acc, movie) => {
    const key = movie[property] || 'N/A';
    if (!acc[key]) acc[key] = [];
    acc[key].push(movie);
    return acc;
  }, {});
};

/**
 * Filter movies by multiple criteria
 */
export const filterMoviesByCriteria = (movies, criteria) => {
  return movies.filter(movie => {
    // Filter by type
    if (criteria.type && criteria.type !== 'all' && movie.type !== criteria.type) {
      return false;
    }

    // Filter by year range
    if (criteria.yearMin && criteria.yearMin > 0) {
      const movieYear = parseInt(movie.year);
      if (movieYear < criteria.yearMin) return false;
    }
    if (criteria.yearMax && criteria.yearMax > 0) {
      const movieYear = parseInt(movie.year);
      if (movieYear > criteria.yearMax) return false;
    }

    // Filter by minimum rating
    if (criteria.minRating && criteria.minRating > 0) {
      const movieRating = parseFloat(movie.imdbRating);
      if (movieRating < criteria.minRating) return false;
    }

    // Filter by genres
    if (criteria.genres && criteria.genres.length > 0) {
      const hasGenre = criteria.genres.some(g => 
        movie.genre && movie.genre.some(mg => mg.toLowerCase().includes(g.toLowerCase()))
      );
      if (!hasGenre) return false;
    }

    return true;
  });
};

/**
 * Sort movies by criteria
 */
export const sortMovies = (movies, sortBy = 'relevance') => {
  const sorted = [...movies];

  if (sortBy === 'year') {
    return sorted.sort((a, b) => {
      const yearA = parseInt(a.year) || 0;
      const yearB = parseInt(b.year) || 0;
      return yearB - yearA; // Newest first
    });
  }

  if (sortBy === 'rating') {
    return sorted.sort((a, b) => {
      const ratingA = parseFloat(a.imdbRating) || 0;
      const ratingB = parseFloat(b.imdbRating) || 0;
      return ratingB - ratingA; // Highest first
    });
  }

  if (sortBy === 'title') {
    return sorted.sort((a, b) => {
      return a.title.localeCompare(b.title);
    });
  }

  return sorted; // Default: relevance (as provided)
};

/**
 * Remove duplicates from movies array
 */
export const removeDuplicateMovies = (movies) => {
  const seen = new Set();
  return movies.filter(movie => {
    if (seen.has(movie.id)) {
      return false;
    }
    seen.add(movie.id);
    return true;
  });
};

/**
 * Get unique genres from movies
 */
export const getUniqueGenres = (movies) => {
  const genres = new Set();
  movies.forEach(movie => {
    if (Array.isArray(movie.genre)) {
      movie.genre.forEach(g => genres.add(g));
    }
  });
  return Array.from(genres).sort();
};

/**
 * Get year range from movies
 */
export const getYearRange = (movies) => {
  if (movies.length === 0) return { min: 0, max: 0 };

  const years = movies
    .map(m => parseInt(m.year))
    .filter(y => !isNaN(y))
    .sort((a, b) => a - b);

  return {
    min: years[0] || 0,
    max: years[years.length - 1] || 0
  };
};

/**
 * Export all utilities as object
 */
export default {
  formatTitle,
  formatYear,
  formatRating,
  formatActors,
  formatGenres,
  isValidIMDbID,
  isValidSearchQuery,
  cleanSearchQuery,
  getRatingColor,
  getRatingBgColor,
  compareMovies,
  groupMoviesBy,
  filterMoviesByCriteria,
  sortMovies,
  removeDuplicateMovies,
  getUniqueGenres,
  getYearRange
};
