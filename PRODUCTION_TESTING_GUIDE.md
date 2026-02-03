# Production Testing Guide - MovieSpace CORS & Integration

## Current Status
- ✅ Code changes committed and pushed to GitHub
- 🔄 Backend redeploying to Vercel (should complete in ~2-3 minutes)
- ⏳ Ready for immediate testing once deployment finishes

---

## Phase 1: Verify Deployment (Every 30 seconds until success)

### Test 1A: Check Backend Health
```bash
# In Terminal/PowerShell:
Invoke-WebRequest -Uri "https://backend-j1vfaetyi-saurav-kumars-projects-11451f66.vercel.app/api/health" | Select-Object StatusCode, @{Name="Body"; Expression={$_.Content}}
```

**Expected Response (after deployment completes):**
```json
{
  "status": "Backend server is running",
  "environment": "production",
  "database": "connected",
  "timestamp": "2026-02-03T08:15:00.000Z"
}
```

**Status Codes:**
- 200 = ✅ Backend is ready
- 401 = ⏳ Still deploying (wait 30 sec and retry)
- 500 = ❌ Error occurred (check logs)

### Test 1B: Check Frontend Deployment
```bash
Invoke-WebRequest -Uri "https://movies-space-brown.vercel.app" | Select-Object StatusCode
```
Expected: 200 ✅

---

## Phase 2: CORS Preflight Verification

Once backend returns 200 status:

### Test 2A: OPTIONS Preflight for Send-Email
```bash
$headers = @{
    "Origin" = "https://movies-space-brown.vercel.app"
    "Access-Control-Request-Method" = "POST"
    "Access-Control-Request-Headers" = "content-type,authorization"
}
Invoke-WebRequest -Uri "https://backend-j1vfaetyi-saurav-kumars-projects-11451f66.vercel.app/api/send-email" -Method OPTIONS -Headers $headers -Verbose
```

**SUCCESS Indicators:**
- Status Code: 200 ✅
- Response Headers include:
  ```
  access-control-allow-origin: https://movies-space-brown.vercel.app
  access-control-allow-methods: GET,POST,PUT,DELETE,PATCH,OPTIONS
  access-control-allow-headers: Content-Type,Authorization,X-Requested-With,Accept
  access-control-max-age: 86400
  ```

### Test 2B: OPTIONS Preflight for Other Endpoints
```bash
# Test /api/auth/login
$headers = @{
    "Origin" = "https://movies-space-brown.vercel.app"
    "Access-Control-Request-Method" = "POST"
}
Invoke-WebRequest -Uri "https://backend-j1vfaetyi-saurav-kumars-projects-11451f66.vercel.app/api/auth/login" -Method OPTIONS -Headers $headers
```

Expected: Same CORS headers as above ✅

---

## Phase 3: Frontend Testing

### Test 3A: Open Frontend and Check Console
1. Open: https://movies-space-brown.vercel.app
2. Press F12 to open DevTools
3. Go to **Console** tab
4. **Expected**: NO error messages (clear console) ✅

### Test 3B: Test Authentication Flow
```
Steps:
1. Click "Register" or navigate to login
2. Enter test credentials:
   - Email: testuser@example.com
   - Password: TestPassword123!
3. Click Register
4. Check Console: Should have NO "Network Error" or CORS errors
5. Check Network tab: POST /api/auth/register should return 200/201 ✅
```

### Test 3C: Test Video Search
```
Steps:
1. Login (if not already)
2. Go to Search page
3. Type any movie name (e.g., "Inception")
4. Click Search
5. Check Console: Should have NO errors
6. Check Network tab: GET /api/search?q=Inception should return 200 ✅
7. Videos should display on page
```

### Test 3D: Test Email Endpoint
```
Steps:
1. Login to your account
2. Look for a feature that sends email (registration confirmation, contact form, etc.)
3. If no UI for it, test via browser console:
   ```javascript
   fetch('https://backend-j1vfaetyi-saurav-kumars-projects-11451f66.vercel.app/api/send-email', {
     method: 'POST',
     headers: {
       'Content-Type': 'application/json',
     },
     body: JSON.stringify({
       email: 'souravshakya951@gmail.com',
       subject: 'Test Email',
       message: 'This is a test email from MovieSpace'
     })
   })
   .then(r => r.json())
   .then(d => console.log('Response:', d))
   .catch(e => console.error('Error:', e))
   ```
4. Check response: Should be `{success: true, message: "Email sent successfully"}`
5. Check inbox: Email should arrive ✅
```

---

