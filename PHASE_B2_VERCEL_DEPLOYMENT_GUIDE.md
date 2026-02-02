# 🚀 PHASE B2: PRODUCTION DEPLOYMENT TO VERCEL

**Status**: In Progress  
**Date**: February 3, 2026  
**Goal**: Deploy MovieSpace to production on Vercel  
**Duration**: 1-2 hours total

---

## 📋 PHASE B2 Deployment Checklist

### Step 1: Vercel Account & Project Setup ⏳
- [ ] Create Vercel account (free tier works)
- [ ] Connect GitHub repository
- [ ] Create project for backend
- [ ] Create project for frontend

### Step 2: Backend Deployment Preparation ⏳
- [ ] Create `vercel.json` in backend folder
- [ ] Update MongoDB Atlas network access
- [ ] Configure environment variables
- [ ] Test backend locally before deploy

### Step 3: Frontend Deployment Preparation ⏳
- [ ] Update `.env` with production URLs
- [ ] Create `vercel.json` in frontend folder
- [ ] Configure environment variables
- [ ] Build and test locally

### Step 4: Deploy Both to Vercel ⏳
- [ ] Deploy backend to Vercel
- [ ] Deploy frontend to Vercel
- [ ] Verify both are running
- [ ] Test end-to-end integration

### Step 5: Post-Deployment Testing ✅
- [ ] User registration on production
- [ ] User login on production
- [ ] Video search on production
- [ ] Token refresh working
- [ ] Error handling working

---

## 🔧 Step 1: Initial Setup

### 1.1 Prerequisites
```
✅ GitHub account (to connect repo)
✅ Vercel account (sign up free at vercel.com)
✅ Node.js installed locally
✅ Git initialized in project
```

### 1.2 Connect to GitHub
```bash
# In your project root
git init
git add .
git commit -m "MovieSpace - Production ready"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/movies_space.git
git push -u origin main
```

### 1.3 Create Vercel Projects
Visit https://vercel.com/dashboard:
1. Click "Add New..." → "Project"
2. Import your GitHub repository
3. Create two projects:
   - **movies-space-api** (backend)
   - **movies-space** (frontend)

---

## 📝 Backend Deployment (`backend/vercel.json`)

Create this file in the backend directory:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "server.js"
    }
  ],
  "env": {
    "NODE_ENV": "production"
  },
  "buildCommand": "npm install",
  "devCommand": "node server.js"
}
```

### Backend Environment Variables (Set in Vercel)

Go to Project Settings → Environment Variables:

```
MONGODB_URI=mongodb+srv://shakyalabs:Mydream%40123@cluster0.efs3fjh.mongodb.net/?appName=Cluster0
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRE=7d
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-in-production
JWT_REFRESH_EXPIRE=30d
VITE_GOOGLE_APPS_SCRIPT_URL=https://script.google.com/macros/s/[YOUR_ID]/exec
NODE_ENV=production
PORT=3000
```

---

## 📱 Frontend Deployment (`movies_space/vercel.json`)

Create this file in the frontend directory:

```json
{
  "version": 2,
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "env": {
    "VITE_BACKEND_URL": "@vite_backend_url"
  },
  "build": {
    "env": {
      "VITE_BACKEND_URL": "@vite_backend_url"
    }
  }
}
```

### Frontend Environment Variables (Set in Vercel)

Go to Project Settings → Environment Variables:

```
VITE_BACKEND_URL=https://movies-space-api.vercel.app
VITE_GOOGLE_APPS_SCRIPT_URL=https://script.google.com/macros/s/[YOUR_ID]/exec
VITE_ADMIN_EMAIL=your_admin_email@gmail.com
```

---

## 🗄️ MongoDB Atlas Configuration

### Step 1: Verify Connection String
1. Go to MongoDB Atlas → Clusters → Connect
2. Copy the connection string
3. Add credentials: `mongodb+srv://USERNAME:PASSWORD@cluster...`

