# PHASE 2: ARCHITECTURE & STRUCTURE IMPROVEMENT
**Status:** Ready to implement  
**Target:** Production-ready architecture  

---

## SECTION 1: PROPOSED PROJECT STRUCTURE

### Current State (Suboptimal)
```
movies_space/src/
├── App.jsx (router & store setup mixed)
├── index.css
├── main.jsx
├── Components/ (11 files, mixed concerns)
├── pages/ (10 files)
├── hooks/ (1 file with 6 hooks)
├── services/ (4 files, inconsistent patterns)
├── store/ (1 monolithic store)
├── utils/ (1 helpers file)
└── layouts/ (1 main layout)
```

**Problems:**
- No separation of concerns
- Services mix local state with API calls
- No context for avoiding prop drilling
- No constants/types folder
- No middleware or interceptors
- Unclear data transformation layer

---

### IMPROVED STRUCTURE (Production-Ready)

```
movies_space/src/
│
├── config/                          # 📋 Constants, env vars, validation
│   ├── constants.ts                 # App-wide constants
│   ├── env.ts                       # Environment validation
│   ├── routes.ts                    # Route definitions
│   └── genres.ts                    # Genre list & helpers
│
├── types/                           # 🔷 TypeScript types (or JSDoc)
│   ├── video.ts
│   ├── user.ts
│   ├── request.ts
│   └── api.ts
│
├── services/                        # 🔌 API & External Services
│   ├── api/
│   │   ├── client.ts               # Axios instance with interceptors
│   │   ├── videoApi.ts             # Google Sheets API calls
│   │   ├── emailApi.ts             # Email service integration
│   │   └── authApi.ts              # Authentication endpoints
│   ├── google/
│   │   ├── sheetsService.ts        # Google Sheets operations
│   │   ├── driveService.ts         # Google Drive operations
│   │   └── authService.ts          # Google OAuth
│   ├── email/
│   │   ├── emailService.ts         # Email operations (Nodemailer)
│   │   └── templates/              # Email templates
│   └── cache/
│       └── queryCache.ts            # React Query cache management
│
├── context/                         # 🌍 Global Context (avoid prop drilling)
│   ├── AuthContext.tsx              # Auth state & methods
│   ├── ThemeContext.tsx             # Dark/light mode
│   ├── NotificationContext.tsx      # Toast/snackbar notifications
│   └── DataContext.tsx              # Cached data context
│
├── hooks/                           # ⚛️ Custom Hooks
│   ├── useVideos.ts                 # Video fetching + caching
│   ├── useAuth.ts                   # Authentication logic
│   ├── useSearch.ts                 # Search with debouncing
│   ├── useNotification.ts           # Toast/notification management
│   ├── useFavorites.ts              # Favorites management
│   ├── useLocalStorage.ts           # Safe localStorage access
│   ├── useForm.ts                   # Form handling + validation
│   └── useDeepCompare.ts            # Dependency optimization
│
├── components/                      # 🎨 Reusable UI Components
│   ├── common/
│   │   ├── Button.jsx
│   │   ├── Input.jsx
│   │   ├── Modal.jsx
│   │   ├── Card.jsx
│   │   ├── Loader.jsx
│   │   ├── EmptyState.jsx
│   │   ├── ErrorState.jsx
│   │   └── Toast.jsx
│   ├── layout/
│   │   ├── Header.jsx
│   │   ├── Sidebar.jsx
│   │   ├── Footer.jsx
│   │   └── MainLayout.jsx
│   ├── video/
│   │   ├── VideoCard.jsx
│   │   ├── VideoGrid.jsx
│   │   ├── VideoPlayer.jsx
│   │   └── PlaybackControls.jsx
│   ├── forms/
│   │   ├── UploadForm.jsx
│   │   ├── RequestForm.jsx
│   │   └── SearchBar.jsx
│   ├── auth/
│   │   ├── LoginForm.jsx
│   │   ├── SignupForm.jsx
│   │   └── ProtectedRoute.jsx
│   └── error/
│       ├── ErrorBoundary.jsx
│       └── ErrorFallback.jsx
│
├── pages/                           # 📄 Page Components (Route handlers)
│   ├── Home.jsx
│   ├── Watch.jsx
│   ├── Trending.jsx
│   ├── New.jsx
│   ├── Favorites.jsx
│   ├── History.jsx
│   ├── Shorts.jsx
│   ├── Search.jsx                   # NEW: Search results page
│   ├── Genre.jsx                    # NEW: Genre filtered page
│   ├── Login.jsx
│   ├── Signup.jsx                   # NEW: User registration
│   ├── AdminLogin.jsx
│   └── Admin/
│       ├── AdminPanel.jsx
│       ├── ManageVideos.jsx         # NEW: Video management
│       ├── ManageUsers.jsx          # NEW: User management
│       ├── Analytics.jsx            # NEW: View stats
│       └── Settings.jsx             # NEW: Admin settings
│
├── store/                           # 🗄️ State Management
│   ├── appStore.ts                  # Zustand main store
│   ├── slices/
│   │   ├── authSlice.ts
│   │   ├── videoSlice.ts
│   │   ├── uiSlice.ts
│   │   └── notificationSlice.ts
│   └── persist/
│       └── middleware.ts             # Zustand persistence config
│
├── utils/                           # 🔧 Utility Functions
│   ├── validators.ts                # Email, URL, form validation
│   ├── formatters.ts                # Format duration, date, numbers
│   ├── helpers.ts                   # Debounce, throttle, etc
│   ├── localStorage.ts              # Safe localStorage wrapper
│   ├── error.ts                     # Error handling utilities
│   └── logger.ts                    # Logging utility
│
├── styles/                          # 🎨 Global Styles
│   ├── index.css                    # Tailwind + globals
│   ├── animations.css               # Shared animations
│   └── theme.css                    # Theme variables
│
├── App.jsx                          # Root component
├── main.jsx                         # Entry point
└── index.css                        # CSS imports

backend/
├── config/                          # Configuration
│   ├── env.ts                       # Environment validation
│   └── constants.ts
├── middleware/
│   ├── cors.ts                      # CORS configuration
│   ├── auth.ts                      # JWT verification
│   ├── rateLimit.ts                 # Rate limiting
│   └── errorHandler.ts              # Global error handler
├── routes/
│   ├── index.ts                     # Route aggregation
│   ├── apps-script.ts               # Google Apps Script proxy
│   ├── email.ts                     # Email sending endpoint
│   ├── auth.ts                      # Authentication endpoints
│   └── health.ts                    # Health check
├── services/
│   ├── appsScriptService.ts         # Apps Script communication
│   ├── emailService.ts              # Nodemailer setup
│   ├── sheetService.ts              # Google Sheets operations
│   └── validationService.ts         # Input validation
├── utils/
│   ├── logger.ts                    # Structured logging
│   ├── errors.ts                    # Custom error classes
│   └── responses.ts                 # Standard response format
├── server.ts                        # Express app setup
└── index.ts                         # Entry point
```

