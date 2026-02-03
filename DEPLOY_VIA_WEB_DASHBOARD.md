# 🔄 SWITCHING TO WEB DASHBOARD DEPLOYMENT

The Vercel CLI is having authentication issues with the git author verification. This is a common Vercel issue with team/account access.

**Solution**: Use Vercel Web Dashboard (takes 10 minutes and much more reliable)

## Quick Steps:

### Backend Deployment

1. Open: https://vercel.com/new
2. Click "Continue with GitHub"
3. Select repo: `movies_space`
4. Root Directory: `backend/`
5. Environment Variables:
```
MONGODB_URI=mongodb+srv://shakyalabs:Mydream%40123@cluster0.efs3fjh.mongodb.net/?appName=Cluster0
JWT_SECRET=[GENERATE: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"]
JWT_EXPIRE=7d
JWT_REFRESH_SECRET=[GENERATE: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"]
JWT_REFRESH_EXPIRE=30d
NODE_ENV=production
VITE_GOOGLE_APPS_SCRIPT_URL=https://script.google.com/macros/s/YOUR_ID/exec
```
6. Click "Deploy"
7. Copy the URL (e.g., https://movies-space-api.vercel.app)

### Frontend Deployment

1. Go to: https://vercel.com/dashboard
2. Click "Add New..." → "Project"
3. Select same repo: `movies_space`
4. Root Directory: `movies_space/`
5. Build Command: `npm run build`
6. Output Directory: `dist`
7. Environment Variables:
```
VITE_BACKEND_URL=https://movies-space-api.vercel.app
VITE_GOOGLE_APPS_SCRIPT_URL=https://script.google.com/macros/s/YOUR_ID/exec
VITE_ADMIN_EMAIL=admin@moviespace.app
```
8. Click "Deploy"
9. Get your frontend URL

## ✅ Done!

Both apps will be live on Vercel within 5-10 minutes total.

Then report back and I'll test them! 🚀
