# Video Playback Troubleshooting Guide

## Issue: "NotSupportedError: The element has no supported sources"

This error occurs when the HTML5 `<video>` element cannot load or play the video. There are several potential causes and solutions.

---

## **Root Causes**

### 1. **CORS (Cross-Origin Resource Sharing) Error** ⚠️ MOST COMMON
- **Problem**: Video URL is from a different domain and doesn't allow CORS
- **Solution**: Use CORS-enabled video URLs only

### 2. **Invalid Video URL**
- **Problem**: URL doesn't exist or is inaccessible
- **Solution**: Test URL in browser before adding

### 3. **Unsupported Video Format**
- **Problem**: Browser doesn't support codec (usually video not properly encoded)
- **Solution**: Use .mp4 or .webm formats with H.264/VP9 codecs

### 4. **Google Drive Sharing Issue**
- **Problem**: Google Drive file not publicly shared
- **Solution**: Set sharing to "Anyone with link" before getting the ID

---

## **Quick Fixes**

### ✅ Test URL (Copy & Paste)
These URLs are guaranteed to work with CORS enabled:

```
https://commondatastorage.googleapis.com/gtv-videos-library/sample/ForBiggerBlazes.mp4
https://commondatastorage.googleapis.com/gtv-videos-library/sample/ElephantsDream.mp4
https://commondatastorage.googleapis.com/gtv-videos-library/sample/BigBuckBunny.mp4
https://test-streams.mux.dev/x36xhzz/x3zzjsoe.m3u8  (HLS Stream)
```

### ✅ How to Add Video Correctly

1. **For Direct URL:**
   - Open Admin Panel
   - Select "🌐 Direct URL"
   - Paste video URL (must be public & CORS-enabled)
   - Fill other details
   - Click "Add Movie"

2. **For Google Drive:**
   - Open your video file on Google Drive
   - Click "Share" button
   - Change permission to "Anyone with the link"
   - Copy share link: `https://drive.google.com/file/d/[FILE_ID]/view`
   - Extract only the `[FILE_ID]` part
   - Paste into "☁️ Google Drive" field in Admin Panel
   - Click "Add Movie"

---

## **Diagnostic Steps**

### Step 1: Check Browser Console
1. Open DevTools: `F12` or `Right-click → Inspect`
2. Go to "Console" tab
3. Look for error messages like:
   - `Failed to load resource: net::ERR_BLOCKED_BY_RESPONSE`  → CORS issue
   - `Video error: NotSupportedError`  → Format/codec issue
   - `No 'Access-Control-Allow-Origin' header` → CORS blocked

### Step 2: Verify URL is Accessible
1. Copy the video URL from error message
2. Paste into new browser tab
3. If video downloads or plays → URL is good
4. If "Access Denied" or error → URL has CORS issue

### Step 3: Check Video Object
In browser console, run:
```javascript
// Get the video object from store
const store = JSON.parse(localStorage.getItem('moviespace-storage'));
console.log(store.state.customMovies);
```
Look for:
- ✅ `src` property exists
- ✅ `src` is not null/undefined
- ✅ `src` is a valid URL

---

## **CORS Solutions**

### ❌ DON'T USE:
- `https://jio3.fwfiles.cc/*` (blocks CORS)
- `https://drive.google.com/file/d/.../view` (redirects, not direct)
- Streaming services' protected URLs (Netflix, Disney+, etc.)
- Local file paths (`C:/videos/movie.mp4`)