---

## SECTION 2: DATA FLOW ARCHITECTURE

### Video Data Flow (UI → Google Sheets → UI)

```
┌─────────────────────────────────────────────────────────────────┐
│ FRONTEND                                                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  HomePage.jsx                                                  │
│      ↓                                                          │
│  useVideos() hook                                              │
│      ├─ Check local cache (React Query)                        │
│      ├─ If stale → call queryFn                                │
│      │   ↓                                                      │
│      │  videoApi.getAllVideos()                                │
│      │      ├─ Add auth header (JWT token)                     │
│      │      ├─ Request: POST /api/apps-script                  │
│      │      │   with { action: 'getVideos' }                   │
│      │      └─ Return normalized data                          │
│      │   ↓                                                      │
│      │  BACKEND                                                │
│      │  server.js /api/apps-script                             │
│      │      ├─ Validate request                                │
│      │      ├─ Check rate limit                                │
│      │      ├─ Forward to Google Apps Script                   │
│      │      │   POST https://script.google.com/macros/...      │
│      │      ├─ Receive normalized data                         │
│      │      └─ Return with cache headers                       │
│      │   ↓                                                      │
│      │  GOOGLE APPS SCRIPT                                     │
│      │  doPost(e)                                              │
│      │      ├─ Parse { action: 'getVideos' }                   │
│      │      ├─ Query Google Sheets API                         │
│      │      │   READ 'Movies' sheet                            │
│      │      ├─ Format response                                 │
│      │      │   [{ id, src, title, poster, ... }]             │
│      │      └─ Return JSON                                     │
│      │   ↓                                                      │
│      ├─ Cache in React Query (5 min)                           │
│      └─ Return to component                                    │
│   ↓                                                            │
│  <VideoGrid videos={data} />                                   │
│      ↓                                                          │
│  Display UI with fallback + error boundary                     │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Key Improvements:**
- ✅ Single query function with built-in caching
- ✅ Normalized data at each layer
- ✅ Error boundaries at UI level
- ✅ Retry logic in API client
- ✅ Rate limiting on backend

---

### Email Data Flow (Form → Backend → Nodemailer → User)

```
┌──────────────────────────────────────────────────────────────┐
│ FRONTEND                                                     │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  RequestMovieModal.jsx                                       │
│      ↓                                                       │
│  <form onSubmit={handleSubmit} />                            │
│      ├─ Validate form data (client-side)                     │
│      ├─ Show loading state                                   │
│      ↓                                                       │
│  emailApi.sendRequestEmail({                                 │
│    email, name, title, type, message                         │
│  })                                                          │
│      ├─ Sanitize inputs                                      │
│      ├─ POST /api/send-email                                 │
│      │   Backend receives request                            │
│      │                                                        │
│      │  BACKEND: server.js                                   │
│      │  ├─ Validate input schema                             │
│      │  ├─ Check rate limit per IP                           │
│      │  ├─ Sanitize all fields                               │
│      │  ├─ Send via Nodemailer OR Apps Script                │
│      │  │   ↓                                                │
│      │  │  emailService.sendEmail({                          │
│      │  │    to: email,                                      │
│      │  │    template: 'requestConfirmation',                │
│      │  │    data: { title, name }                           │
│      │  │  })                                                │
│      │  │   ↓                                                │
│      │  │  NODEMAILER (or Gmail App)                         │
│      │  │  ├─ Format HTML email                              │
│      │  │  ├─ Send via SMTP                                  │
│      │  │  └─ Return success/error                           │
│      │  │                                                     │
│      │  └─ Also send admin notification                      │
│      │      POST to admin_email                              │
│      │   ↓                                                   │
│      └─ Return success response                              │
│   ↓                                                          │
│  Show toast: "Confirmation email sent!"                      │
│  Close modal                                                 │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

