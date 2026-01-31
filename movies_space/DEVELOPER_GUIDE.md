# 🔧 MovieSpace - Developer Guide

## For Developers Who Want to Extend the Platform

This guide covers architecture decisions, patterns, and how to add features.

---

## 🏗️ Architecture Philosophy

### Core Principles
1. **Separation of Concerns** - Each module has one responsibility
2. **DRY** - Don't repeat yourself - use components and hooks
3. **Scalability** - Easy to add new features
4. **Performance** - Optimize by default
5. **Accessibility** - Inclusive design
6. **Testing** - Code is testable

---

## 📂 Folder Responsibilities

### `components/`
Reusable UI components (pure presentation):
```javascript
// Example: VideoCard.jsx
- Takes props only
- No business logic
- Styling included
- Handles its own state (UI only)
- Exported for use anywhere
```

### `pages/`
Full page components:
```javascript
// Example: HomePage.jsx
- Uses custom hooks for data
- Manages page-level state
- Combines multiple components
- Connected to router
```

### `hooks/`
Custom React hooks:
```javascript
// Example: useVideos.js
- Encapsulate data fetching
- Return [data, loading, error]
- Use React Query for caching
- Can be used by multiple components
```

### `services/`
Business logic and API calls:
```javascript
// Example: videoService.js
- Pure functions
- No React dependencies
- Easily testable
- API integration point
```

### `store/`
Global state management:
```javascript
// Example: useAppStore.js
- Zustand store
- User state
- App settings
- Modal states
```

---

## 🔄 Adding a New Feature

### Example: Add a "Watch History" Page

#### Step 1: Create Service (if needed)
```javascript
// src/services/historyService.js
export const historyService = {
  getWatchHistory: async () => {
    // Mock or API call
    return mockHistory;
  },
  clearHistory: async () => {
    // Clear logic
  },
};
```

#### Step 2: Create Hook (if data fetching)
```javascript
// src/hooks/useWatchHistory.js
import { useQuery } from '@tanstack/react-query';
import { historyService } from '../services/historyService';

export const useWatchHistory = () => {
  return useQuery({
    queryKey: ['watchHistory'],
    queryFn: historyService.getWatchHistory,
  });
};
```

#### Step 3: Create Components
```javascript
// src/components/HistoryItem.jsx
const HistoryItem = ({ video, watched }) => (
  <div>
    {/* Component content */}
  </div>
);
export default HistoryItem;
```

#### Step 4: Create Page
```javascript
// src/pages/WatchHistoryPage.jsx
import { useWatchHistory } from '../hooks/useWatchHistory';
import HistoryItem from '../components/HistoryItem';

const WatchHistoryPage = () => {
  const { data: history } = useWatchHistory();
  
  return (
    <div>
      {history?.map(item => (
        <HistoryItem key={item.id} video={item} />
      ))}
    </div>
  );
};
export default WatchHistoryPage;
```

#### Step 5: Add Route
```javascript
// src/App.jsx
<Route path="/history" element={<WatchHistoryPage />} />
```

#### Step 6: Add Navigation
```javascript
// src/components/Sidebar.jsx
const menuItems = [
  // ... existing items
  { label: 'Watch History', icon: '⏱️', path: '/history' },
];
```

---

## 🎨 Component Patterns

### 1. Functional Component with Hooks
```javascript
import { useState } from 'react';

const MyComponent = ({ title, onClose }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      {/* Component JSX */}
    </div>
  );
};

export default MyComponent;
```

### 2. Component with Data Fetching
```javascript
import { useCustomHook } from '../hooks/useCustomHook';
import { motion } from 'framer-motion';

const DataComponent = () => {
  const { data, isLoading, error } = useCustomHook();

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorFallback error={error} />;

  return (
    <motion.div>
      {data?.map(item => <Item key={item.id} {...item} />)}
    </motion.div>
  );
};

export default DataComponent;
```

### 3. Modal Component
```javascript
import { AnimatePresence, motion } from 'framer-motion';

const Modal = ({ isOpen, onClose, children }) => (
  <AnimatePresence>
    {isOpen && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/80 flex items-center justify-center"
      >
        <motion.div
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          onClick={e => e.stopPropagation()}
          className="bg-gray-900 rounded-lg"
        >
          {children}
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

export default Modal;
```

---

## 🔗 State Management Patterns

### Using Store in Components
```javascript
import { useAppStore } from '../store/useAppStore';

const MyComponent = () => {
  const { favorites, addToFavorites } = useAppStore();

  return (
    <button onClick={() => addToFavorites(video)}>
      Add to Favorites
    </button>
  );
};
```

### Adding New Store Slices
```javascript
// src/store/useAppStore.js
export const useAppStore = create((set) => ({
  // ... existing state
  
  // New feature
  notifications: [],
  addNotification: (msg) => set((state) => ({
    notifications: [...state.notifications, msg],
  })),
  removeNotification: (id) => set((state) => ({
    notifications: state.notifications.filter((n) => n.id !== id),
  })),
}));
```

---

## 🔌 API Integration

### Replacing Mock Data

**Before:**
```javascript
// src/services/videoService.js
export const videoService = {
  getAllVideos: async () => {
    return mockVideos; // Mock data
  },
};
```

**After:**
```javascript
import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_URL;

export const videoService = {
  getAllVideos: async () => {
    const response = await axios.get(`${API_BASE}/videos`);
    return response.data;
  },

  getVideoById: async (id) => {
    const response = await axios.get(`${API_BASE}/videos/${id}`);
    return response.data;
  },

  uploadVideo: async (formData) => {
    const response = await axios.post(`${API_BASE}/videos/upload`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
};
```

