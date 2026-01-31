# Quick Reference - After Refactoring

## Project Structure

```
Movies_Space/
├── backend/                           # Simplified Express server
│   ├── server.js                      # Basic HTTP server only
│   ├── package.json                   # No nodemailer dependency
│   └── .env                           # Backend config (PORT, FRONTEND_URL)
│
├── movies_space/                      # Frontend React app
│   ├── src/
│   │   ├── services/
│   │   │   ├── emailService.js        # EmailJS integration
│   │   │   ├── sheetService.js        # Google Apps Script integration
│   │   │   └── ...
│   │   └── ...
│   ├── .env                           # Frontend config (EMAIL, SHEETS, etc.)
│   └── package.json                   # Includes @emailjs/browser
│
├── GOOGLE_APPS_SCRIPT_SETUP.md        # How to set up Google Apps Script
├── EMAILJS_SETUP_GUIDE.md             # How to set up EmailJS
├── ARCHITECTURE_REFACTOR_GUIDE.md     # Complete architecture overview
└── REFACTORING_SUMMARY.md             # What changed and how to use it
```

## One-Time Setup

### 1. Google Apps Script (Stores data in Google Sheets)

```
1. Read: GOOGLE_APPS_SCRIPT_SETUP.md
2. Create Google Sheet
3. Go to Tools → Script Editor
4. Paste the provided Apps Script code
5. Deploy as Web App
6. Copy the deployment URL
7. Add to frontend .env: VITE_GOOGLE_APPS_SCRIPT_URL=...
```

### 2. EmailJS (Sends confirmation emails)

```
1. Read: EMAILJS_SETUP_GUIDE.md
2. Go to emailjs.com and create account
3. Connect your email (Gmail recommended)
4. Create email templates:
   - Request confirmation template
   - Admin notification template
5. Get your credentials (Public Key, Service ID, Template IDs)
6. Add to frontend .env:
   - VITE_EMAILJS_PUBLIC_KEY=...
   - VITE_EMAILJS_SERVICE_ID=...
   - etc.
```

### 3. Frontend Environment Setup

```bash
cd movies_space
cp .env.example .env
# Edit .env and fill in the values from step 1 & 2
npm install
```

## Running the Project

### Terminal 1: Backend

```bash
cd backend
npm install  # First time only
npm run dev
# Output: 🚀 MovieSpace Backend Server Running on http://localhost:5000
```

### Terminal 2: Frontend

```bash
cd movies_space
npm install  # First time only
npm run dev
# Output: ➜  Local:   http://localhost:5173/
```

## Testing

1. Open `http://localhost:5173` in browser
2. Make a movie request
3. Check your email for confirmation
4. Check your Google Sheet for stored data
5. Check browser console for demo mode logs (if not configured)

## What Each Service Does

### Backend (`server.js`)
- ✅ Serves API health check: `GET /api/health`
- ✅ Handles CORS for frontend requests
- ⏳ Ready for future API endpoints
- ❌ Does NOT handle emails (moved to frontend)
- ❌ Does NOT handle Google Sheets (moved to frontend)

### Email Service (Frontend)
- ✅ Sends movie request confirmation emails via EmailJS
- ✅ Sends admin notifications
- ✅ Demo mode: logs to console if EmailJS not configured
- ✅ No backend dependency

### Sheets Service (Frontend)
- ✅ Stores user data in Google Sheets via Apps Script
- ✅ Stores movie/video data
- ✅ Stores movie requests
- ✅ Demo mode: logs to console if Apps Script not configured
- ✅ No backend dependency

## Common Issues & Solutions

### "Email not sent"
- [ ] Check VITE_EMAILJS_PUBLIC_KEY in `.env`
- [ ] Check browser console for errors
- [ ] Verify email templates exist in EmailJS
- [ ] Check EmailJS activity dashboard

### "Data not stored in Google Sheets"
- [ ] Check VITE_GOOGLE_APPS_SCRIPT_URL in `.env`
- [ ] Check browser console for errors
- [ ] Verify Apps Script is deployed
- [ ] Check column headers in Google Sheet

