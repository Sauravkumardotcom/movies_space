# OMDb Movie Application - Complete Guide

## 📚 Overview

A complete OMDb API movie application built with React, Vite, Tailwind CSS, and Zustand. Features modern UI, advanced search, favorites, watchlist, sorting, filtering, and dark/light mode.

## 🚀 Quick Start

### 1. Setup Environment Variables

Create `.env.local` in the root directory:

```env
VITE_OMDB_API_KEY=fe84a762
VITE_DEBUG_MODE=false
```

**Get Your Free API Key:**
- Visit: https://www.omdbapi.com/apikey.aspx
- Select "Free" tier
- Confirm email
- Use the provided API key

### 2. Start Development Server

```bash
npm run dev
```

Navigate to: `http://localhost:5173/movies`

## 📁 Project Structure

```
src/
├── services/
│   └── omdbService.js          # Centralized API integration
├── hooks/
│   └── useOMDb.js              # Custom hook for API calls
├── store/
│   └── useMovieStore.js        # Zustand store (favorites, watchlist, theme)
├── Components/
│   ├── MovieCard.jsx           # Movie card display
│   ├── SearchBar.jsx           # Search with debounce
│   ├── MovieDetailModal.jsx    # Movie details modal
│   └── SkeletonLoader.jsx      # Loading skeletons
├── pages/
│   └── OMDbMoviesPage.jsx      # Main page component
├── utils/
│   └── movieUtils.js           # Helper functions
└── App.jsx                     # Routes configuration
```

## 🎯 Key Features

### 1. **Search with Debounce**
- Real-time search as you type
- 500ms debounce to prevent API abuse
- Recently searched queries stored
- Enter key for manual search

### 2. **Advanced Filtering**
- Filter by type: Movies, Series, Episodes
- Filter by year range
- Filter by minimum rating
- Filter by genres

### 3. **Sorting Options**
- By Relevance (default)
- By Year (newest first)
- By Rating (highest first)

### 4. **Favorites & Watchlist**
- Save unlimited favorites
- Create watchlist for later
- LocalStorage persistence
- Quick access tabs

### 5. **Dark/Light Mode**
- Toggle theme
- Persistent preference
- Smooth transitions

### 6. **Movie Details**
- Full movie information
- Ratings from multiple sources
- Cast, director, writer details
- Plot summary
- Release dates and awards

## 📝 API Reference

### `omdbService.js`

#### `searchMovies(title, options)`
```javascript
// Search for movies
const { results, totalResults } = await searchMovies('Inception', {
  page: 1,
  type: 'movie',  // 'movie', 'series', 'episode'
  year: 2010
});
```

#### `fetchMovieById(imdbID)`
```javascript
// Get detailed movie information
const movie = await fetchMovieById('tt1375666'); // Inception
```

#### `fetchMultipleMovies(imdbIDs)`
```javascript
// Fetch multiple movies (for favorites/watchlist)
const movies = await fetchMultipleMovies(['tt1375666', 'tt0111161']);
```

### `useOMDb.js` Hook

```javascript
const { 
  searchResults,      // Array of search results
  totalResults,       // Total results count
  currentMovie,       // Currently viewed movie
  loading,            // Loading state
  error,              // Error message
  search,             // Search function
  fetchDetails,       // Fetch movie details
  clearSearch,        // Clear results
  clearCurrentMovie   // Clear current movie
} = useOMDb();

// Usage
await search('Inception');
await fetchDetails('tt1375666');
```

### `useMovieStore.js` (Zustand)

```javascript
const {
  // Theme
  isDarkMode,
  toggleDarkMode,

  // Favorites
  favorites,
  addToFavorites,
  isFavorite,

  // Watchlist
  watchlist,
  addToWatchlist,
  isInWatchlist,

  // Recently Searched
  recentlySearched,
  addToRecentlySearched,

  // Sorting & Filtering
  sortBy,
  setSortBy,
  filterType,
  setFilterType,

  // Helpers
  getProcessedMovies,
  getSortedMovies,
  getFilteredMovies
} = useMovieStore();
```

## 🎨 Component API

### MovieCard
```jsx
<MovieCard 
  movie={movieObject}
  onSelect={(movie) => console.log(movie)}
  isLoading={false}
/>
```

### SearchBar
```jsx
<SearchBar
  onSearch={(query) => console.log(query)}
  placeholder="Search movies..."
  debounceDelay={500}
  isLoading={false}
/>
```

### MovieDetailModal
```jsx
<MovieDetailModal
  movie={movieObject}
  isOpen={true}
  onClose={() => {}}
  isLoading={false}
  onAddToFavorites={(movie) => {}}
  onAddToWatchlist={(movie) => {}}
  isFavorite={false}
  isInWatchlist={false}
/>
```

### SkeletonLoader Components
```jsx
import {
  SkeletonCard,           // Single card skeleton
  SkeletonGrid,           // Grid of skeletons
  SkeletonMovieDetails,   // Movie details skeleton
  SkeletonSearchResults,  // Search results skeleton
  SkeletonSearchBar       // Search bar skeleton
} from '../Components/SkeletonLoader';

// Usage
<SkeletonGrid count={10} />
```

## 🛠️ Utility Functions

### Movie Formatting
```javascript
import {
  formatTitle,        // Truncate title
  formatRating,       // Format rating display
  formatActors,       // Format actors list
  formatGenres        // Format genres array
} from '../utils/movieUtils';
```

### Validation
```javascript
import {
  isValidIMDbID,      // Validate IMDb ID format
  isValidSearchQuery,  // Validate search input
  cleanSearchQuery     // Clean/normalize query
} from '../utils/movieUtils';
```

