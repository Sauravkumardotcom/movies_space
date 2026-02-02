# 🔗 Frontend-Backend Integration Quick Reference

## Environment Setup

Create `.env` in `movies_space/` folder:
```
VITE_BACKEND_URL=http://localhost:5000
VITE_GOOGLE_APPS_SCRIPT_URL=https://script.google.com/macros/s/[ID]/exec
VITE_ADMIN_EMAIL=your_admin_email@gmail.com
```

## Starting Both Servers

### Terminal 1: Backend
```bash
cd backend
node server.js
# Server listening on http://localhost:5000
```

### Terminal 2: Frontend
```bash
cd movies_space
npm run dev
# Frontend on http://localhost:5173
```

## API Endpoints Mapped

### Authentication (Phase A2)
- `POST /api/auth/register` - Create user account
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (requires token)
- `POST /api/auth/refresh-token` - Refresh access token
- `POST /api/auth/logout` - Logout

### Videos (Phase A3)
- `GET /api/videos` - Search videos with filters
- `GET /api/videos/:id` - Get video details (increments views)
- `GET /api/videos/trending` - Trending videos
- `GET /api/videos/genre/:genre` - Videos by genre
- `GET /api/videos/recommendations/:genre` - Recommendations
- `POST /api/videos` - Upload video

## Frontend API Usage

### In Components
```javascript
import { authApi } from '@/services/api/authApi';
import { videoApi } from '@/services/api/videoApi';

// Auth example
const handleLogin = async (email, password) => {
  const { accessToken, refreshToken, user } = await authApi.userLogin(email, password);
  // Tokens stored automatically
};

// Video search example
const handleSearch = async (query) => {
  const results = await videoApi.searchVideos(query, {
    genre: 'Action',
    page: 1,
    limit: 20
  });
};

// Token auto-refresh handled by client interceptor
// No manual token management needed!
```

## Token Management

### Automatic (Behind the Scenes)
```
Request made
  ↓
Client adds Authorization: Bearer {accessToken}
  ↓
Response: 401 (token expired)?
  ↓
YES → Auto-refresh using refreshToken
    → Retry request with new token
    → Return result to component
  ↓
NO → Return response directly
```

### Manual (If Needed)
```javascript
// Get tokens
const token = localStorage.getItem('accessToken');
const refreshToken = localStorage.getItem('refreshToken');

// Refresh manually
const newTokens = await authApi.refreshToken(refreshToken);

// Clear all tokens
await authApi.logout();
```

## Error Handling

API methods handle errors gracefully:
```javascript
try {
  const results = await videoApi.searchVideos('invalid query');
  // Returns empty array on error, not throws
} catch (error) {
  console.error('Video fetch failed:', error.message);
}
```

## Testing Checklist

- [ ] Backend server starts without errors
- [ ] Frontend loads and connects to backend
- [ ] Can register new user account
- [ ] Can login with credentials
- [ ] Tokens appear in localStorage (F12 → Storage → Local Storage)
- [ ] Can search for videos
- [ ] Can view video details
- [ ] Can filter by genre/rating
- [ ] Pagination works
- [ ] Trending videos display
- [ ] Session persists on page refresh
- [ ] Logout clears tokens
- [ ] Token refresh happens automatically

## Troubleshooting

**"Unable to connect to backend"**
- Is backend running on port 5000? `node backend/server.js`
- Check VITE_BACKEND_URL in .env
- Verify no other app on port 5000

**"401 Unauthorized"**
- Login again to refresh token
- Clear localStorage and try again
- Check if token expired (7 days)

**"CORS error"**
- Backend should have CORS middleware
- Check backend/server.js imports

**"Cannot find module"**
- Run `npm install` in movies_space folder
- Verify all dependencies installed

## API Response Format

All successful responses return data directly (not wrapped):

```javascript
// Auth response
{
  accessToken: "eyJhbGc...",
  refreshToken: "eyJhbGc...",
  user: { id, email, firstName, lastName, avatar, bio, role }
}

// Video search response
{
  videos: [{...}, {...}],
  total: 42,
  page: 1,
  totalPages: 3,
  hasMore: true
}

// Single video response
{
  id: "123",
  title: "Movie Title",
  description: "...",
  url: "https://...",
  genre: "Action",
  rating: 8.5,
  views: 1250,
  uploadedBy: "user-id",
  createdAt: "2026-02-03T..."
}
```

## Production Deployment (Phase B2)

When deploying to Vercel:

1. Backend deployed to: `https://movies-api.vercel.app`
2. Frontend deployed to: `https://movies-space.vercel.app`
3. Update `VITE_BACKEND_URL=https://movies-api.vercel.app`
4. MongoDB network access: Add Vercel IP range
5. Environment variables: Set in Vercel dashboard

---

✅ Frontend fully integrated with real backend!
Ready for testing and deployment.