**Key Improvements:**
- ✅ Dual fallback (Nodemailer primary, Apps Script secondary)
- ✅ Rate limiting per email address
- ✅ Input validation & sanitization
- ✅ Email templates in backend
- ✅ Retry logic for failed sends

---

### Error Propagation Strategy

```
┌─────────────────────────────────────┐
│ Layer 4: Global Error Boundary       │
│ (Catches unhandled exceptions)       │
│ → Fallback UI with "Try Again"      │
└─────────────────────────────────────┘
                 ↑
┌─────────────────────────────────────┐
│ Layer 3: Page-Level Error Boundary   │
│ (Catches errors in current route)   │
│ → Show page-specific error UI        │
└─────────────────────────────────────┘
                 ↑
┌─────────────────────────────────────┐
│ Layer 2: Hook/Component Try-Catch    │
│ (Catches async errors)              │
│ → Set component error state          │
│ → Show inline error message          │
└─────────────────────────────────────┘
                 ↑
┌─────────────────────────────────────┐
│ Layer 1: API Client Error Handler    │
│ (Axios interceptor)                 │
│ → Log error                         │
│ → Retry if transient                │
│ → Throw normalized error             │
└─────────────────────────────────────┘
```

---

### Loading State Strategy

```
State Machine for Each Data Fetch:

┌──────────────┐
│   IDLE       │ Initial state
└──────┬───────┘
       │ startFetch()
       ↓
┌──────────────┐
│  LOADING     │ Skeleton/spinner shown
└──────┬──────┬─────────────┐
       │      │             │
    Success  Error      Timeout (3s)
       │      │             │
       ↓      ↓             ↓
    SUCCESS ERROR        RETRY
       │      │             │
       └──────┴─────────────┘
             ↓
       ┌────────────────────┐
       │ Show result/error  │
       └────────────────────┘
```

---

## SECTION 3: KEY ARCHITECTURAL DECISIONS

### 1. **API Client Centralization**
**Decision:** Single Axios instance with interceptors  
**Benefits:**
- Consistent error handling
- Centralized auth token management
- Request/response transformations
- Rate limiting awareness

