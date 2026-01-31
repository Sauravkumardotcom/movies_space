# 🎬 MovieSpace - Premium Streaming Platform

A modern, production-ready video streaming platform built with **Vite + React**, featuring Netflix-grade UI/UX, advanced video playback, and short-form video capabilities.

## ✨ Features

### Core Streaming Features
- **Advanced Video Player** - Full-featured player with multiple playback controls
  - Play/Pause controls
  - Seek bar with time display
  - Volume control with mute
  - Playback speed adjustment (0.5x - 2x)
  - Theater mode for immersive viewing
  - Fullscreen support
  - Keyboard shortcuts (Space, F, M, Arrow keys)
  - Smooth buffering and preload strategy

### Browse & Discover
- **Home Page** - Hero section with featured content
- **Trending Page** - Real-time trending videos with ranking badges
- **Favorites/My List** - Save favorite movies
- **Watch History** - Track watched content

### Short-Form Videos
- **Shorts Tab** - Vertical swipe UI (TikTok/Reels style)
  - Smooth vertical swipe navigation
  - Double-tap reactions
  - Creator follow system
  - Real-time engagement metrics
  - Optimized for mobile and desktop

### Content Management
- **Upload System** - Multi-step form for uploading content
  - Video file upload with progress tracking
  - Poster image upload
  - Subtitle upload (SRT/VTT support)
  - Metadata input (title, description, genre, language, year)
  - Real-time upload simulation with progress bar

### UI/UX Excellence
- **Netflix-inspired Design** - Dark theme with premium feel
- **Responsive Layouts** - Works perfectly on all devices
- **Smooth Animations** - Framer Motion for polished interactions
- **Dark/Light Theme Support** - Theme switching capability
- **Loading States** - Skeleton loaders and spinners
- **Error Handling** - Error boundaries and fallback UI
- **Accessibility** - ARIA labels, keyboard navigation, contrast ratios

## 🏗️ Project Architecture

### Clean, Scalable Structure
```
src/
├── app/                 # Application entry
├── components/          # Reusable UI components
│   ├── Header.jsx      # Navigation & search
│   ├── Sidebar.jsx     # Navigation sidebar
│   ├── VideoCard.jsx   # Video card component
│   ├── VideoPlayer.jsx # Advanced video player
│   ├── UploadModal.jsx # Content upload form
│   └── ErrorBoundary.jsx # Error handling
├── features/           # Feature modules (scalable)
├── layouts/            # Layout components
│   └── MainLayout.jsx  # Master layout
├── pages/              # Page components
│   ├── HomePage.jsx    # Home page
│   ├── TrendingPage.jsx
│   ├── FavoritesPage.jsx
│   └── ShortsPage.jsx
├── hooks/              # Custom React hooks
│   └── useVideos.js   # Data fetching hooks
├── services/           # Business logic
│   └── videoService.js # Video API/data
├── store/              # State management (Zustand)
│   └── useAppStore.js
├── utils/              # Utility functions
│   └── helpers.js      # Helper functions
├── constants/          # App constants
├── App.jsx             # Main app component
├── main.jsx            # Entry point
└── index.css           # Global styles
```

## 🔧 Tech Stack

### Core
- **Vite** - Lightning-fast build tool
- **React 19** - Latest React features
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS

### State & Data
- **Zustand** - Lightweight state management
- **TanStack Query** - Server state management
- **Axios** - HTTP client (ready for API integration)

### Animations & UX
- **Framer Motion** - Advanced animations
- **React Query** - Data caching and sync

### Developer Experience
- **ESLint** - Code quality
- **Vite + React plugin** - Fast HMR

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation

```bash
# Navigate to project
cd movies_space

# Install dependencies
npm install

# Start development server
npm run dev

# Open browser to http://localhost:5173
```

### Build for Production

```bash
# Create optimized build
npm run build

# Preview production build
npm run preview
```

## 📱 Key Pages & Routes

| Route | Component | Features |
|-------|-----------|----------|
| `/` | HomePage | Hero section, trending videos, all content |
| `/trending` | TrendingPage | Ranked trending content with badges |
| `/favorites` | FavoritesPage | Saved favorite videos |
| `/shorts` | ShortsPage | Vertical swipe video experience |

## 🎮 User Interactions

