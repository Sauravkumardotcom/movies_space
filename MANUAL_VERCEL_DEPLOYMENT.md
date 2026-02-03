# 🚀 PHASE B2: MANUAL VERCEL DEPLOYMENT GUIDE

**Status**: Git repo ready, Vercel CLI installed  
**Next Step**: Deploy via Vercel Web Dashboard (interactive login required)

---

## 📋 OPTION 1: Deploy via Vercel Dashboard (Recommended)

Since CLI interactive login has issues, use the web dashboard instead.

### Backend Deployment

**Step 1: Go to Vercel**
```
1. Open https://vercel.com/dashboard
2. Click "Continue with GitHub"
3. Authorize Vercel to access GitHub
4. Confirm your account
```

**Step 2: Create Backend Project**
```
1. Dashboard → "Add New..." → "Project"
2. Select your GitHub repo: movies_space
3. Click "Continue"
```

**Step 3: Configure Backend**
```
Root Directory: Select "backend/" from dropdown
Framework: Node.js
Build Command: npm install
Start Command: node server.js
```

**Step 4: Set Environment Variables**
Add these 7 variables (copy-paste exactly):

```
Name: MONGODB_URI
Value: mongodb+srv://shakyalabs:Mydream%40123@cluster0.efs3fjh.mongodb.net/?appName=Cluster0

Name: JWT_SECRET
Value: [Generate: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"]

Name: JWT_EXPIRE
Value: 7d

Name: JWT_REFRESH_SECRET
Value: [Generate: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"]

Name: JWT_REFRESH_EXPIRE
Value: 30d

Name: NODE_ENV
Value: production

Name: VITE_GOOGLE_APPS_SCRIPT_URL
Value: https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
```

**Step 5: Deploy**
```
1. Click "Deploy"
2. Wait 3-5 minutes
3. See "Congratulations!" screen
4. Copy your Backend URL:
   https://movies-space-api.vercel.app
   (or custom domain)
```

**Step 6: Verify Backend**
```
Visit: https://movies-space-api.vercel.app/api/health
Should return: { "status": "ok" }
```

---

### Frontend Deployment

**Step 1: Create Frontend Project**
```
1. Dashboard → "Add New..." → "Project"
2. Select same repo: movies_space
3. Click "Continue"
```

**Step 2: Configure Frontend**
```
Root Directory: Select "movies_space/" from dropdown
Framework: Vite
Build Command: npm run build
Output Directory: dist
```

**Step 3: Set Environment Variables**
Add these 3 variables:

```
Name: VITE_BACKEND_URL
Value: https://movies-space-api.vercel.app
(Use your actual backend URL from Step 5)

Name: VITE_GOOGLE_APPS_SCRIPT_URL
Value: https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec

Name: VITE_ADMIN_EMAIL
Value: admin@moviespace.app
```

**Step 4: Deploy**
```
1. Click "Deploy"
2. Wait 2-3 minutes
3. See "Congratulations!" screen
4. Copy your Frontend URL:
   https://movies-space.vercel.app
   (or custom domain)
```

**Step 5: Verify Frontend**
```
1. Visit: https://movies-space.vercel.app
2. App should load
3. Check browser console (F12)
4. No errors should appear
```

---

## 📊 After Deployment

### Environment Setup
```
✓ Git repo on GitHub: https://github.com/Sauravkumardotcom/movies_space
✓ Backend on Vercel: https://movies-space-api.vercel.app
✓ Frontend on Vercel: https://movies-space.vercel.app
✓ Database: MongoDB Atlas (already configured)
```

### What You'll Have
```
Two production URLs:
- Frontend: https://movies-space.vercel.app
- Backend API: https://movies-space-api.vercel.app

Auto-deployment: Every GitHub push → auto-deploys
Scaling: Vercel auto-scales on traffic
SSL: Automatic HTTPS
Monitoring: Vercel dashboard analytics
```

---

## 🧪 Testing Production Deployment

### 1. Test Backend Health
```bash
# Health check
curl https://movies-space-api.vercel.app/api/health

# Expected response:
# { "status": "ok" }
```

### 2. Test Frontend Load
```
Open: https://movies-space.vercel.app
Should see: MovieSpace app loads correctly
Check: Browser console (F12) - no red errors
```

### 3. Test Full Flow
```
1. Register new account
   - Email: test@example.com
   - Password: Test123!

2. Login
   - Should get access token
   - Should get refresh token

3. Search Videos
   - Enter search term
   - Results should display

4. Verify Tokens
   - Open DevTools (F12)
   - Storage → Local Storage
   - Check: accessToken, refreshToken exist

5. Logout & Login Again
   - Should work without issues
```

---

## 📋 Deployment Checklist

Before deploying, verify:
- [ ] Git repo exists: https://github.com/Sauravkumardotcom/movies_space
- [ ] All code committed: `git status` shows "working tree clean"
- [ ] Backend vercel.json exists: `/backend/vercel.json`
- [ ] Frontend vercel.json exists: `/movies_space/vercel.json`
- [ ] MongoDB connection string ready
- [ ] JWT secrets generated (random 32+ chars)
- [ ] Google Apps Script URL ready (if needed)

---

## ✅ Success Criteria

Deployment is successful when:

✅ Backend responds: https://movies-space-api.vercel.app/api/health  
✅ Frontend loads: https://movies-space.vercel.app  
✅ No console errors (F12)  
✅ Registration works  
✅ Login works  
✅ Search works  
✅ Tokens auto-manage  
✅ Can logout and login again  

---

## 🚨 Troubleshooting

### Frontend shows blank page
```
Check: F12 Console for errors
Check: Network tab - all requests
Verify: VITE_BACKEND_URL in Vercel env vars
Verify: Backend is responding
Solution: Refresh page, clear cache
```

### API calls fail
```
Check: Backend health endpoint works
Check: CORS headers in backend
Check: Environment variables set
Check: MongoDB connection
Solution: Check Vercel build logs
```

### Build fails on Vercel
```
Check: Vercel Deployments tab
Click: Failed deployment → Logs
Look for: Missing dependencies, syntax errors
Solution: Push fix to GitHub, auto-redeploy happens
```

### Login not working
```
Check: JWT_SECRET is set on backend
Check: JWT_REFRESH_SECRET is set
Check: MongoDB is running
Check: MONGODB_URI is correct
Solution: Verify in Vercel env vars
```

---

## 🎯 Next Step: Phase B3 Testing

After successful deployment:
- ✅ Phase B1: Frontend Integration (DONE)
- ✅ Phase B2: Deployment (DOING NOW)
- ⏭️ Phase B3: System Testing (NEXT)

Phase B3 will test all 28+ endpoints, user workflows, and edge cases in production.

---

## 📞 Support Resources

**Vercel Docs**: https://vercel.com/docs  
**Vite Docs**: https://vitejs.dev/  
**Express.js Docs**: https://expressjs.com/  
**MongoDB Docs**: https://docs.mongodb.com/  

---

**Instructions**: Follow the Vercel Dashboard steps above to deploy. Report back once both frontend and backend are live! 🚀
