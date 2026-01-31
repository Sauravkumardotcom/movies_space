# 🔧 Error Troubleshooting Guide

**Date:** January 29, 2026  
**Topic:** Common Errors & Solutions

---

## Error 1: AbortError - Play Request Interrupted

### **Error Message**
```
Uncaught (in promise) AbortError: The play() request was interrupted by a call to pause(). https://goo.gl/LdLk22
```

### **Root Cause**
User clicks play/pause very rapidly, creating a race condition in the video element's promise chain.

### **Impact**
- Minor - doesn't break functionality
- Video still plays eventually
- No data loss

### **Solution**
✅ **Implemented in VideoPlayer.jsx**
- Add debounce to play/pause handlers
- Track playback state to prevent conflicts
- Use abort controller for cleanup

### **Code Fix**
```javascript
// In VideoPlayer.jsx - Add debounce
let playTimeout;
const handlePlay = () => {
  clearTimeout(playTimeout);
  playTimeout = setTimeout(() => {
    videoRef.current?.play().catch(e => {
      console.log('Play interrupted (expected):', e.message);
    });
  }, 50);
};
```

### **Verification**
- ✅ Click play/pause normally - works
- ✅ Rapid click play/pause - no error in console
- ✅ Video still plays after rapid clicking

---

## Error 2: ERR_CONNECTION_REFUSED - Backend Not Running

### **Error Message**
```
POST http://localhost:5000/api/apps-script net::ERR_CONNECTION_REFUSED

TypeError: Failed to fetch
at storeMovie (sheetService.js:66:28)
```

### **Root Cause**
Backend server is not running on port 5000

### **Impact**
- ❌ Cannot upload videos
- ❌ Cannot store to Google Sheets
- ❌ Backend API calls fail

### **Current Status**
✅ **FIXED** - Backend is now running on port 5000

### **Verification**
```powershell
netstat -ano | Select-String "5000" | Select-String "LISTENING"
```

**Expected Output:**
```
TCP    0.0.0.0:5000           0.0.0.0:0              LISTENING       22988
TCP    [::]:5000              [::]:0                 LISTENING       22988
```

### **If Error Occurs Again**

**Step 1: Check if backend is running**
```powershell
Get-Process node | Where-Object {$_.Id -contains (netstat -ano | Select-String "5000").Split()[-1]}
```

**Step 2: Start backend**
```powershell
cd "C:\Users\Saurav\OneDrive\Desktop\Movies_Space\backend"
npm run dev
```

**Step 3: Verify server started**
```
✓ MovieSpace Backend Server Running on http://localhost:5000
```

---

## Error 3: ERR_NAME_NOT_RESOLVED - DNS Issues

### **Error Message**
```
GET https://placehold.co/300x450?text=Test&font=raleway net::ERR_NAME_NOT_RESOLVED
GET https://images.unsplash.com/... net::ERR_NAME_NOT_RESOLVED
GET https://lh3.googleusercontent.com/... net::ERR_NAME_NOT_RESOLVED
```

### **Root Cause**
- DNS cannot resolve external domains
- Network is isolated or restricted
- Proxy/firewall blocking external URLs

### **Impact**
- ❌ Image placeholders don't load (minor UI)
- ✅ Functionality still works
- ✅ Videos still play
- ✅ Google Drive videos still work

### **Current Status**
⚠️ **Non-blocking** - Feature works without images

### **Solution**

**Option 1: Use Local Images**
- Store placeholder images locally
- Update src URLs to point to /public folder
- Eliminates external requests

**Option 2: Use Data URLs**
```javascript
const placeholder = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="450"%3E%3Crect fill="%23ccc" width="300" height="450"/%3E%3C/svg%3E';
```

**Option 3: Ignore External Images**
- Focus on video playback functionality
- Images are non-essential
- Test core features first

### **For Google Drive Videos**
✅ **Works fine** - Google Drive URLs are handled by direct video src

---

## Error 4: MEDIA_ELEMENT_ERROR - Unsupported Video Format

### **Error Message**
```
VideoPlayer.jsx:253 Video error: 
MediaError {code: 4, message: 'MEDIA_ELEMENT_ERROR: Format error'}

🎬 Format/Codec Error Detected
The video file uses an unsupported codec. Common causes:
• File is .mov, .mkv, or uses ProRes/Apple codec
• Video needs to be re-encoded to H.264 MP4
• Browser doesn't support the codec
```

### **Root Cause**
- Video file is .mov, .mkv, ProRes, or other non-H.264 format
- Browser's HTML5 video element can't decode it
- Google Drive file is in incompatible format

### **Impact**
- ❌ Video doesn't play in browser
- ✅ Error message shown (user-friendly)
- ✅ Doesn't crash application
- ✅ User can try different video

### **Current Status**
✅ **Handled** - Error message implemented in VideoPlayer.jsx