### ✅ DO USE:
- `https://commondatastorage.googleapis.com/*` (Google's test videos)
- `https://example.com/video.mp4` where example.com has CORS enabled
- Direct M3U8/DASH streams with CORS headers
- Your own server (localhost has no CORS restrictions)

### 🔧 Enable CORS on Your Own Server:
If uploading to your own hosting, add CORS headers:
```
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, HEAD, OPTIONS
```

---

## **Google Drive Video Setup**

### Step 1: Upload to Google Drive
1. Sign in to Google Drive
2. Upload your video file (.mp4 preferred)

### Step 2: Share the File
1. Right-click file → "Share"
2. Change sharing settings:
   - Click "Restricted" dropdown
   - Select "Anyone with the link"
   - Copy the link

### Step 3: Extract File ID
Link format: `https://drive.google.com/file/d/[FILE_ID]/view?usp=sharing`

Example:
```
Link: https://drive.google.com/file/d/1aB2cD3eF4gH5iJ6kL7mN8oP9qR0sT1uV/view?usp=sharing
FILE_ID: 1aB2cD3eF4gH5iJ6kL7mN8oP9qR0sT1uV
```

### Step 4: Add to MovieSpace
- Admin Panel → "☁️ Google Drive"
- Paste FILE_ID only (not the full URL)
- Add movie

---

## **Error Messages Explained**

| Error | Cause | Fix |
|-------|-------|-----|
| `NotSupportedError` | Unsupported format or CORS blocked | Use test URL or CORS-enabled source |
| `NetworkError` | URL unreachable | Verify URL is accessible, check internet |
| `MEDIA_ERR_DECODE` | Video codec not supported | Re-encode to H.264 MP4 |
| `MEDIA_ERR_SRC_NOT_SUPPORTED` | No supported sources | Check URL, try test URL |
| `AbortError` | Load interrupted | Usually auto-recovers, try refreshing |

---

## **Working Setup Verification**

### ✅ Test Complete Flow:

1. **Start Services:**
   ```bash
   # Terminal 1: Backend
   cd backend
   npm run dev
   
   # Terminal 2: Frontend
   cd movies_space
   npm run dev
   ```

2. **Test with Provided URL:**
   - Admin Panel → Direct URL
   - Paste: `https://commondatastorage.googleapis.com/gtv-videos-library/sample/ForBiggerBlazes.mp4`
   - Fill other fields
   - Add Movie

3. **Verify Addition:**
   - Go to Home Page
   - Video should appear with poster
   - Refresh page → Video should still exist (localStorage)

4. **Test Playback:**
   - Click on video
   - Video Player should load
   - No errors in console
   - Click play button
   - Video should play

### ✅ Expected Behavior:
- Video loads without "NotSupportedError"
- Play button works
- Timeline seeks properly
- Volume control works
- No CORS errors in console

---

## **Still Not Working?**

### Debug Checklist:
- [ ] Using a test URL from the approved list?
- [ ] Video URL is publicly accessible?
- [ ] No CORS errors in browser console?
- [ ] Backend running on port 5000?
- [ ] Frontend running on port 5173 or 5174?
- [ ] `.env` configured correctly?
- [ ] localStorage not corrupted (clear and retry)?

### Check Video Object:
```javascript
// In browser console:
const store = JSON.parse(localStorage.getItem('moviespace-storage'));
const video = store.state.customMovies[0];
console.log('Video src:', video.src);
console.log('Video posterUrl:', video.poster);
console.log('Video title:', video.title);

// Try accessing the URL directly
fetch(video.src).then(r => console.log('URL accessible:', r.status === 200));
```

### Clear Cache:
1. Go to DevTools → Application → Local Storage
2. Find `moviespace-storage`
3. Delete it
4. Refresh page
5. Try adding video again with test URL

---

## **Still Having Issues?**

1. **Copy the exact error message** from browser console (F12 → Console)
2. **Check if using a test URL:**
   - `https://commondatastorage.googleapis.com/gtv-videos-library/sample/ForBiggerBlazes.mp4`
3. **Verify both servers running:**
   - Backend: `http://localhost:5000` (check by visiting URL)
   - Frontend: `http://localhost:5173` or `5174`
4. **Share the error logs** for troubleshooting

---

## **Reference**

- **Video Formats:** .mp4, .webm, .mov, .mkv (must be web-optimized)
- **Codecs:** H.264 (MP4), VP9 (WebM)
- **Max File Size:** No hard limit, but larger files stream slower
- **CORS Header:** `Access-Control-Allow-Origin: *` or specific domains

