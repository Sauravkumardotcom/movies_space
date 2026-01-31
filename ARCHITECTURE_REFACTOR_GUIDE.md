# MovieSpace Architecture Refactor - Complete Guide

## Overview

MovieSpace has been refactored to remove backend dependencies for email and Google Sheets integration. All functionality now runs directly from the frontend using third-party services.

## New Architecture

```
┌─────────────────────────────────────────────────────────┐
│                      Frontend (React)                   │
│  ┌──────────────────────────────────────────────────┐   │
│  │                Email Service                     │   │
│  │  - Sends confirmation emails via EmailJS        │   │
│  │  - Sends admin notifications                    │   │
│  └──────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────┐   │
│  │            Google Sheets Service                │   │
│  │  - Stores user data via Apps Script             │   │
│  │  - Stores movie data via Apps Script            │   │
│  │  - Stores requests via Apps Script              │   │
│  └──────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
           │                              │
           ▼                              ▼
    ┌─────────────┐            ┌──────────────────────┐
    │  EmailJS    │            │ Google Apps Script   │
    │  (Email)    │            │ (Data Storage)       │
    └─────────────┘            └──────────────────────┘
           │                              │
           ▼                              ▼
    ┌─────────────┐            ┌──────────────────────┐
    │   Gmail     │            │   Google Sheets      │
    │  (Sends     │            │   (Data)             │
    │  Emails)    │            │                      │
    └─────────────┘            └──────────────────────┘
```

## What Changed

### ✅ Backend (Simplified)

**Before:**
- Stored user data in Google Sheets via `appendRowToSheet()`
- Sent emails using Nodemailer with SMTP configuration
- Required environment variables for email credentials
- Complexity: High

**After:**
- Basic Express server for health checks only
- No email sending logic
- No Google Sheets integration
- Simplified dependencies (removed: nodemailer)
- Complexity: Low

### ✅ Frontend (Enhanced)

**Before:**
- Called backend endpoints for emails
- Called backend endpoints for Google Sheets storage

**After:**
- Direct integration with EmailJS for emails
- Direct integration with Google Apps Script for data storage
- No dependency on backend availability for these features
- Better performance (no round trip through backend)

## Services

### 1. Email Service (`src/services/emailService.js`)

**What it does:**
- Sends movie request confirmation emails
- Sends admin notifications
- Supports demo mode when EmailJS is not configured

**Configuration needed:**
```env
VITE_EMAILJS_PUBLIC_KEY=your_key
VITE_EMAILJS_SERVICE_ID=your_service
VITE_EMAILJS_REQUEST_TEMPLATE_ID=your_template
VITE_EMAILJS_ADMIN_TEMPLATE_ID=your_admin_template
VITE_ADMIN_EMAIL=admin@example.com
```

**Usage:**
```javascript
import { emailService } from '@/services/emailService';

await emailService.sendRequestConfirmationEmail({
  name: 'John Doe',
  email: 'john@example.com',
  title: 'Inception',
  type: 'movie',
  reason: 'Great sci-fi movie'
});
```

### 2. Google Sheets Service (`src/services/sheetService.js`)

**What it does:**
- Stores user registration data
- Stores movie/video information
- Stores movie requests
- Calls Google Apps Script web endpoint

**Configuration needed:**
```env
VITE_GOOGLE_APPS_SCRIPT_URL=https://script.google.com/macros/d/YOUR_SCRIPT_ID/usercontent
```

**Usage:**
```javascript
import { storeUser, storeMovie, storeMovieRequest } from '@/services/sheetService';

// Store user
await storeUser({
  name: 'John Doe',
  email: 'john@example.com',
  registeredAt: new Date().toISOString()
});

// Store movie
await storeMovie({
  title: 'Inception',
  videoUrl: 'https://...',
  addedBy: 'admin',
  addedAt: new Date().toISOString()
});

// Store movie request
await storeMovieRequest({
  name: 'John Doe',
  email: 'john@example.com',
  title: 'Inception',
  type: 'movie',
  message: 'Great sci-fi movie',
  requestedAt: new Date().toISOString()
});
```

## Setup Instructions

### Step 1: Set Up Google Apps Script

See: [GOOGLE_APPS_SCRIPT_SETUP.md](./GOOGLE_APPS_SCRIPT_SETUP.md)

1. Create a Google Sheet
2. Create Apps Script project
3. Deploy as Web App
4. Copy the deployment URL

### Step 2: Set Up EmailJS

See: [EMAILJS_SETUP_GUIDE.md](./EMAILJS_SETUP_GUIDE.md)

1. Create EmailJS account
2. Connect email service (Gmail)
3. Create email templates
4. Get API credentials