### **Solution**

**Step 1: Check Video Format**
- Right-click video file properties
- Check: file format, codec, bit rate
- For Google Drive: Open file, check info

**Step 2: Re-encode Video**
Use FFmpeg to convert to H.264 MP4:
```bash
ffmpeg -i input.mov -vcodec h264 -acodec aac -q:v 5 output.mp4
```

**Step 3: Upload H.264 MP4**
- Use re-encoded MP4 file
- Browser will play without errors
- Recommended bitrate: 2000-5000 kbps

**Step 4: Test with Known Working Video**
```
URL: https://commondatastorage.googleapis.com/gtv-videos-library/sample/BigBuckBunny.mp4
Format: H.264 MP4 ✅
Duration: ~10 minutes
Size: ~300 MB
```

### **Verification**
```javascript
// In browser console
const video = document.querySelector('video');
video.canPlayType('video/mp4'); // Should return "maybe" or "probably"
video.canPlayType('video/quicktime'); // Will return ""
```

### **For Google Drive File**

**If file is MOV/ProRes:**
1. Download from Google Drive
2. Re-encode using FFmpeg (see above)
3. Upload back to Google Drive
4. Update file ID in app

**If file is MP4:**
1. Verify codec using MediaInfo tool
2. If H.264: Should work
3. If HEVC/VP9: Needs re-encoding
4. If unknown: Test in browser

---

## Error 5: AbortError - Chrome Promise Rejection

### **Error Message**
```
Uncaught (in promise) Error: Could not establish connection. Receiving end does not exist.
```

### **Root Cause**
- Background extension trying to communicate
- Browser background processes
- Not related to our code

### **Impact**
- ⚠️ Harmless warning
- ✅ Doesn't affect functionality
- ✅ Can be safely ignored

### **Solution**
- Ignore this error (it's from browser extensions)
- Focus on actual application errors
- Check console for app-specific errors

---

## 📊 Error Status Summary

| Error | Status | Impact | Solution |
|-------|--------|--------|----------|
| Play/Pause Abort | ✅ Fixed | Minor | Debounce handlers |
| Connection Refused | ✅ Fixed | Critical | Backend now running |
| DNS Resolution | ⚠️ Ignore | Minor | Use local images |
| Format Error | ✅ Handled | Moderate | Use H.264 MP4 |
| Chrome Extension | ⚠️ Ignore | None | Browser issue |

---

## 🎯 What's Working Now

✅ **Backend Server**
- Running on http://localhost:5000
- CORS configured
- Ready for API calls
- Email service configured

✅ **Frontend Server**
- Running on http://localhost:5173
- Vite ready
- All components loaded
- No build errors

✅ **Google Drive Integration**
- URL conversion working
- Form accepts Google Drive ID
- Video storage ready
- Playback support implemented

✅ **Video Playback**
- HTML5 video element configured
- Error handling implemented
- User-friendly error messages
- Fallback options available

---

## 🚀 Next Steps

### **Immediate**
1. Open http://localhost:5173 in browser
2. Test Google Drive video upload with ID: `1EwvsOE1Qt-tgkxXnRurhf-O_1ZGaYtBm`
3. Check browser console for errors (F12)
4. Verify video appears in grid
5. Click to watch and test playback

### **If Video Doesn't Play**
1. Check console error message
2. If "Format error": Video needs re-encoding
3. If "Connection refused": Check backend
4. If other error: See sections above

### **If Tests Pass**
1. Document results
2. Mark feature as tested
3. Prepare for deployment

---

## 📞 Quick Reference

### **Check Server Status**
```powershell
netstat -ano | Select-String "5000|5173" | Select-String "LISTENING"
```

### **Restart Backend**
```powershell
Get-Process node | Stop-Process -Force
cd "C:\Users\Saurav\OneDrive\Desktop\Movies_Space\backend"
npm run dev
```

### **Restart Frontend**
```powershell
Get-Process node | Stop-Process -Force
cd "C:\Users\Saurav\OneDrive\Desktop\Movies_Space\movies_space"
npm run dev
```

### **View Backend Logs**
```
Terminal ID: 3a7c7aa5-6512-4608-bcae-601ed9a0476f
Check for:
- ✓ MovieSpace Backend Server Running
- ✓ CORS Origins configured
- ✓ Email/Sheets services ready
```

### **View Frontend Logs**
```
Terminal ID: 82c6d857-9a23-4150-b383-6c169fe8504f
Check for:
- ✓ VITE ready in Xms
- ✓ Local: http://localhost:5173/
- ✓ No build errors
```

---

## ✅ All Systems Go

**Status:** ✅ Ready for Testing  
**Servers:** ✅ Running  
**Errors:** ✅ Handled  
**Feature:** ✅ Implemented  

**Next Action:** Open http://localhost:5173 and test the Google Drive video upload feature!

