# 🚀 Complete Vercel Backend Deployment & Frontend Update Guide

## Overview
Deploy a **NEW** backend to Vercel and update your frontend to use it.

**Current Setup:**
- Old Backend: `https://backend-j1vfaetyi-saurav-kumars-projects-11451f66.vercel.app`
- Frontend: `https://movies-space-brown.vercel.app`

---

## ✅ Step 1: Verify Backend is Ready

Your backend has been verified as production-ready. Run:

```bash
cd /workspaces/movies_space
bash deploy-backend.sh
```

Expected output: `✅ Backend is ready for Vercel deployment!`

---

## 🌐 Step 2: Create New Backend Project on Vercel

### Option A: Via Vercel Dashboard (Easiest)

1. **Go to Vercel Dashboard:**
   - https://vercel.com/dashboard

2. **Create New Project:**
   - Click: **"Add New"** → **"Project"**

3. **Import Repository:**
   - Search: `Sauravkumardotcom/movies_space`
   - Click: **"Import"**

4. **Configure Project:**
   - **Project Name:** `moviespace-backend-new` (or your choice)
   - **Root Directory:** `backend`
   - **Framework Preset:** Node.js
   - **Build Command:** Leave empty (uses vercel.json)
   - **Output Directory:** Leave empty

5. **Environment Variables:**
   - Click: **"Environment Variables"**
   - Add these variables from your `.env.production`:
   
   | Variable | Value |
   |----------|-------|
   | `NODE_ENV` | production |
   | `DATABASE_URL` | Your PostgreSQL connection string |
   | `JWT_SECRET` | Your JWT secret |
   | `JWT_REFRESH_SECRET` | Your JWT refresh secret |
   | `EMAIL_USER` | Souravshakya951@gmail.com |
   | `EMAIL_PASS` | nzrwngwreqialorz |
   | `ADMIN_EMAIL` | Souravshakya951@gmail.com |
   | `FRONTEND_URL` | https://movies-space-brown.vercel.app |

6. **Deploy:**
   - Click: **"Deploy"**
   - Wait 2-3 minutes for deployment to complete

7. **Get Your New Backend URL:**
   - Once deployment succeeds, you'll see: `https://your-backend-xxxxx.vercel.app`
   - **Copy this URL** - you'll need it next

---

### Option B: Via Vercel CLI

```bash
cd /workspaces/movies_space/backend
vercel --prod
```

Follow the prompts and you'll get your new URL.

---

## 🔄 Step 3: Update Frontend with New Backend URL

Once you have your new backend URL (e.g., `https://my-new-backend-123.vercel.app`):

### Automated Method (Recommended):

```bash
bash update-frontend.sh https://my-new-backend-123.vercel.app
```

This will:
- ✅ Update `movies_space/.env.production`
- ✅ Commit changes to git
- ✅ Push to GitHub
- ✅ Trigger frontend redeploy on Vercel

---

## ✨ Step 4: Verify Deployment

### Test Backend Health:

```bash
curl https://your-new-backend-xxxxx.vercel.app/api/health
```

Expected response:
```json
{
  "status": "Backend server is running",
  "environment": "production",
  "database": "connected",
  "timestamp": "2026-05-08T..."
}
```

### Test Email Endpoint:

```bash
curl -X POST https://your-new-backend-xxxxx.vercel.app/api/send-email \
  -H "Content-Type: application/json" \
  -H "Origin: https://movies-space-brown.vercel.app" \
  -d '{
    "template": "requestConfirmation",
    "to": "youremail@gmail.com",
    "data": {
      "userName": "Test User",
      "movieTitle": "Test Movie",
      "requestType": "Movie",
      "message": "Testing email"
    }
  }'
```

### Test CORS:

```bash
curl -X OPTIONS https://your-new-backend-xxxxx.vercel.app/api/send-email \
  -H "Origin: https://movies-space-brown.vercel.app" \
  -H "Access-Control-Request-Method: POST" \
  -v
```

Should return: `200 OK` with CORS headers

---

## 📊 Monitoring

**Check Frontend Deployment:**
- https://vercel.com/dashboard → movies-space-brown

**Check Backend Deployment:**
- https://vercel.com/dashboard → your-new-backend

**View Logs:**
- Vercel Dashboard → Project → Deployments → Click deployment → View logs

---

## ✅ Deployment Checklist

- [ ] Backend verified (`bash deploy-backend.sh`)
- [ ] New backend project created on Vercel
- [ ] Environment variables set in Vercel backend project
- [ ] Backend deployment successful
- [ ] New backend URL copied
- [ ] Frontend updated (`bash update-frontend.sh YOUR_URL`)
- [ ] Frontend redeploy triggered
- [ ] Health endpoint tested and returns 200
- [ ] CORS test passed
- [ ] Email endpoint tested

---

## 🆘 Troubleshooting

### Backend Deployment Failed

**Check logs:**
1. Vercel Dashboard → Your backend project
2. Go to "Deployments"
3. Click failed deployment
4. View "Function Logs"

**Common issues:**
- Missing environment variables → Add to Vercel project settings
- Database connection error → Verify `DATABASE_URL` is correct
- Email configuration error → Verify `EMAIL_USER` and `EMAIL_PASS`

### Frontend Not Updating

**Check logs:**
1. Vercel Dashboard → movies-space-brown
2. Go to "Deployments"
3. Check if latest deployment is pending
4. View build logs

**Common issues:**
- Backend URL not updated → Run `bash update-frontend.sh` again
- Git push failed → Check git status with `git status`

### CORS Still Blocked

- Verify `FRONTEND_URL` is set in backend environment variables
- Verify new backend has updated code with enhanced CORS

---

## 📝 Summary

You now have:
- ✅ Production-ready backend verified
- ✅ Deployment automation scripts (`deploy-backend.sh`, `update-frontend.sh`)
- ✅ Step-by-step deployment guide
- ✅ Testing commands
- ✅ Troubleshooting guide

**Ready to deploy?** Follow Steps 1-4 above! 🚀