### Filtering & Sorting
```javascript
import {
  filterMoviesByCriteria,  // Advanced filtering
  sortMovies,              // Multiple sort options
  getUniqueGenres,         // Extract unique genres
  getYearRange            // Get min/max years
} from '../utils/movieUtils';
```

## 🔐 Security Best Practices

### ✅ Implemented

1. **API Key Management**
   - Store API key in `.env.local` (not committed)
   - Never expose in frontend code
   - Use environment variables

2. **Rate Limiting**
   - Max 10 requests per second
   - Automatic request throttling
   - Queue-based system

3. **Input Validation**
   - Search query validation
   - IMDb ID format checking
   - Bounds validation for pagination

4. **Error Handling**
   - Graceful error messages
   - No sensitive data exposure
   - Fallback UI states

### ⚠️ Important Security Notes

- **Never** hardcode API keys
- **Never** expose API key in public repositories
- **Always** use `.env.local` for local development
- **Deploy with environment variables** in production
- Consider backend proxy for production (optional but recommended)

## 📊 Data Flow

```
User Input (SearchBar)
    ↓
Debounce (500ms)
    ↓
Validation & Cleaning
    ↓
API Call (omdbService.js)
    ↓
Response Formatting
    ↓
State Update (Zustand Store)
    ↓
UI Render (React Components)
```

## 🧪 Testing

### Local Testing

1. **Search Functionality**
   ```
   - Open /movies
   - Type "Inception"
   - Verify results appear after 500ms
   - Click movie card
   - Verify details modal opens
   ```

2. **Favorites & Watchlist**
   ```
   - Open movie details
   - Click "Favorite" button
   - Navigate to Favorites tab
   - Verify movie appears
   - Refresh page
   - Verify favorite persists
   ```

3. **Dark/Light Mode**
   ```
   - Click theme toggle (☀️/🌙)
   - Verify all colors update
   - Refresh page
   - Verify preference persists
   ```

4. **Recently Searched**
   ```
   - Search multiple movies
   - Go to "Recent" tab
   - Verify searches appear in reverse order
   - Click recent search
   - Verify results reload
   ```

## 🐛 Troubleshooting

### Issue: API Key Not Working
**Solution:** 
- Verify API key in `.env.local`
- Check API key is for free tier
- Restart dev server after changing `.env`

### Issue: No Search Results
**Solution:**
- Check exact spelling
- Try searching IMDb directly
- Verify API response in browser DevTools
- Check rate limiting (max 10/sec)

### Issue: Movies Not Saving to Favorites
**Solution:**
- Check browser localStorage is enabled
- Open DevTools → Application → LocalStorage
- Verify `omdb-movie-store` key exists
- Clear storage and try again

### Issue: Slow Performance
**Solution:**
- Reduce grid columns (mobile-first)
- Increase debounce delay
- Use production build: `npm run build`
- Check network tab in DevTools

## 📈 Performance Tips

### For Large Result Sets
```javascript
// Use pagination
const { results, totalResults } = await searchMovies('movie', { page: 1 });

// Load only visible items (lazy loading)
// Use virtual scrolling for very large lists
```

### Optimize Search
```javascript
// Use debounce (already implemented: 500ms)
// Minimize re-renders with useMemo
// Use React.memo for MovieCard
```

### Reduce Bundle Size
```javascript
// Current split: ~240KB main (after code splitting)
// Already optimized with:
// - Tree-shaking
// - Code splitting
// - Image lazy loading
// - Minimize vendor bundles
```

## 📚 Additional Resources

- **OMDb API Docs:** https://www.omdbapi.com/
- **React Docs:** https://react.dev
- **Zustand Docs:** https://github.com/pmndrs/zustand
- **Tailwind CSS:** https://tailwindcss.com
- **Framer Motion:** https://www.framer.com/motion

## 🎓 Code Examples

### Custom Search Component

```jsx
import { useState, useCallback } from 'react';
import { useOMDb } from '../hooks/useOMDb';
import SearchBar from '../Components/SearchBar';
import MovieCard from '../Components/MovieCard';

function CustomMovieSearch() {
  const { searchResults, loading, search } = useOMDb();
  
  const handleSearch = useCallback((query) => {
    search(query);
  }, [search]);

  return (
    <div>
      <SearchBar onSearch={handleSearch} />
      <div className="grid grid-cols-4 gap-4">
        {searchResults.map(movie => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </div>
  );
}

export default CustomMovieSearch;
```

### Using Store for State Management

```jsx
import { useMovieStore } from '../store/useMovieStore';

function FavoritesList() {
  const { favorites, removeFromFavorites } = useMovieStore();

  return (
    <div>
      {favorites.map(movie => (
        <div key={movie.id}>
          <h3>{movie.title}</h3>
          <button onClick={() => removeFromFavorites(movie.id)}>
            Remove
          </button>
        </div>
      ))}
    </div>
  );
}

export default FavoritesList;
```

## 📝 Notes

- API allows ~1000 requests/day on free tier
- Each search shows ~10 results per page
- Images cached for performance
- LocalStorage stores up to ~5MB per domain

## 🤝 Contributing

To extend this application:

1. Add new components to `src/Components/`
2. Create new pages in `src/pages/`
3. Add hooks in `src/hooks/`
4. Extend Zustand store as needed
5. Update routing in `App.jsx`

## 📄 License

Part of MovieSpace project - Educational use

---

**Last Updated:** 2025
**Version:** 1.0.0
**Status:** Production Ready
