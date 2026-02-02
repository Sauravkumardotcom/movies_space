# 🎬 MovieSpace Vercel Deployment - Step-by-Step Guide

**Visual Guide for Deploying to Vercel**  
**Estimated Time**: 30-45 minutes  
**Difficulty**: Beginner Friendly ✅

---

## 🟢 STEP 1: Prepare Your GitHub Repository

### 1.1 Create GitHub Repository

```
Go to GitHub.com → New Repository

Name: movies-space
Description: Video discovery and streaming platform
Public/Private: Public (easier to deploy)
Initialize: No (we'll add files locally)
```

### 1.2 Connect Local Project to GitHub

```bash
cd /path/to/Movies_Space

# Initialize git
git init

# Add all files
git add .

# Create initial commit
git commit -m "MovieSpace - Production Ready (Phase B2)"

# Rename branch to main
git branch -M main

# Add remote
git remote add origin https://github.com/YOUR_USERNAME/movies-space.git

# Push to GitHub
git push -u origin main
```

**Verify**: Go to GitHub.com → your repo should show all files ✅

---

## 🟢 STEP 2: Create Vercel Account & Login

### 2.1 Sign Up

Visit: https://vercel.com/signup

```
Option 1: Sign up with GitHub (recommended)
- Click "Continue with GitHub"
- Authorize Vercel
- Automatically connected!

Option 2: Sign up with Email
- Enter email
- Create password
- Verify email
```

### 2.2 Verify Connection

After signup, you'll see Vercel Dashboard:
- Should show GitHub account connected
- Can see your repositories

**If not connected**: Go to Settings → Integrations → GitHub → Connect

---

## 🟠 STEP 3: Deploy Backend to Vercel

### 3.1 Create Backend Project

```
Vercel Dashboard → "Add New..." → "Project"
```

### 3.2 Import Repository

```
Select "movies-space" repository
Click "Import"
```

### 3.3 Configure Project

```
Project Name: movies-space-api
Framework: Other (Node.js)
Root Directory: backend/
Build Command: npm install
Start Command: node server.js
```

**Important**: Make sure Root Directory is `backend/` ⚠️

### 3.4 Add Environment Variables

Click "Environment Variables" and add each:

```
1. MONGODB_URI
   mongodb+srv://shakyalabs:Mydream%40123@cluster0.efs3fjh.mongodb.net/?appName=Cluster0

2. JWT_SECRET
   your-super-secret-jwt-key-change-in-production

3. JWT_EXPIRE
   7d

4. JWT_REFRESH_SECRET
   your-super-secret-refresh-key-change-in-production

5. JWT_REFRESH_EXPIRE
   30d

6. VITE_GOOGLE_APPS_SCRIPT_URL
   https://script.google.com/macros/s/AKfycbzawsuEIM6TYV7p_7w9L4A1Dk08ORLIg-53c1ouXK-QiLAUHAy3GA8I6TaKvC3JbQh6ow/exec

7. NODE_ENV
   production
```

### 3.5 Deploy

```
Click "Deploy" button

Wait for:
✓ Building...
✓ Deploying...
✓ Success!

Your backend URL: https://movies-space-api.vercel.app
```

### 3.6 Test Backend

```bash
# Test in terminal
curl https://movies-space-api.vercel.app/api/health

# Should return:
# {"status":"Backend server is running",...}
```

**If error**: Check Vercel logs (click "Function Logs")

---

## 🟠 STEP 4: Prepare Frontend for Deployment

### 4.1 Update Frontend .env File

```
Edit: movies_space/.env

VITE_BACKEND_URL=https://movies-space-api.vercel.app
VITE_GOOGLE_APPS_SCRIPT_URL=https://script.google.com/macros/s/AKfycbzawsuEIM6TYV7p_7w9L4A1Dk08ORLIg-53c1ouXK-QiLAUHAy3GA8I6TaKvC3JbQh6ow/exec
VITE_ADMIN_EMAIL=admin@moviespace.app
```

### 4.2 Commit Changes

```bash
cd movies_space

git add .env
git commit -m "Update backend URL for production deployment"
git push
```

---

## 🟠 STEP 5: Deploy Frontend to Vercel

### 5.1 Create Frontend Project

```
Vercel Dashboard → "Add New..." → "Project"
```

### 5.2 Import Same Repository

```
Select "movies-space" repository again
Click "Import"
```

### 5.3 Configure Frontend Project

```
Project Name: movies-space
Framework: Vite
Root Directory: movies_space/
Build Command: npm run build
Install Command: npm install
Output Directory: dist
Environment Variables: (skip - uses .env)
```

**Important**: Root Directory is `movies_space/` (not backend) ⚠️

### 5.4 Deploy

