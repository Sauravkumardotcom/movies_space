# Vercel Deployment - Quick Reference Card

## ✅ Copy-Paste Settings

### In Vercel Dashboard:

```
ROOT DIRECTORY:       . (dot - repository root)
BUILD COMMAND:        cd movies_space && npm run build
OUTPUT DIRECTORY:     movies_space/dist
INSTALL COMMAND:      npm install
NODE VERSION:         20.x
```

### Environment Variables (in Vercel Settings):

```
VITE_API_BASE_URL = https://your-backend-api.com/api
VITE_GOOGLE_APPS_SCRIPT_URL = https://script.google.com/macros/d/YOUR_ID/usercontent
VITE_ADMIN_EMAIL = admin@gmail.com
```

---

## 📁 Repository Structure (What Vercel Needs)

```
Movies_Space/                   ← Repository Root (.) 
├── vercel.json                 ← Auto-detected ✓
├── movies_space/               ← App source code
│   ├── src/
│   ├── dist/                   ← Built output ✓
│   ├── package.json
│   └── vite.config.js
└── ...other files
```

---

## 🚀 Step-by-Step Process

### 1. Go to Vercel.com
- Dashboard → Add New → Project

### 2. Import Git Repository
- Select `movies_space` repo from GitHub
- Click Import

### 3. Configure Build Settings
- **Framework Preset:** Vite ✓
- **Root Directory:** `.` (leave as default) ✓
- **Build Command:** `cd movies_space && npm run build`
- **Output Directory:** `movies_space/dist`

### 4. Set Environment Variables
- Go to Settings → Environment Variables
- Add the 3 variables (see above)

### 5. Click "Deploy"
- Wait 1-3 minutes
- Get your URL!

---

## ⚙️ What Each Path Does

| Path | Purpose | Type |
|------|---------|------|
| `.` | Tells Vercel to look here for vercel.json | Root |
| `cd movies_space` | Changes to app folder | Command |
| `npm run build` | Builds React app with Vite | Command |
| `movies_space/dist` | Where built files go | Output |

---

## ✨ Already Configured Files

### `vercel.json` (Already in root)
✓ Build command set to `cd movies_space && npm run build`
✓ Output directory set to `movies_space/dist`
✓ SPA routing rewrites configured
✓ Environment variables linked

**You just need to:**
1. Set root directory to `.` in Vercel UI
2. Add environment variables
3. Click Deploy

---

## 🔍 Verify Locally First

```bash
cd C:\Users\Saurav\OneDrive\Desktop\Movies_Space
cd movies_space
npm install
npm run build
npm run preview
```

If this works locally, it will work on Vercel!

---

## 📊 Build Output Should Look Like:

```
✓ 2203 modules transformed.
dist/index.html                 0.79 kB
dist/assets/index-XXXX.css      77.63 kB
dist/assets/framer-XXXX.js      119.13 kB
dist/assets/index-XXXX.js       277.15 kB
✓ built in 5m 10s
```

---

## 🎯 Post-Deploy Testing

1. ✅ Visit your Vercel URL
2. ✅ Search for a movie
3. ✅ Click on a movie card
4. ✅ Open modals
5. ✅ Check mobile view
6. ✅ Open DevTools → Console (should be empty)

---

## 🆘 Common Issues & Fixes

| Issue | Fix |
|-------|-----|
| Build fails | Check `movies_space/package.json` exists |
| Blank page | Verify `vercel.json` has correct paths |
| API errors | Set `VITE_API_BASE_URL` env var |
| CSS not loading | Check `movies_space/dist/` exists |

---

## 📱 Result

- **URL Format:** `https://your-project-name.vercel.app`
- **Preview URL:** Available for each branch
- **Auto-Deploy:** Every git push to main → auto-deploys
- **Production:** Instant after successful build

---

**Ready to deploy? Go to Vercel Dashboard now!** 🚀