```typescript
// services/api/client.ts
const client = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL
});

client.interceptors.request.use(config => {
  config.headers.Authorization = `Bearer ${getToken()}`;
  return config;
});

client.interceptors.response.use(
  res => res,
  err => handleApiError(err)
);
```

---

### 2. **Context for Global State (Not Zustand)**
**Decision:** Use Context API for Auth, Theme, Notifications  
**Benefits:**
- Cleaner dependency injection
- Smaller bundle size for simple state
- No prop drilling

```typescript
// context/AuthContext.tsx
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  
  return (
    <AuthContext.Provider value={{ user, token, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};
```

---

### 3. **Custom Hooks for Business Logic**
**Decision:** Extract all logic into reusable hooks  
**Benefits:**
- Testable logic
- Reusable across components
- Separation of concerns

```typescript
// hooks/useVideos.ts
export const useVideos = (options = {}) => {
  return useQuery({
    queryKey: ['videos', options],
    queryFn: async () => {
      const response = await videoApi.getVideos();
      return normalizeVideoData(response);
    },
    staleTime: 5 * 60 * 1000,
    retry: 2,
    ...options
  });
};
```

---

### 4. **Normalized Data Schema**
**Decision:** Enforce consistent data structure from API  
**Schema:**

```typescript
// types/video.ts
interface Video {
  id: string | number;              // Unique identifier
  src: string;                       // Video playback URL
  title: string;                     // Display title
  description: string;               // Long description
  poster: string;                    // Thumbnail URL
  genre: string[];                   // Genre tags
  year: number;                      // Release year
  duration: number;                  // In seconds
  rating: number;                    // 0-10 score
  director?: string;                 // Director name
  watched?: number;                  // View count
  added?: number;                    // Timestamp
  isFavorite?: boolean;              // Local state
}
```

**Benefits:**
- Eliminates `src` vs `videoUrl` confusion
- Ensures all components use same shape
- Easier to add fields later
- Better TypeScript support

---

### 5. **Middleware on Backend**
**Decision:** Express middleware stack for cross-cutting concerns  
**Order:**

```typescript
// backend/server.ts
app.use(cors(corsConfig));           // 1. CORS handling
app.use(express.json());              // 2. Body parsing
app.use(rateLimiter);                 // 3. Rate limiting
app.use(requestLogger);               // 4. Request logging
app.use(validateEnv);                 // 5. Environment check
app.use(authMiddleware);              // 6. JWT verification
app.use(requestValidator);            // 7. Input validation
app.use(routes);                      // 8. Routes
app.use(errorHandler);                // 9. Error handling
```

---

## SECTION 4: ADVANTAGES OF NEW ARCHITECTURE

| Aspect | Before | After |
|--------|--------|-------|
| **Code Organization** | Mixed concerns | Clear separation |
| **Reusability** | Monolithic | Modular, composable |
| **Testing** | Hard to test | Each layer testable |
| **Error Handling** | Scattered try-catch | Centralized strategy |
| **Data Consistency** | Variable schemas | Normalized, typed |
| **Scaling** | Difficult | Easy to add features |
| **Performance** | No caching strategy | Built-in caching |
| **Maintenance** | High complexity | Clear patterns |
| **Onboarding** | Steep learning curve | Obvious patterns |

---

## SECTION 5: MIGRATION STRATEGY

### Phase 2.1: Setup New Structure
1. Create all folders
2. Move existing files to new locations
3. Update all imports

### Phase 2.2: Extract Services
1. Create `services/api/client.ts`
2. Create `services/api/videoApi.ts`
3. Create `services/api/emailApi.ts`
4. Update components to use new APIs

### Phase 2.3: Extract Context
1. Create `AuthContext.tsx`
2. Create `ThemeContext.tsx`
3. Create `NotificationContext.tsx`
4. Wrap App with providers

### Phase 2.4: Extract Custom Hooks
1. Create hooks for each domain
2. Move logic from components
3. Update components

### Phase 2.5: Update Backend Structure
1. Reorganize middleware
2. Extract services
3. Add validation layer
4. Add error handler

---

## Ready for Implementation ✅

This architecture provides:
- ✅ Clear separation of concerns
- ✅ Scalable structure for features
- ✅ Testable code organization
- ✅ Production-ready patterns
- ✅ Easy onboarding for new developers

**Next:** PHASE 3 - Fix critical issues using new architecture

