/**
 * YouTube Trailer Service
 * Fetches official trailer links for movies
 * Uses YouTube search without requiring API key
 */

/**
 * Search for movie trailer on YouTube
 * Returns YouTube search URL for user to find trailers
 * @param {string} movieTitle - Movie title
 * @param {string} year - Release year (optional)
 * @returns {string} YouTube search URL
 */
export const getYouTubeTrailerSearch = (movieTitle, year = '') => {
  const query = year 
    ? `${movieTitle} ${year} official trailer` 
    : `${movieTitle} official trailer`;
  
  const encodedQuery = encodeURIComponent(query);
  return `https://www.youtube.com/results?search_query=${encodedQuery}`;
};

/**
 * Build embeddable YouTube trailer URL (requires manual search or API)
 * This is a fallback method that opens search
 * @param {string} movieTitle - Movie title
 * @returns {string} URL to open in new window
 */
export const openYouTubeTrailerSearch = (movieTitle, year = '') => {
  const url = getYouTubeTrailerSearch(movieTitle, year);
  window.open(url, '_blank', 'noopener,noreferrer');
};

/**
 * Get IMDb trailer link if available
 * @param {string} imdbID - IMDb ID of the movie
 * @returns {string} IMDb trailer URL
 */
export const getIMDbTrailerLink = (imdbID) => {
  if (!imdbID) return null;
  return `https://www.imdb.com/title/${imdbID}/videogallery/`;
};

export default {
  getYouTubeTrailerSearch,
  openYouTubeTrailerSearch,
  getIMDbTrailerLink
};
