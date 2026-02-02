# ✅ PHASE B2 DEPLOYMENT QUICK CHECKLIST

**Status**: Ready to Deploy  
**Duration**: 30 minutes to complete  
**Goal**: Get MovieSpace live on Vercel

---

## 🎯 Pre-Deployment (5 minutes)

### GitHub Setup
- [ ] Create GitHub account (if not have)
- [ ] Create repository called `movies-space` or `MovieSpace`
- [ ] Initialize local git:
```bash
cd /path/to/Movies_Space
git init
git add .
git commit -m "MovieSpace - Ready for production"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/movies-space.git
git push -u origin main
```

### Vercel Account
- [ ] Go to vercel.com
- [ ] Sign up (free account works)
- [ ] No payment required

---

## 🚀 Backend Deployment (10 minutes)

### Step 1: Connect Repository to Vercel
```
1. Go to https://vercel.com/dashboard
2. Click "Add New..." → "Project"
3. Import "movies-space" repository
4. Select "Other" framework (Node.js)
```

### Step 2: Configure Backend Settings
```
Root Directory: backend/
Build Command: npm install
Start Command: node server.js
Environment Variables: (See below)
```

### Step 3: Add Environment Variables
In Vercel Dashboard → Settings → Environment Variables:

```
Name: MONGODB_URI
Value: mongodb+srv://shakyalabs:Mydream%40123@cluster0.efs3fjh.mongodb.net/?appName=Cluster0

Name: JWT_SECRET
Value: your-super-secret-jwt-key-change-in-production

Name: JWT_EXPIRE
Value: 7d

Name: JWT_REFRESH_SECRET
Value: your-super-secret-refresh-key-change-in-production

Name: JWT_REFRESH_EXPIRE
Value: 30d

Name: VITE_GOOGLE_APPS_SCRIPT_URL
Value: https://script.google.com/macros/s/AKfycbzawsuEIM6TYV7p_7w9L4A1Dk08ORLIg-53c1ouXK-QiLAUHAy3GA8I6TaKvC3JbQh6ow/exec

Name: NODE_ENV
Value: production
```

### Step 4: Deploy
```
Click "Deploy" button
Wait 2-3 minutes
Get your backend URL: https://movies-space-api.vercel.app
```

### Step 5: Test Backend
```bash
curl https://movies-space-api.vercel.app/api/health
# Should return status: "Backend server is running"
```

---

## 🎨 Frontend Deployment (10 minutes)

### Step 1: Update Frontend .env
Edit `movies_space/.env`:
```
VITE_BACKEND_URL=https://movies-space-api.vercel.app
VITE_GOOGLE_APPS_SCRIPT_URL=https://script.google.com/macros/s/AKfycbzawsuEIM6TYV7p_7w9L4A1Dk08ORLIg-53c1ouXK-QiLAUHAy3GA8I6TaKvC3JbQh6ow/exec
VITE_ADMIN_EMAIL=admin@moviespace.app
```

### Step 2: Commit Changes
```bash
cd movies_space
git add .env
git commit -m "Update backend URL for production"
git push
```

### Step 3: Create Frontend Project in Vercel
```
1. Go to https://vercel.com/dashboard
2. Click "Add New..." → "Project"
3. Import "movies-space" repository again
4. This time select "movies_space" root directory
```

### Step 4: Configure Frontend Settings
```
Root Directory: movies_space/
Framework: Vite
Build Command: npm run build
Install Command: npm install
Output Directory: dist
```

### Step 5: Deploy
```
Click "Deploy" button
Wait 2-3 minutes
Get your frontend URL: https://movies-space.vercel.app
```

### Step 6: Test Frontend
```
Visit https://movies-space.vercel.app
Should see the app interface
```

---

## 🧪 Post-Deployment Testing (5 minutes)

### Test 1: Backend Health
```bash
curl https://movies-space-api.vercel.app/api/health
```
✅ Expected: `{"status":"Backend server is running"}`

### Test 2: User Registration
Visit https://movies-space.vercel.app
- Click "Register"
- Enter: test@example.com / TestPass123!
- Should create account and show dashboard

### Test 3: Video Search
- In dashboard, search for "action"
- Should show video results
- Try different genres
- Check pagination

### Test 4: Logout & Login
- Click logout
- Login with same credentials
- Should work

---

## 🐛 Quick Troubleshooting

| Issue | Solution |
|-------|----------|
| **Backend returns 404** | vercel.json file not found or incorrect |
| **Frontend shows blank page** | VITE_BACKEND_URL not set in .env |
| **CORS errors** | Check backend CORS middleware in server.js |
| **Cannot connect to MongoDB** | Whitelist 0.0.0.0/0 in MongoDB Atlas Network Access |
| **Token refresh fails** | Check JWT_SECRET environment variable is set |

---

## 📊 Final URLs

**When deployment is complete:**

| Service | URL |
|---------|-----|
| **Frontend** | https://movies-space.vercel.app |
| **Backend API** | https://movies-space-api.vercel.app |
| **Health Check** | https://movies-space-api.vercel.app/api/health |
| **API Docs** | https://movies-space-api.vercel.app/api/videos |

---

## ✅ Success Indicators

Deployment is successful when:
- ✅ Backend responds to `/api/health`
- ✅ Frontend loads at vercel.app URL
- ✅ Can register new user
- ✅ Can login with credentials
- ✅ Can search videos
- ✅ No CORS errors in browser console
- ✅ Tokens persist on page refresh

---

## 🔄 Automatic Deployments

After initial setup, deployments happen automatically:
1. Make changes locally
2. Push to GitHub
3. Vercel auto-detects changes
4. Automatically deploys within 1-2 minutes
5. No manual deployment needed

---

## 📞 Need Help?

**Backend Issues**: Check `vercel.json` in backend folder  
**Frontend Issues**: Check `vercel.json` in movies_space folder  
**Database Issues**: Check MongoDB Atlas Network Access settings  
**API Issues**: Check environment variables in Vercel dashboard

---

**Time Estimate**: 30 minutes from start to live  
**Difficulty**: 🟢 Easy (following this guide)  
**Next Step**: Phase B3 (Complete System Testing)

Ready? Let's deploy! 🚀