```
Click "Deploy" button

Wait for:
✓ Building...
✓ Deploying...
✓ Success!

Your frontend URL: https://movies-space.vercel.app
```

---

## 🟢 STEP 6: Verify Both Are Running

### 6.1 Check Backend

```bash
# In terminal
curl https://movies-space-api.vercel.app/api/health

# Expected output:
{
  "status": "Backend server is running",
  "environment": "production",
  "database": "connected",
  "timestamp": "2026-02-03T..."
}
```

### 6.2 Check Frontend

```
Visit: https://movies-space.vercel.app

Expected:
✓ App interface loads
✓ No blank page
✓ Can see search bar
✓ Can see navigation
```

### 6.3 Check Browser Console

```
Open: https://movies-space.vercel.app
Press: F12 (DevTools)
Go to: Console tab

Expected:
✓ No error messages
✓ No CORS errors
✓ No 404 errors
```

---

## 🟢 STEP 7: Test Full Functionality

### Test Registration

```
1. Go to https://movies-space.vercel.app
2. Click "Register" or navigate to /register
3. Fill form:
   Email: test@example.com
   Password: TestPass123!
4. Click "Register"
5. Should see success message
6. Should redirect to dashboard
```

**If error**: Check backend logs in Vercel dashboard

### Test Login

```
1. Click "Logout" (top right)
2. Click "Login"
3. Enter same email/password
4. Should authenticate
5. Should show dashboard
```

### Test Video Search

```
1. In dashboard search bar, type "action"
2. Click search
3. Should show video results
4. Try different searches
5. Try filtering by genre
```

### Test Page Refresh

```
1. While logged in, press F5 (refresh)
2. Should stay logged in (token persists)
3. No need to login again
```

### Test Logout

```
1. Click logout (top right)
2. Should redirect to login
3. localStorage should be cleared
4. Try accessing dashboard without login - blocked ✓
```

---

## 🎯 Final Checklist

Before declaring success, verify:

- [ ] Backend `/api/health` responds
- [ ] Frontend loads at vercel URL
- [ ] No console errors
- [ ] User registration works
- [ ] User login works
- [ ] Video search works
- [ ] Token persists on refresh
- [ ] Logout clears token
- [ ] Can search and filter videos
- [ ] Page speed is acceptable

---

## 🎉 Success!

If all tests pass, congratulations! 🎊

**MovieSpace is now LIVE on:**
- **Frontend**: https://movies-space.vercel.app
- **Backend**: https://movies-space-api.vercel.app

---

## 📊 Deployment Architecture

```
┌─────────────────────────────────────────┐
│         GitHub Repository               │
│  movies-space (both backend & frontend) │
└────┬──────────────────┬─────────────────┘
     │                  │
     ▼                  ▼
┌──────────────┐  ┌──────────────────┐
│  Vercel API  │  │  Vercel Frontend │
│ Backend Proj │  │  Frontend Proj   │
│ on Vercel    │  │ on Vercel        │
└──────┬───────┘  └────────┬─────────┘
       │                   │
       ▼                   ▼
https://             https://
movies-space-api  →  movies-space
.vercel.app         .vercel.app
  │                      │
  └──────┬───────────────┘
         │
         ▼
   MongoDB Atlas
   (Cloud Database)
```

---

## 🚀 Next Steps

After successful deployment:

1. **Phase B3**: Complete system testing
2. **Optimization**: Monitor performance
3. **Custom Domain**: Point your domain to Vercel
4. **SEO**: Add meta tags and Open Graph
5. **Analytics**: Add Google Analytics
6. **Monitoring**: Set up error tracking

---

## 💡 Pro Tips

✅ **Auto-deployments**: Every GitHub push automatically deploys  
✅ **Rollback**: Can quickly revert to previous version  
✅ **Preview URLs**: Get temporary URLs before going live  
✅ **Environment Isolation**: Dev/Staging/Production separate  
✅ **Logs**: Check Vercel logs if something goes wrong

---

## 📞 Troubleshooting

**Backend won't start?**
- Check Vercel logs (click project → "Function Logs")
- Verify all environment variables are set
- Test backend locally first

**Frontend shows blank page?**
- Check browser console (F12)
- Verify VITE_BACKEND_URL is correct
- Check Vercel build logs

**CORS errors?**
- Backend has CORS middleware (should be enabled)
- Check backend/server.js for cors import
- Verify backend URL matches in frontend

**Cannot connect to database?**
- Check MongoDB connection string in environment variables
- Verify IP 0.0.0.0/0 in MongoDB Atlas Network Access
- Test connection locally with same string

---

**Estimated Total Time**: 30-45 minutes  
**Difficulty Level**: 🟢 Beginner Friendly  
**Success Rate**: 95%+ (if following steps)

Let's deploy! 🚀