### "Still in demo mode?"
- [ ] Make sure `.env` file exists (not `.env.example`)
- [ ] Restart frontend dev server: `npm run dev`
- [ ] Check browser console to see what's missing

### CORS or Connection Errors
- [ ] Make sure backend is running on port 5000
- [ ] Make sure frontend is running on port 5173
- [ ] Check both servers have `npm install` completed

## Environment Variables

### Backend `.env`
```env
PORT=5000
FRONTEND_URL=http://localhost:5173
```

### Frontend `.env`
```env
# Google Apps Script
VITE_GOOGLE_APPS_SCRIPT_URL=https://script.google.com/macros/d/YOUR_ID/usercontent

# EmailJS
VITE_EMAILJS_PUBLIC_KEY=your_key
VITE_EMAILJS_SERVICE_ID=service_xxx
VITE_EMAILJS_REQUEST_TEMPLATE_ID=template_xxx
VITE_EMAILJS_ADMIN_TEMPLATE_ID=template_xxx

# Admin
VITE_ADMIN_EMAIL=your_email@gmail.com
```

## NPM Commands

### Backend
```bash
npm run dev      # Start server with auto-reload
npm start        # Start server
```

### Frontend
```bash
npm run dev      # Start dev server (port 5173)
npm run build    # Build for production
npm run lint     # Run ESLint
npm run preview  # Preview production build
```

## Key Files to Know

| File | Purpose |
|------|---------|
| `backend/server.js` | Main backend server (simplified) |
| `movies_space/src/services/emailService.js` | Email sending logic |
| `movies_space/src/services/sheetService.js` | Data storage logic |
| `movies_space/.env` | Frontend configuration |
| `backend/.env` | Backend configuration |
| `GOOGLE_APPS_SCRIPT_SETUP.md` | How to set up Google Apps Script |
| `EMAILJS_SETUP_GUIDE.md` | How to set up EmailJS |

## Architecture Overview

```
┌──────────────────────────────────────────┐
│         Frontend (React)                 │
│  - User Interface                        │
│  - EmailJS Integration                   │
│  - Google Apps Script Integration        │
└──────────────────────────────────────────┘
           ↓                    ↓
    ┌─────────────┐    ┌──────────────────┐
    │  EmailJS    │    │ Google Apps      │
    │  API        │    │ Script Web App   │
    └─────────────┘    └──────────────────┘
           ↓                    ↓
    ┌─────────────┐    ┌──────────────────┐
    │   Gmail     │    │  Google Sheets   │
    │  (Emails)   │    │  (Data)          │
    └─────────────┘    └──────────────────┘

    Backend (/api/health only)
    ↑
    └─ Used by frontend for health checks
```

## Production Deployment

### Frontend
- Use: Vercel, Netlify, GitHub Pages, or similar
- Build: `npm run build`
- Serves: `dist/` folder

### Backend
- Use: Any Node.js hosting (Heroku, Railway, AWS, etc.)
- Build: Already ready to run
- Start: `npm start` or `npm run dev`

### External Services
- EmailJS: Free tier (200 emails/month) or upgrade
- Google Sheets: Free (unlimited storage)
- Google Apps Script: Free (with quota limits)

## Next Steps

1. ✅ Backend already simplified - ready to run
2. ⏳ Follow `GOOGLE_APPS_SCRIPT_SETUP.md` (15-20 minutes)
3. ⏳ Follow `EMAILJS_SETUP_GUIDE.md` (10-15 minutes)
4. ✅ Update `.env` with credentials
5. ✅ Run `npm install` in frontend
6. ✅ Test the application
7. 🚀 Deploy to production

## Support Resources

- [Google Apps Script Docs](https://developers.google.com/apps-script/docs)
- [EmailJS Docs](https://www.emailjs.com/docs/)
- [Vite Guide](https://vitejs.dev/guide/)
- [Express Docs](https://expressjs.com/)

---

**You're all set!** The refactoring is complete. Now follow the setup guides to configure the external services, then you can start using the app. 🎬