### Environment Variables
```bash
# .env.local
VITE_API_URL=http://localhost:3000/api
VITE_VIDEO_BUCKET=https://videos.example.com
```

Usage in code:
```javascript
const apiUrl = import.meta.env.VITE_API_URL;
```

---

## 🧪 Testing Patterns

### Component Testing
```javascript
// MyComponent.test.jsx
import { render, screen } from '@testing-library/react';
import MyComponent from './MyComponent';

describe('MyComponent', () => {
  it('renders title', () => {
    render(<MyComponent title="Test" />);
    expect(screen.getByText('Test')).toBeInTheDocument();
  });
});
```

### Hook Testing
```javascript
import { renderHook, act } from '@testing-library/react';
import { useAppStore } from './useAppStore';

describe('useAppStore', () => {
  it('adds to favorites', () => {
    const { result } = renderHook(() => useAppStore());

    act(() => {
      result.current.addToFavorites({ id: 1 });
    });

    expect(result.current.favorites).toHaveLength(1);
  });
});
```

---

## 🎬 Common Customizations

### Add a New Genre Filter
```javascript
// In videoService.js
getVideosByGenre: async (genre) => {
  return mockVideos.filter(v => v.genre.includes(genre));
},

// In a component
const { data: videos } = useQuery({
  queryKey: ['videos', 'action'],
  queryFn: () => videoService.getVideosByGenre('Action'),
});
```

### Add Language Support
```javascript
// Create store for language
export const useLanguageStore = create((set) => ({
  language: 'en',
  setLanguage: (lang) => set({ language: lang }),
}));

// Use in components
const { language } = useLanguageStore();
const localizedText = translations[language];
```

### Add Theme Support
```javascript
// Already in store, just use it
const { theme, setTheme } = useAppStore();

// In component
const isDark = theme === 'dark';
<div className={isDark ? 'bg-black' : 'bg-white'}>
```

---

## 🚀 Performance Tips

### 1. Memoize Components
```javascript
import { memo } from 'react';

const VideoCard = memo(({ video }) => (
  <div>{video.title}</div>
), (prev, next) => prev.video.id === next.video.id);

export default VideoCard;
```

### 2. Lazy Load Routes
```javascript
import { lazy, Suspense } from 'react';

const HomePage = lazy(() => import('./pages/HomePage'));

<Route
  path="/"
  element={
    <Suspense fallback={<LoadingPage />}>
      <HomePage />
    </Suspense>
  }
/>
```

### 3. Use useCallback for Event Handlers
```javascript
import { useCallback } from 'react';

const MyComponent = () => {
  const handleClick = useCallback((id) => {
    // Handle click
  }, []);

  return <button onClick={() => handleClick(1)}>Click</button>;
};
```

### 4. Optimize Lists
```javascript
// Use key prop correctly
{videos.map(video => (
  <VideoCard key={video.id} video={video} />
))}

// Don't use index as key
{videos.map((video, index) => ( // ❌ Bad
  <VideoCard key={index} video={video} />
))}
```

---

## 🔒 Security Best Practices

### 1. API Keys
```javascript
// ❌ Don't do this
const API_KEY = "sk_live_abc123";

// ✅ Do this instead
const API_KEY = import.meta.env.VITE_API_KEY;
```

### 2. Authentication
```javascript
// Store token safely
const token = localStorage.getItem('authToken');

// Add to requests
axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
```

### 3. Input Validation
```javascript
const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

// Use in forms
const [email, setEmail] = useState('');
const isValid = validateEmail(email);
```

---

## 📊 Monitoring & Debugging

### Console Logging
```javascript
// Development only
if (import.meta.env.DEV) {
  console.log('Debug info:', data);
}
```

### Error Tracking
```javascript
// Send errors to service
const captureException = (error) => {
  if (import.meta.env.PROD) {
    // Send to Sentry, LogRocket, etc.
    logService.captureError(error);
  }
};
```

### Performance Monitoring
```javascript
// Measure load time
const startTime = performance.now();
// ... operation ...
console.log(`Operation took ${performance.now() - startTime}ms`);
```

---

## 🎯 Best Practices Checklist

- ✅ Use functional components with hooks
- ✅ Keep components small and focused
- ✅ Extract business logic to services
- ✅ Use custom hooks for data fetching
- ✅ Use Zustand for global state
- ✅ Optimize with React.memo and useCallback
- ✅ Handle loading and error states
- ✅ Use TypeScript for larger projects
- ✅ Write tests for utilities and hooks
- ✅ Use ESLint for code quality
- ✅ Document complex logic
- ✅ Use semantic HTML
- ✅ Accessibility first mindset
- ✅ Follow consistent code style

---

## 📚 Useful Resources

- [React Documentation](https://react.dev)
- [React Router](https://reactrouter.com)
- [Zustand](https://github.com/pmndrs/zustand)
- [React Query](https://tanstack.com/query)
- [Tailwind CSS](https://tailwindcss.com)
- [Framer Motion](https://www.framer.com/motion)
- [JavaScript.info](https://javascript.info)

---

## 🤝 Contributing

When adding new features:
1. Follow the established folder structure
2. Write comments for complex logic
3. Test thoroughly
4. Update documentation
5. Keep components reusable
6. Optimize for performance

---

**Happy Coding! 💻**

