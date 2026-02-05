# Phase 4: Authentication & User System - In Progress 🔐

**Status**: Starting Implementation  
**Target Completion**: Production-Ready  

---

## Overview

Phase 4 implements a complete authentication system with JWT tokens, user profiles, secure sessions, and integration with all existing features (movies, shorts, music, uploads).

---

## Architecture

### Backend Auth Service

#### Purpose
- User registration/login
- Password hashing with bcrypt
- JWT token generation + refresh
- Email verification (optional)
- Password reset flow

#### Key Methods
- `registerUser(email, password, username)` - Create new account
- `loginUser(email, password)` - Authenticate user
- `verifyPassword(password, hash)` - Validate credentials
- `generateTokens(userId)` - JWT + Refresh tokens
- `refreshToken(refreshToken)` - Issue new access token
- `getUserProfile(userId)` - Get user details
- `updateProfile(userId, data)` - Edit profile
- `changePassword(userId, oldPassword, newPassword)` - Secure password change

#### Database
- `User` model (already in Prisma schema)
  - id, email, username, password (hashed), avatar, bio
  - Relations: preferences, watchlist, favorites, history, ratings, playlists, uploads
- `Session` model (to create)
  - userId, refreshToken, expiresAt
  - For refresh token rotation

### Frontend Auth Service

#### Purpose
- HTTP-only cookie management
- Token storage + retrieval
- Auto-token refresh on expiry
- Logout cleanup

#### Key Methods
- `signup(email, username, password)` - Register new account
- `login(email, password)` - Authenticate
- `logout()` - Clear session
- `getCurrentUser()` - Get logged-in user
- `updateProfile(data)` - Edit profile
- `changePassword(oldPassword, newPassword)` - Change password
- `refreshAccessToken()` - Get new token

### Auth Middleware

#### Backend
- `authMiddleware` (existing) - Verify JWT + extract userId
- `isOwner` - Verify resource ownership
- `requireAuth` - Enforce authentication

#### Frontend
- `ProtectedRoute` - Route guard for private pages
- Token auto-refresh on 401 responses
- Unauthorized redirects to login

### Pages & Components

#### Frontend
- **LoginPage** - Email + password form
- **SignupPage** - Registration form
- **ForgotPasswordPage** - Password reset initiation
- **ResetPasswordPage** - New password entry
- **ProfilePage** - User profile + edit modal
- **SettingsPage** - Preferences + linked accounts

#### UI Components
- `AuthForm` - Reusable login/signup form
- `ProtectedRoute` - Route wrapper
- `AuthGuard` - Component-level protection
- `LogoutConfirm` - Confirm logout dialog

---

## Implementation Plan

### Step 1: Backend Auth Service
- Create `/backend/src/services/auth.ts`
- Implement all auth methods
- Password hashing + verification
- JWT generation + validation

### Step 2: Backend Auth Routes
- Create `/backend/src/routes/auth.ts`
- POST /auth/signup
- POST /auth/login
- POST /auth/logout
- POST /auth/refresh
- GET /auth/me
- PUT /auth/profile
- POST /auth/change-password

### Step 3: Session Model
- Add `Session` to Prisma schema
- Migration for session table
- Token rotation logic

### Step 4: Frontend Auth Service
- Create `/frontend/src/services/auth.ts`
- HTTP-only cookie handling
- Token refresh interceptor
- Auto-logout on 401

### Step 5: Frontend Auth Store
- Create `/frontend/src/store/auth.ts`
- User state (logged in, user data)
- Token management
- Auth helpers

### Step 6: Frontend Auth Hooks
- Create `/frontend/src/hooks/useAuth.ts`
- useLogin() / useSignup()
- useLogout()
- useUser()
- useUpdateProfile()

### Step 7: Auth Pages
- LoginPage with form validation
- SignupPage with password strength
- ProfilePage with edit modal
- SettingsPage

### Step 8: Protected Routes
- Update routing
- Add route guards
- Auto-redirect for auth

### Step 9: Integration
- Protect all music/movie routes
- Update mutation hooks to include userId
- Secure file uploads with auth
- Link user uploads to accounts

### Step 10: Documentation
- Complete Phase 4 summary
- API documentation
- Security best practices

---

## Security Considerations

✅ **Password Security**
- Bcrypt hashing (10 salt rounds)
- No plaintext storage
- Secure password change flow

✅ **Token Security**
- JWT with HS256 signing
- Short-lived access tokens (15 min)
- Refresh tokens in HTTP-only cookies
- Token rotation on refresh

✅ **Route Protection**
- All mutations require auth
- Ownership verification on updates/deletes
- Admin checks for admin operations

✅ **CSRF Protection**
- HTTP-only cookies
- CORS properly configured
- Same-origin requests only

✅ **Session Management**
- Refresh token rotation
- Token expiry enforcement
- Logout token invalidation

---

## Testing Strategy

**Unit Tests**
- Password hashing/verification
- JWT generation/validation
- Token refresh logic

**Integration Tests**
- Full signup flow
- Full login flow
- Token refresh flow
- Protected route access

**E2E Tests**
- User registration
- User login
- Protected content access
- Profile update
- Logout

---

## Completion Criteria

| Item | Criteria |
|------|----------|
| Signup | Email uniqueness, password strength, validation |
| Login | Correct credentials, token generation, session creation |
| Protected Routes | Auth required, owner check, proper 401/403 |
| Token Refresh | Auto-refresh on 401, token rotation |
| Profile | View, edit, avatar upload |
| Logout | Token invalidation, session cleanup |
| Integration | All features linked to user |

---

## Database Schema Changes

### New Session Model
```prisma
model Session {
  id        String   @id @default(cuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  refreshToken String @unique
  expiresAt    DateTime
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  @@index([userId])
  @@index([refreshToken])
}
```

### Updated User Model
```prisma
// Existing + new relation
sessions   Session[]
```

---

## API Changes

### New Auth Endpoints
- POST `/auth/signup`
- POST `/auth/login`
- POST `/auth/logout`
- POST `/auth/refresh`
- GET `/auth/me`
- PUT `/auth/profile`
- POST `/auth/change-password`

### Updated Endpoints
- All protected routes now require JWT
- All mutations verify ownership
- All list queries filtered by user

---

## Timeline

| Phase | Time |
|-------|------|
| Auth Service | 30 min |
| Auth Routes | 30 min |
| Frontend Auth | 30 min |
| Pages & Components | 40 min |
| Integration | 30 min |
| Testing | 20 min |
| Documentation | 20 min |
| **Total** | **~3.5 hours** |

---

## Success Metrics

✅ Users can signup/login  
✅ Tokens properly issued + refreshed  
✅ All routes protected  
✅ Ownership verified on operations  
✅ Session persists across page reloads  
✅ Logout clears all tokens  
✅ Password change works  
✅ Profile can be updated  

---

Next: Execute Phase 4 Implementation
