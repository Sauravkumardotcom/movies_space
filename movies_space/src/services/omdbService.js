/**
 * OMDb API Service Layer
 * Centralized integration for all OMDb API calls
 * Handles search, details, error handling, and rate limiting
 */

const API_BASE_URL = 'https://www.omdbapi.com/';
const API_KEY = import.meta.env.VITE_OMDB_API_KEY || 'fe84a762';

// Rate limiting: Track API calls to prevent abuse
const requestQueue = [];
const MAX_REQUESTS_PER_SECOND = 10;
let lastRequestTime = 0;

/**
 * Rate limiting helper to prevent API abuse
 */
const rateLimit = async () => {
  const now = Date.now();
  const timeSinceLastRequest = now - lastRequestTime;
  const minTimeBetweenRequests = 1000 / MAX_REQUESTS_PER_SECOND;

  if (timeSinceLastRequest < minTimeBetweenRequests) {
    await new Promise(resolve =>
      setTimeout(resolve, minTimeBetweenRequests - timeSinceLastRequest)
    );
  }
  lastRequestTime = Date.now();
};

/**
 * Format OMDb response data
 * Handles missing values, ratings array, and data transformation
 */
const formatMovieData = (data) => {
  if (!data || data.Response === 'False') {
    return null;
  }

  // Extract ratings array and create a more usable structure
  const ratings = data.Ratings ? data.Ratings.map(r => ({
    source: r.Source,
    value: r.Value
  })) : [];

  return {
    id: data.imdbID,
    title: data.Title || 'N/A',
    year: data.Year || 'N/A',
    rated: data.Rated || 'N/A',
    released: data.Released || 'N/A',
    runtime: data.Runtime || 'N/A',
    genre: data.Genre ? data.Genre.split(', ') : [],
    director: data.Director || 'N/A',
    writer: data.Writer || 'N/A',
    actors: data.Actors ? data.Actors.split(', ') : [],
    plot: data.Plot || 'N/A',
    language: data.Language || 'N/A',
    country: data.Country || 'N/A',
    awards: data.Awards || 'N/A',
    poster: data.Poster && data.Poster !== 'N/A' 
      ? data.Poster 
      : 'https://via.placeholder.com/300x450?text=No+Poster',
    ratings: ratings,
    imdbRating: parseFloat(data.imdbRating) || 0,
    imdbVotes: data.imdbVotes || '0',
    metascore: data.Metascore ? parseInt(data.Metascore) : null,
    type: data.Type || 'movie',
    dvdRelease: data.DVD || 'N/A',
    boxOffice: data.BoxOffice || 'N/A',
    production: data.Production || 'N/A',
    website: data.Website || 'N/A'
  };
};

/**
 * Fetch single movie by IMDb ID
 * @param {string} imdbID - The IMDb ID of the movie
 * @returns {Promise<Object>} Formatted movie data
 */
export const fetchMovieById = async (imdbID) => {
  if (!imdbID || typeof imdbID !== 'string') {
    throw new Error('Invalid IMDb ID provided');
  }

  try {
    await rateLimit();

    const response = await fetch(
      `${API_BASE_URL}?apikey=${API_KEY}&i=${imdbID}&plot=full`,
      { method: 'GET' }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (data.Response === 'False') {
      throw new Error(data.Error || 'Movie not found');
    }

    return formatMovieData(data);
  } catch (error) {
    console.error('Error fetching movie by ID:', error);
    throw new Error(`Failed to fetch movie details: ${error.message}`);
  }
};

/**
 * Search movies by title
 * @param {string} title - The movie title to search
 * @param {Object} options - Additional options
 * @param {number} options.page - Results page (1-100)
 * @param {string} options.type - Type filter: 'movie', 'series', 'episode'
 * @param {number} options.year - Year filter
 * @returns {Promise<Object>} { results: Array<Movie>, totalResults: number }
 */
export const searchMovies = async (title, options = {}) => {
  if (!title || typeof title !== 'string' || title.trim().length === 0) {
    throw new Error('Search title is required');
  }

  const { page = 1, type = '', year = '' } = options;

  // Validate page number
  if (page < 1 || page > 100) {
    throw new Error('Page number must be between 1 and 100');
  }

  try {
    await rateLimit();

    let url = `${API_BASE_URL}?apikey=${API_KEY}&s=${encodeURIComponent(title.trim())}&page=${page}`;

    if (type && ['movie', 'series', 'episode'].includes(type)) {
      url += `&type=${type}`;
    }

    if (year && !isNaN(year)) {
      url += `&y=${year}`;
    }

    const response = await fetch(url, { method: 'GET' });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (data.Response === 'False') {
      // Return empty results instead of throwing error
      return {
        results: [],
        totalResults: 0,
        error: data.Error || 'No results found'
      };
    }

    const results = (data.Search || []).map(movie => ({
      id: movie.imdbID,
      title: movie.Title,
      year: movie.Year,
      type: movie.Type,
      poster: movie.Poster && movie.Poster !== 'N/A' 
        ? movie.Poster 
        : 'https://via.placeholder.com/300x450?text=No+Poster'
    }));

    return {
      results,
      totalResults: parseInt(data.totalResults) || 0,
      error: null
    };
  } catch (error) {
    console.error('Error searching movies:', error);
    throw new Error(`Search failed: ${error.message}`);
  }
};

/**
 * Get multiple movies by their IMDb IDs
 * Useful for fetching favorites or watchlist items
 * @param {Array<string>} imdbIDs - Array of IMDb IDs
 * @returns {Promise<Array<Object>>} Array of formatted movie data
 */
export const fetchMultipleMovies = async (imdbIDs) => {
  if (!Array.isArray(imdbIDs) || imdbIDs.length === 0) {
    return [];
  }

  try {
    const moviePromises = imdbIDs.map(id => fetchMovieById(id));
    const movies = await Promise.all(moviePromises);
    return movies.filter(movie => movie !== null);
  } catch (error) {
    console.error('Error fetching multiple movies:', error);
    throw new Error(`Failed to fetch multiple movies: ${error.message}`);
  }
};

/**
 * Validate API key is set
 * @returns {boolean} True if API key exists
 */
export const isApiKeyValid = () => {
  return API_KEY && API_KEY !== 'fe84a762'; // Check if it's not the default key
};

/**
 * Get API key status (for debugging)
 * @returns {Object} API configuration status
 */
export const getApiStatus = () => {
  return {
    baseUrl: API_BASE_URL,
    hasApiKey: !!API_KEY,
    isProduction: import.meta.env.PROD,
    environment: import.meta.env.MODE
  };
};

export default {
  fetchMovieById,
  searchMovies,
  fetchMultipleMovies,
  isApiKeyValid,
  getApiStatus
};