### Step 2: Allow Vercel IP Range
1. Go to Network Access in Atlas
2. Click "Add IP Address"
3. Choose "Allow access from anywhere" OR
4. Add Vercel's IP range: `0.0.0.0/0` (temporary, then restrict)

**Note**: For production, you should use Vercel's IP ranges which you can find in your deployment logs.

### Step 3: Create Database User
1. Go to Database Access
2. Create user: `shakyalabs`
3. Password: `Mydream@123` (URL encode special chars)
4. Give "Read and Write to any database" permission

---

## ✅ Pre-Deployment Checklist

### Backend Checks
- [ ] `backend/server.js` runs without errors
- [ ] All dependencies in `package.json`
- [ ] `.env` has all required variables
- [ ] `vercel.json` is properly formatted
- [ ] MongoDB connection string is valid
- [ ] No hardcoded URLs (use environment variables)

### Frontend Checks
- [ ] `npm run build` succeeds locally
- [ ] No TypeScript errors
- [ ] All API endpoints use environment variables
- [ ] `vercel.json` is properly formatted
- [ ] `.env` has VITE_BACKEND_URL set to localhost for testing
- [ ] No console errors in build output

---

## 📤 Deploy Backend First

### Option 1: Vercel Dashboard (Recommended)
1. Go to Vercel Dashboard
2. Select "movies-space-api" project
3. Settings → Git Integration
4. Enable auto-deploy on push
5. Push to GitHub → Auto-deploys!

### Option 2: Vercel CLI
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
cd backend
vercel --prod

