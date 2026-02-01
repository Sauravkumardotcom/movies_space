# Vercel Deployment Guide - Movies Space

## Quick Overview
Movies Space is a React + Vite application with a nested folder structure. The main app is in the `movies_space/` subdirectory.

---

## Step-by-Step Deployment to Vercel

### **Step 1: Prerequisites**
- GitHub account with your repository pushed
- Vercel account (free tier available)
- Git installed locally

### **Step 2: Connect GitHub Repository to Vercel**

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New"** → **"Project"**
3. Click **"Import Git Repository"**
4. Search for and select `movies_space` repository
5. Click **"Import"**

---

## Step 3: Configure Vercel Build Settings

When prompted, configure the following settings:

### **Build Configuration**

| Setting | Value |
|---------|-------|
| **Framework** | Vite |
| **Root Directory** | `.` (root of repository) |
| **Build Command** | `cd movies_space && npm run build` |
| **Output Directory** | `movies_space/dist` |
| **Install Command** | `npm install` |

### **Recommended Settings**

| Setting | Value |
|---------|-------|
| **Node Version** | 20.x (or latest) |
| **Environment** | Production |

---

## Step 4: Set Environment Variables

Add these environment variables in Vercel:

1. Go to **Settings** → **Environment Variables**
2. Add each variable below:

```
VITE_API_BASE_URL = https://your-api-domain.com/api
VITE_GOOGLE_APPS_SCRIPT_URL = https://script.google.com/macros/your-script-id
VITE_ADMIN_EMAIL = admin@yourdomain.com
```

**For local .env file in `movies_space/`:**
```
VITE_API_BASE_URL=http://localhost:3000/api
VITE_GOOGLE_APPS_SCRIPT_URL=https://script.google.com/macros/d/YOUR_SCRIPT_ID/usercontent
VITE_ADMIN_EMAIL=your-email@gmail.com
```

---

## Step 5: File Structure Reference

```
Movies_Space/  (root)
├── vercel.json                    ← Vercel config (optional but helpful)
├── movies_space/                  ← Main React app
│   ├── src/
│   │   ├── Components/
│   │   ├── pages/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   ├── vite.config.js
│   └── dist/                      ← Built files (generated)
├── backend/                       ← (if applicable)
├── api/                           ← (if applicable)
└── README.md
```

---

## Step 6: Deployment Paths

### **For this repository structure:**

| Item | Path |
|------|------|
| **Root Directory** | `.` (repository root) |
| **Source Code** | `movies_space/` |
| **Build Output** | `movies_space/dist/` |
| **Build Command** | `cd movies_space && npm run build` |
| **Dev Command** | `cd movies_space && npm run dev` |

### **Why this structure?**
- Vercel automatically detects `vercel.json` at root
- Build command navigates to `movies_space/` folder
- Dist output is correctly referenced for deployment

---

## Step 7: Deploy

1. Click **"Deploy"** button
2. Wait for build to complete (usually 1-3 minutes)
3. View deployment URL when complete

### **Monitor Build**
- Go to **Deployments** tab
- Click on latest deployment to see logs
- Check for any build errors

---

## Step 8: Post-Deployment Checklist

- [ ] ✅ App loads at Vercel URL
- [ ] ✅ Search functionality works
- [ ] ✅ Movie cards display properly
- [ ] ✅ Modals open/close smoothly
- [ ] ✅ Responsive design works on mobile
- [ ] ✅ Environment variables are set correctly
- [ ] ✅ No console errors in browser
- [ ] ✅ API calls connect to correct backend

---

## Troubleshooting

### **Build Fails: "Cannot find module"**
- Check `cd movies_space && npm run build` runs locally
- Verify all dependencies in `movies_space/package.json`
- Run `npm install` in `movies_space/` folder

### **Build Fails: "Vite build error"**
```bash
# Test locally
cd movies_space
npm run build

# Check for errors
npm run lint
```

### **Blank Page After Deploy**
- Check browser console for errors
- Verify environment variables are set
- Check `index.html` is in `movies_space/dist/`
- Verify routing with SPA rewrite in `vercel.json`

### **API Connection Issues**
- Verify `VITE_API_BASE_URL` environment variable
- Check CORS headers on backend
- Test API endpoint from browser console

---

## vercel.json Reference

The `vercel.json` file in repository root already contains:

```json
{
  "buildCommand": "cd movies_space && npm run build",
  "outputDirectory": "movies_space/dist",
  "devCommand": "cd movies_space && npm run dev",
  "cleanUrls": true,
  "trailingSlash": false,
  "env": {
    "VITE_API_BASE_URL": "@vite_api_base_url",
    "VITE_GOOGLE_APPS_SCRIPT_URL": "@vite_google_apps_script_url",
    "VITE_ADMIN_EMAIL": "@vite_admin_email"
  },
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

This ensures:
- ✅ Correct build directory
- ✅ Correct output location
- ✅ SPA routing (all routes → index.html)
- ✅ Environment variables linked

---

## Custom Domain Setup (Optional)

1. Go to **Settings** → **Domains**
2. Add your custom domain
3. Update DNS records at your domain registrar
4. Wait for DNS propagation (5-48 hours)

---

## Continuous Deployment

Once connected, every `git push` to `main` branch automatically:
1. Triggers a new Vercel build
2. Tests the build
3. Deploys on success
4. Generates preview URLs for branches

---

## Performance Tips

- Use Vercel's **Edge Functions** for API routes (future)
- Enable **Incremental Static Regeneration** (ISR) if needed
- Monitor bundle size in **Analytics** tab
- Use **Image Optimization** for better performance

---

## Key Deployment URLs

| Item | URL |
|------|-----|
| **Vercel Dashboard** | https://vercel.com/dashboard |
| **Your Project** | https://vercel.com/your-username/movies_space |
| **Production URL** | Will be shown after deployment |

---

## Summary

```bash
# Local verification before deployment
cd movies_space
npm install
npm run build    # Should complete with ✓ built in X.XXs
npm run preview  # Test production build locally
```

Your app is now ready for production deployment on Vercel! 🚀