### Video Playback
- **Click poster** → Play video in fullscreen player
- **Space bar** → Play/Pause
- **F key** → Toggle fullscreen
- **M key** → Mute/Unmute
- **Arrow Up/Down** → Volume control
- **Arrow Left/Right** → Seek ±5 seconds

### Favorites
- **Heart icon** on video card → Add/remove from favorites
- Access favorites from sidebar or `/favorites` route

### Shorts Navigation
- **Swipe up/down** → Next/previous short
- **Arrow keys** → Navigate
- **Click buttons** → Like, comment, share, follow

### Upload Content
- **Upload button** in header → Open upload modal
- **Step 1** → Add metadata (title, description, genre, language, year)
- **Step 2** → Upload video, poster, and subtitles
- **Step 3** → Progress tracking and confirmation

## 💾 State Management

### App Store (Zustand)
```javascript
// User authentication
user, isAuthenticated, setUser, logout

// Theme
theme, setTheme

// Video playback
currentVideo, currentTime, setCurrentVideo, setCurrentTime

// Watch history
watchHistory, addToWatchHistory

// Favorites
favorites, addToFavorites, removeFromFavorites

// Search
searchQuery, setSearchQuery

// Modals
isUploadModalOpen, setUploadModalOpen
isRequestModalOpen, setRequestModalOpen
```

## 🔄 Data Fetching

Uses React Query for optimal data management:

```javascript
// Hooks available
useVideos()           // All videos
useVideoById(id)      // Single video
useSearchVideos(query) // Search
useShortVideos()      // Short videos
useTrendingVideos()   // Trending content
useVideosByGenre(genre) // By genre
```

## 🎨 Design System

### Colors
- **Primary**: Red (#ef4444) - Actions, highlights
- **Background**: Black (#000000) - Main background
- **Secondary**: Gray (#1f2937) - Secondary elements
- **Text**: White (#ffffff) - Primary text

### Typography
- **Headers**: Bold (font-bold)
- **Body**: Regular weight
- **Sizes**: Responsive scaling

### Components
- **Cards**: Rounded corners, gradient overlays
- **Buttons**: Rounded, with hover effects
- **Inputs**: Dark theme with focus rings
- **Modals**: Centered, backdrop blur, smooth animations

## 🔐 Security Considerations

- JWT-ready authentication flow (frontend)
- Secure token handling in store
- CORS-ready API integration
- Protected routes structure
- Input validation on forms
- Error boundary for crash prevention

## ⚡ Performance Optimizations

- **Code Splitting** - Lazy-loaded routes
- **Image Optimization** - Responsive images
- **Caching** - React Query stale time management
- **Memoization** - Prevent unnecessary re-renders
- **Lazy Loading** - Components load on demand
- **Production Build** - Minified and optimized

### Performance Targets
- **Lighthouse Score**: 90+
- **FCP**: < 1.5s
- **LCP**: < 2.5s
- **CLS**: < 0.1

## 📦 Mock Data

Video service includes mock data for development:
- 4 sample videos with full metadata
- 2 sample short videos
- Search, filtering, and sorting capabilities
- Upload simulation with progress tracking

## 🔮 Future Enhancements

- [ ] Backend API integration
- [ ] Real authentication system
- [ ] WebSocket for live features
- [ ] HLS streaming support
- [ ] Advanced analytics dashboard
- [ ] Creator monetization system
- [ ] AI-powered recommendations
- [ ] Multi-language support
- [ ] Progressive Web App (PWA)
- [ ] Offline viewing capability

## 🛠️ Development Workflow

### Code Quality
```bash
# Run linter
npm run lint

# Fix linting issues
npm run lint -- --fix
```

### Structure Principles
- **Component-based** → Reusable and testable
- **Feature isolation** → Easy maintenance
- **Service layer** → Business logic separation
- **Custom hooks** → Logic reusability
- **Store centralization** → Single source of truth

## 📝 API Integration Ready

Replace mock data in `src/services/videoService.js` with real API calls:

```javascript
// Example: Replace with actual API
export const videoService = {
  getAllVideos: async () => {
    const response = await axios.get('/api/videos');
    return response.data;
  },
  // ... other methods
};
```

## 🎯 Mission

Transform streaming experience with a **modern, fast, and feature-rich platform** that rivals industry leaders while maintaining clean, scalable code and developer experience.

---

**Built with ❤️ for an amazing video streaming experience**