## Phase 4: Browser Network Tab Inspection

1. Open DevTools (F12)
2. Go to **Network** tab
3. Perform any action that calls backend
4. **For each request**, verify:

   | Field | Should Be | Example |
   |-------|-----------|---------|
   | Status | 200/201 | ✅ |
   | Type | xhr/fetch | ✅ |
   | Time | < 2000ms | ✅ |
   | Response Headers | Include CORS headers | ✅ |
   | Content | Valid JSON/data | ✅ |

### Critical Headers to Verify (for all requests):
```
✅ Access-Control-Allow-Origin: https://movies-space-brown.vercel.app
✅ Access-Control-Allow-Credentials: true
✅ Content-Type: application/json
❌ NO error codes in status
❌ NO CORS error in Network tab
```

---

## Phase 5: Full Application Testing

### Test 5A: User Registration & Login
```
✅ Register with new email
✅ Login with registered credentials
✅ Token stored in localStorage
✅ No console errors
✅ Redirects to dashboard/home
```

### Test 5B: Search & Video Display
```
✅ Search returns results
✅ Videos display with thumbnails
✅ Play button works
✅ Video player launches
✅ No network errors
```

### Test 5C: Google Drive Integration (if available)
```
✅ Upload to Google Drive works
✅ Fetch from Google Drive works
✅ No CORS errors in console
```

### Test 5D: Sheet Integration (if available)
```
✅ Save to sheets works
✅ Fetch from sheets works
✅ No errors in response
```

---

## Troubleshooting

### If you see "CORS error" still:

1. **Hard refresh frontend**: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
2. **Clear browser cache**: 
   - Chrome: Ctrl+Shift+Delete
   - Select "Cached images and files"
   - Click Clear
3. **Check backend deployment**:
   - Go to https://vercel.com/dashboard
   - Check if new deployment shows "Ready" ✅
   - If not ready, wait longer
4. **Check environment variables**:
   - In frontend `.env`: VITE_BACKEND_URL should match deployed URL
   - In backend `.env`: VITE_GOOGLE_APPS_SCRIPT_URL should be set

### If you see "Network Error" but no CORS message:
- This usually means the preflight passed ✅
- Check your request body/parameters
- Check if endpoint exists
- Review console error for details

### If backend still returns 401:
- Deployment still in progress
- Wait 1-2 more minutes
- Refresh page
- Check Vercel dashboard for deployment status

---

## Success Checklist

- [ ] Backend /api/health returns 200 ✅
- [ ] Frontend loads without CORS errors ✅
- [ ] OPTIONS preflight returns CORS headers ✅
- [ ] Can register new user ✅
- [ ] Can login ✅
- [ ] Can search videos ✅
- [ ] Can send email ✅
- [ ] Browser console is clean ✅
- [ ] No "Network Error" messages ✅
- [ ] All features work in production ✅

---

## Commands Summary

### Quick Test Script (run in PowerShell):
```powershell
# Test 1: Backend Health
Write-Host "Testing backend health..." -ForegroundColor Cyan
$health = Invoke-WebRequest -Uri "https://backend-j1vfaetyi-saurav-kumars-projects-11451f66.vercel.app/api/health" -ErrorAction SilentlyContinue
if ($health.StatusCode -eq 200) {
    Write-Host "✅ Backend is ready!" -ForegroundColor Green
} else {
    Write-Host "⏳ Still deploying or error occurred" -ForegroundColor Yellow
}

# Test 2: CORS Preflight
Write-Host "Testing CORS preflight..." -ForegroundColor Cyan
$cors = Invoke-WebRequest -Uri "https://backend-j1vfaetyi-saurav-kumars-projects-11451f66.vercel.app/api/send-email" -Method OPTIONS -Headers @{"Origin"="https://movies-space-brown.vercel.app"} -ErrorAction SilentlyContinue
if ($cors.Headers['Access-Control-Allow-Origin']) {
    Write-Host "✅ CORS is working!" -ForegroundColor Green
} else {
    Write-Host "❌ CORS still failing" -ForegroundColor Red
}
```

### Node.js Test (run in Terminal):
```bash
node test-cors.js
```

---

## When Everything Works ✨

You'll see:
- ✅ No CORS errors in console
- ✅ All API calls return data
- ✅ No "Network Error" messages
- ✅ Smooth user experience
- ✅ Features working as expected
- ✅ Production-ready application

---

**Estimated Time**: ~15-20 minutes from deployment start to all tests passing

**Current Status**: 🔄 Backend redeploying (wait ~2-3 minutes, then start Phase 1)