# It will:
# - Build your app
# - Deploy to Vercel
# - Give you a production URL
```

### Expected Output
```
✓ Production: https://movies-space-api.vercel.app
```

---

## 📥 Deploy Frontend After Backend

### Frontend Deployment Steps
1. Update `movies_space/.env`:
```
VITE_BACKEND_URL=https://movies-space-api.vercel.app
```

2. Commit and push:
```bash
cd movies_space
git add .env
git commit -m "Update backend URL for production"
git push
```

3. Deploy:
```bash
cd movies_space
vercel --prod
```

### Expected Output
```
✓ Production: https://movies-space.vercel.app
```

---

## 🧪 Post-Deployment Testing

### Test 1: Check Backend Health
```bash
curl https://movies-space-api.vercel.app/api/health
```

**Expected Response:**
```json
{
  "status": "Backend server is running",
  "environment": "production",
  "database": "connected",
  "timestamp": "2026-02-03T..."
}
```

### Test 2: Test User Registration
```bash
curl -X POST https://movies-space-api.vercel.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123!"}'
```

**Expected Response:**
```json
{
  "accessToken": "eyJhbGc...",
  "refreshToken": "eyJhbGc...",
  "user": { "id": "...", "email": "test@example.com" }
}
```

### Test 3: Test User Login
```bash
curl -X POST https://movies-space-api.vercel.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123!"}'
```

### Test 4: Test Video Search
```bash
curl "https://movies-space-api.vercel.app/api/videos?q=action&genre=Action&page=1&limit=10"
```

### Test 5: Verify Frontend Loads
Visit: https://movies-space.vercel.app

- Should see the app interface
- No console errors (F12 → Console)
- Network tab shows successful API calls

### Test 6: Test Full Authentication Flow
1. Navigate to https://movies-space.vercel.app
2. Register new account
3. Should redirect to dashboard
4. Search for videos
5. Click logout

---

## 🐛 Troubleshooting

### Backend Shows "Cannot Find Module"
**Cause**: Dependencies not installed  
**Fix**:
```bash
cd backend
npm install
git add package-lock.json
git push
```

### "CORS Error" in Frontend
**Cause**: VITE_BACKEND_URL not set or incorrect  
**Fix**:
1. Check `.env` in Vercel dashboard
2. Make sure VITE_BACKEND_URL=https://movies-space-api.vercel.app
3. Redeploy frontend

### "Cannot Connect to MongoDB"
**Cause**: MongoDB connection string invalid or IP not whitelisted  
**Fix**:
1. Test connection string locally: `node -e "const mongoose = require('mongoose'); mongoose.connect(process.env.MONGODB_URI).then(() => console.log('Connected')).catch(e => console.log(e))"`
2. Check MongoDB Atlas → Network Access
3. Ensure IP 0.0.0.0/0 is added (or Vercel's IP)

### "Token Expired During Login"
**Cause**: Clock skew between servers  
**Fix**: Tokens expire in 7 days, this shouldn't happen on first login
- Check server time is correct
- Verify JWT_SECRET environment variable

### "500 Internal Server Error"
**Cause**: Various issues  
**Fix**:
1. Check Vercel deployment logs
2. Look for error messages
3. Verify all environment variables are set
4. Test endpoint locally first

---

## 📊 Deployment Monitoring

### Monitor Backend Performance
1. Go to Vercel Dashboard
2. Select "movies-space-api"
3. View "Analytics" tab
4. Check:
   - Response times
   - Error rates
   - Function invocations

### Monitor Frontend Performance
1. Go to Vercel Dashboard
2. Select "movies-space"
3. View "Analytics" tab
4. Check:
   - Page load times
   - Build times
   - Deployment history

---

## 🔒 Post-Deployment Security

### 1. Update MongoDB IP Whitelist
Instead of `0.0.0.0/0`, restrict to Vercel:
1. Get Vercel IP from deployment logs
2. Go to MongoDB Atlas → Network Access
3. Remove `0.0.0.0/0`
4. Add specific Vercel IP

### 2. Update Secrets
In production, use strong values for:
```
JWT_SECRET: Use a cryptographically random 32+ character string
JWT_REFRESH_SECRET: Different 32+ character string
```

Generate with:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 3. Enable HTTPS
- ✅ Vercel automatically provides HTTPS
- ✅ All connections are encrypted
- ✅ No additional setup needed

### 4. Set Response Headers
Already configured in backend:
- ✅ CORS headers
- ✅ Security headers
- ✅ Cache control

---

## 🎯 Final Deployment Flowchart

```
┌─────────────────────────────────────┐
│ 1. Setup Vercel Account             │ ✅
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│ 2. Create Backend Project           │ ⏳
│    (vercel.json, env vars)          │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│ 3. Deploy Backend to Vercel         │ ⏳
│    (movies-space-api.vercel.app)    │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│ 4. Create Frontend Project          │ ⏳
│    (update .env, vercel.json)       │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│ 5. Deploy Frontend to Vercel        │ ⏳
│    (movies-space.vercel.app)        │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│ 6. Test End-to-End Integration      │ ⏳
│    (register, login, search)        │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│ 🎉 DEPLOYMENT COMPLETE!             │ ✅
│ MovieSpace is now LIVE!             │
└─────────────────────────────────────┘
```

---

## 📞 Quick Reference

| Item | Value |
|------|-------|
| **Backend URL** | https://movies-space-api.vercel.app |
| **Frontend URL** | https://movies-space.vercel.app |
| **Database** | MongoDB Atlas (Cloud) |
| **Hosting** | Vercel (Serverless) |
| **Auto-Deploy** | Enabled (on GitHub push) |
| **CI/CD** | Vercel GitHub Integration |
| **SSL/HTTPS** | ✅ Automatic |
| **Environment** | Production |

---

## ✅ Success Criteria

Deployment is successful when:
- ✅ Backend responds to `/api/health`
- ✅ Frontend loads without errors
- ✅ User can register new account
- ✅ User can login
- ✅ Video search returns results
- ✅ Token refresh works on expiry
- ✅ No CORS errors in console
- ✅ All API calls succeed

---

**Phase B2: Production Deployment Guide Complete**

Ready to start deploying? Let's go! 🚀

Next: Create deployment configuration files and begin deployment.
