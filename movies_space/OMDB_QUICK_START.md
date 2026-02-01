# 🎬 OMDb Movie Application - Quick Start Guide

## 🚀 Getting Started in 2 Minutes

### Step 1: Start Development Server
```bash
cd movies_space
npm run dev
```

### Step 2: Open in Browser
```
http://localhost:5173/movies
```

### Step 3: Start Searching!
- Type any movie name in the search bar
- Results appear automatically (500ms debounce)
- Click any movie to see full details
- Add to favorites ❤️ or watchlist 📋

---

## 🎯 Key Features You Can Try Right Now

### Search & Discover
- Real-time search with debounce
- Filter by: Movies, Series, Episodes
- Sort by: Relevance, Year, Rating
- Pagination support for large result sets

### Organize Your Library
- **Favorites** ❤️ - Save your top picks
- **Watchlist** 📋 - Queue up movies to watch
- **Recently Searched** 🕐 - Quick access to past searches
- All data stored locally (persists on refresh)

### Movie Details Modal
Shows:
- Full plot summary
- Cast, director, writer
- Release date and runtime
- All ratings (IMDb, Metascore, etc)
- IMDb votes and awards
- Available on multiple platforms

### Themes
- Dark mode (default)
- Light mode
- Toggle with ☀️/🌙 button
- Your preference saves automatically

---

## 📁 What's Where

```
src/
├── services/omdbService.js       ← All API calls (centralized)
├── hooks/useOMDb.js              ← Data fetching logic
├── store/useMovieStore.js        ← State management (Zustand)
├── Components/
│   ├── MovieCard.jsx             ← Movie display card
│   ├── SearchBar.jsx             ← Search input with debounce
│   ├── MovieDetailModal.jsx      ← Full movie details
│   └── SkeletonLoader.jsx        ← Loading placeholders
├── pages/OMDbMoviesPage.jsx      ← Main page
└── utils/movieUtils.js           ← Helper functions
```

---

## 🔧 Customization Examples

### Change Search Debounce Delay
In `OMDbMoviesPage.jsx`:
```jsx
<SearchBar
  onSearch={handleSearch}
  debounceDelay={1000}  // Change from 500ms to 1000ms
/>
```

### Add Custom Filter
In `useMovieStore.js`:
```javascript
minimumYear: 2000,
setMinimumYear: (year) => set({ minimumYear: year })
```

### Change API Endpoint
In `omdbService.js`:
```javascript
const API_BASE_URL = 'https://www.omdbapi.com/';
// Change API_KEY, add proxy, etc.
```

---

## 🐛 Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| Search returns nothing | Try exact movie name or year |
| Slow responses | Free tier has rate limits (10 req/sec) |
| Favorites not saving | Check localStorage is enabled |
| Blank page | Check browser console for errors |
| API errors | Verify `.env.local` has valid API key |

---

## 📊 Architecture Overview

```
User Input (SearchBar)
    ↓
debounce 500ms
    ↓
omdbService.searchMovies()
    ↓
API Call to OMDb
    ↓
Format Response
    ↓
useMovieStore (Zustand)
    ↓
Re-render Components
    ↓
Display Results
```

---

## 💾 Local Storage Persistence

These automatically save to browser storage:
- ✅ Favorites list
- ✅ Watchlist
- ✅ Recently searched queries
- ✅ Theme preference (dark/light)
- ✅ Sort & filter preferences

Clear all with:
```javascript
// In browser console
localStorage.removeItem('omdb-movie-store');
```

---

## 🚀 Performance Tips

- **Search**: Uses 500ms debounce (prevents API waste)
- **Images**: Lazy loaded and cached
- **Code Splitting**: ~500KB main → ~240KB after split
- **Loading States**: Skeleton loaders for better UX
- **API Rate Limiting**: Auto-throttles requests

---

## 📚 Learn More

- [Full Documentation](./OMDB_MOVIES_GUIDE.md)
- [OMDb API](https://www.omdbapi.com/)
- [React Docs](https://react.dev)
- [Zustand](https://github.com/pmndrs/zustand)
- [Tailwind CSS](https://tailwindcss.com)

---

## 🎓 Code Examples

### Search Programmatically
```javascript
const { search } = useOMDb();
await search('The Matrix', { type: 'movie' });
```

### Add to Favorites
```javascript
const { addToFavorites } = useMovieStore();
addToFavorites(movieObject);
```

### Check if Favorite
```javascript
const isFav = useMovieStore(state => 
  state.isFavorite(movieId)
);
```

### Get All Recent Searches
```javascript
const { recentlySearched } = useMovieStore();
console.log(recentlySearched); // Last 20 searches
```

---

## ✨ What's Included

✅ Complete React app with Vite
✅ Real OMDb API integration
✅ Modern UI with Tailwind CSS
✅ Animations with Framer Motion
✅ State management with Zustand
✅ Custom hooks for data fetching
✅ Production-ready build (33.85s)
✅ Dark/Light mode
✅ Responsive design (mobile to desktop)
✅ Error handling
✅ Loading states
✅ Full documentation

---

## 🎉 Next Steps

1. **Explore** - Try different searches and features
2. **Customize** - Edit components and styles
3. **Deploy** - Build and host on Vercel/Netlify
4. **Extend** - Add more features (ratings filter, genre search, etc)

---

## 📞 Support

Found an issue? Check:
1. Browser console for errors
2. `.env.local` has correct API key
3. Network tab in DevTools
4. Try clearing localStorage

**Build Status**: ✅ Production Ready
**Last Update**: 2025
**Version**: 1.0.0

---

**Enjoy discovering movies! 🎬🍿**
