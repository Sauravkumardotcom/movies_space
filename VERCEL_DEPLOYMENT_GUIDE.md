# Vercel Deployment Guide - MovieSpace

## Overview
This guide walks you through deploying MovieSpace to Vercel with both frontend (React/Vite) and backend (Express.js) running on serverless functions.

## Deployment Architecture

```
MovieSpace on Vercel
├── Frontend (React/Vite) - Static Build
│   └── https://your-vercel-url.vercel.app
├── Backend API - Serverless Functions
│   └── https://your-vercel-url.vercel.app/api/*
└── Environment Variables
    └── Managed in Vercel Dashboard
```

## Prerequisites

1. **Vercel Account** - Sign up at [vercel.com](https://vercel.com)
2. **GitHub Repository** - Already connected at https://github.com/Sauravkumardotcom/movies_space.git
3. **API Keys/Credentials**:
   - Google Drive API Key
   - Google Drive Folder ID
   - EmailJS Service ID & Template ID

## Step-by-Step Deployment

### Step 1: Connect GitHub to Vercel

1. Go to [vercel.com](https://vercel.com) and log in
2. Click **"Add New..."** → **"Project"**
3. Select **"Import Git Repository"**
4. Search for **`Sauravkumardotcom/movies_space`**
5. Click **"Import"**

### Step 2: Configure Project Settings

1. **Project Name**: `movies-space` (or your preferred name)
2. **Framework**: Select **"Vite"**
3. **Root Directory**: Select **`movies_space`** from dropdown
4. **Build Command**: Leave as default (Vercel will auto-detect)
5. **Output Directory**: Leave as default (should be `dist`)

### Step 3: Add Environment Variables

In the Vercel dashboard, go to **Settings → Environment Variables** and add:

```
VITE_API_BASE_URL=https://your-project-name.vercel.app/api
VITE_GOOGLE_DRIVE_API_KEY=<your_key>
VITE_GOOGLE_DRIVE_FOLDER_ID=<your_folder_id>
VITE_EMAILJS_SERVICE_ID=<your_service_id>
VITE_EMAILJS_TEMPLATE_ID=<your_template_id>
VITE_EMAILJS_PUBLIC_KEY=<your_public_key>
```

**Note**: Mark all as **"Available in Production"** and **"Available in Preview Deployments"**

### Step 4: Deploy

1. Click **"Deploy"**
2. Wait for build to complete (3-5 minutes)
3. Once complete, you'll get a production URL like `https://movies-space-abc123.vercel.app`

### Step 5: Verify Deployment

Test your deployment:

```bash
# Check health endpoint
curl https://your-project-name.vercel.app/api/health

# Expected response:
# {"status":"ok","timestamp":"2025-01-31T..."}

# Check frontend
# Visit https://your-project-name.vercel.app
# All pages should load correctly
```

## Post-Deployment Checklist

- [ ] Frontend loads at main URL
- [ ] All pages accessible (HomePage, Search, Trending, etc.)
- [ ] React Query DevTools toggle visible (bottom-left)
- [ ] API calls reaching `/api/*` endpoints
- [ ] Google Drive integration working (if configured)
- [ ] EmailJS working (test feedback form)
- [ ] No console errors in DevTools
- [ ] Mobile responsive layout working

## Common Issues & Solutions

### Issue: Build fails with "vite: command not found"
**Solution**: Root directory not set correctly to `movies_space`. Check project settings.

### Issue: API calls failing (CORS errors)
**Solution**: Backend API routes not accessible. Verify `/api` routes exist in `api/index.js`.

### Issue: Environment variables not loading
**Solution**: 
1. Check variable names start with `VITE_` for frontend
2. Redeploy after adding variables
3. Variables take effect on new deployments

### Issue: "Cannot find module" errors
**Solution**: 
1. Clear Vercel cache: Settings → "Git" → Click "Clear All"
2. Redeploy
3. Check `package.json` dependencies are installed

## Updating Deployment

Every push to `main` branch automatically triggers a new deployment:

```bash
# Make local changes
git add .
git commit -m "Your commit message"
git push origin main

# Vercel automatically deploys!
# Check deployment status in Vercel Dashboard → Deployments tab
```

## Custom Domain Setup

1. Go to **Settings → Domains**
2. Add your custom domain (e.g., `moviespace.com`)
3. Follow DNS configuration instructions
4. Wait 24-48 hours for DNS propagation

## Scaling & Performance

### Recommended Vercel Plan Features
- **Pro Plan** for:
  - Unlimited Deployments
  - Faster builds
  - Priority support
  - Environment variables per deployment

### Performance Optimization
- [ ] Enable Edge Caching: Settings → Caching
- [ ] Configure CDN: Vercel uses automatic global CDN
- [ ] Monitor performance: Analytics tab shows performance metrics
- [ ] Check serverless function duration: Functions tab

## Monitoring & Debugging

### Vercel Dashboard
- **Deployments**: See build logs and deployment history
- **Functions**: Monitor serverless function execution
- **Analytics**: Track page performance metrics
- **Logs**: Real-time application logs

### Local Development Before Deploying
```bash
# Test locally with production environment
npm run build
npm run preview

# Should match production behavior exactly
```

## Reverting a Deployment

If something breaks:

1. Go to **Deployments** tab
2. Find the previous working deployment
3. Click **"Redeploy"**
4. Vercel will restore that version

## Database / Persistent Storage

**Current Setup**: No persistent database configured.

To add database later:
- Vercel recommends external services: MongoDB, PostgreSQL, etc.
- Connect via connection string in environment variables
- Examples:
  - **MongoDB**: Use connection string in `.env`
  - **PostgreSQL**: Add `DATABASE_URL` env variable
  - **Firebase**: Add Firebase config

## API Rate Limits

Vercel Serverless Functions have limits:
- **Free Plan**: 100 requests per day
- **Pro Plan**: Unlimited requests
- **Function Timeout**: 10 seconds (pro) / 60 seconds (pro)

Current API routes should run well within limits.

## Cleanup & Maintenance

### Unused Deployments
- Vercel automatically keeps last 100 deployments
- Older ones are archived but can be restored

### Cache Clearing
1. Settings → Git → "Clear All" cache
2. Redeploy

### Environment Variable Management
- Regularly rotate keys/tokens
- Remove unused variables
- Use version control for `.env.example` (not actual `.env`)

## Success Indicators

✅ **Deployment Complete When**:
1. Green checkmark on latest deployment
2. Production URL is live
3. API health endpoint returns `200 OK`
4. Frontend loads without console errors
5. All user flows work (login → search → watch)

## Next Steps

1. **Share deployment URL**: `https://your-project-name.vercel.app`
2. **Configure custom domain** (optional)
3. **Set up monitoring** (recommended)
4. **Add team members**: Invite collaborators in project settings
5. **Monitor performance**: Check Analytics regularly

## Helpful Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)
- [Vercel CLI](https://vercel.com/cli)
- [Troubleshooting Guide](https://vercel.com/support)

## Support

For deployment issues:
1. Check Vercel Deployments tab for build logs
2. Review function logs in Functions tab
3. Check environment variables are set correctly
4. Clear cache and redeploy
5. Contact Vercel support if needed

---

**Status**: Ready for Vercel deployment ✅  
**Last Updated**: January 31, 2025  
**Repository**: https://github.com/Sauravkumardotcom/movies_space.git