### Step 3: Update Frontend Configuration

1. Copy `.env.example` to `.env`
2. Fill in the values:
   ```env
   VITE_GOOGLE_APPS_SCRIPT_URL=https://script.google.com/...
   VITE_EMAILJS_PUBLIC_KEY=your_key
   VITE_EMAILJS_SERVICE_ID=your_service
   VITE_EMAILJS_REQUEST_TEMPLATE_ID=your_template
   VITE_EMAILJS_ADMIN_TEMPLATE_ID=your_admin_template
   VITE_ADMIN_EMAIL=your@email.com
   ```

### Step 4: Install Dependencies

```bash
cd movies_space
npm install
```

### Step 5: Test

```bash
npm run dev
```

## Demo Mode

Both services support demo mode for development/testing:

- **Email Service**: If `VITE_EMAILJS_PUBLIC_KEY` is not configured, emails are logged to console
- **Google Sheets Service**: If `VITE_GOOGLE_APPS_SCRIPT_URL` is not configured, data is logged to console

## Benefits

✅ **Simplified Backend**: Only handles API endpoints, no complex logic
✅ **Cost Effective**: Use free tiers of EmailJS (200 emails/month) and Google Apps Script
✅ **Better Performance**: No round-trip through backend for emails/sheets
✅ **Easier Deployment**: Frontend can be deployed to any static host (Vercel, Netlify, etc.)
✅ **Scalable**: Can easily upgrade services when needed
✅ **Maintenance**: Less code to maintain on backend

## Production Considerations

### Security

⚠️ **Important**: The current setup makes your Google Sheet publicly writable. For production:

1. **Add Authentication**: Validate user identity before storing data
2. **Rate Limiting**: Prevent abuse by limiting requests per user
3. **Input Validation**: Sanitize data before storing in Google Sheets
4. **Access Control**: Use Google Sheets sharing settings appropriately
5. **Upgrade Services**: Move to paid plans for better support

### Email Service

- Upgrade EmailJS to paid plan for more emails
- Use a domain email instead of personal Gmail
- Implement proper email validation
- Monitor bounce rates

### Google Sheets

- Consider moving to Firebase for real-time capabilities
- Add backup strategies
- Implement data retention policies
- Use service accounts for sensitive operations

## Troubleshooting

### Emails not sending
- Check EmailJS credentials in `.env`
- Verify email templates exist
- Look at browser console for errors
- Check EmailJS activity dashboard

### Data not storing in Google Sheets
- Verify Apps Script URL in `.env`
- Check Google Sheets column headers match script
- Look at browser console for errors
- Check Apps Script logs for errors

### CORS Issues
- Ensure Apps Script deployment is set to "Anyone"
- Check browser console for specific errors
- Verify service IDs and URLs are correct

## Rollback to Backend

If you need to go back to backend email/sheets handling:

1. Restore original `server.js` with email and sheets logic
2. Re-add `nodemailer` to backend `package.json`
3. Update frontend to call backend endpoints instead
4. Run `npm install` in both frontend and backend

## Files Modified

- `backend/server.js` - Simplified to basic Express server
- `backend/package.json` - Removed nodemailer
- `movies_space/src/services/emailService.js` - Updated to use EmailJS
- `movies_space/src/services/sheetService.js` - Updated to use Apps Script
- `movies_space/package.json` - Added @emailjs/browser
- `movies_space/.env.example` - New configuration template

## New Documentation Files

- `GOOGLE_APPS_SCRIPT_SETUP.md` - Complete Google Apps Script setup guide
- `EMAILJS_SETUP_GUIDE.md` - Complete EmailJS setup guide
- `ARCHITECTURE_REFACTOR_GUIDE.md` - This file

## Next Steps

1. Follow the setup guides to configure EmailJS and Google Apps Script
2. Update `.env` with your credentials
3. Test the email and data storage functionality
4. Deploy to production
5. Monitor usage and upgrade services as needed

## Support & Resources

- [EmailJS Docs](https://www.emailjs.com/docs/)
- [Google Apps Script Docs](https://developers.google.com/apps-script)
- [Google Sheets API](https://developers.google.com/sheets/api)
- [Vite Env Variables](https://vitejs.dev/guide/env-and-mode)

---

## Summary

Your MovieSpace application is now **simpler, faster, and more scalable** with:
- ✅ Simplified backend (just Express + CORS)
- ✅ Frontend-based email sending (EmailJS)
- ✅ Frontend-based data storage (Google Apps Script)
- ✅ Zero backend email/database complexity
- ✅ Easy to deploy and maintain

Happy coding! 🎬
