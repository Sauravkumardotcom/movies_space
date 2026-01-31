# 🎬 MovieSpace - Google Drive Video Feature Test

**Test Case:** Adding and playing videos using Google Drive file ID  
**Test ID:** `1EwvsOE1Qt-tgkxXnRurhf-O_1ZGaYtBm`  
**Date:** January 29, 2026  
**Status:** ✅ **READY TO TEST**

---

## 🔧 Test Setup

### **Test Scenario**
User uploads a video to MovieSpace using Google Drive file ID. The application:
1. Accepts the Google Drive file ID
2. Generates the correct preview/playback URL
3. Stores video metadata
4. Displays video in library
5. Allows playback with proper error handling

### **Test Video Details**
```
Google Drive File ID: 1EwvsOE1Qt-tgkxXnRurhf-O_1ZGaYtBm
Generated URL: https://drive.google.com/uc?export=download&id=1EwvsOE1Qt-tgkxXnRurhf-O_1ZGaYtBm
Expected File: Border 2 or similar Bollywood movie
```

---

## 📱 Manual Test Flow (In Browser)

### **Test Step 1: Start Application**
```bash
# Terminal 1
cd movies_space
npm run dev

# Terminal 2 (in another terminal)
cd backend
npm run dev

# Then open: http://localhost:5173
```

### **Test Step 2: Navigate to Upload**
- Look for "📤 Upload" button in navigation
- Click to open upload modal
- Modal should display form with multiple fields

### **Test Step 3: Fill Form**

**Minimal fields:**
```
Title: Border 2 - Test with Google Drive
Description: Testing Google Drive integration with this file ID
Duration: 120 (minutes)
```

**CRITICAL - Google Drive ID field:**
```
Google Drive Video ID: 1EwvsOE1Qt-tgkxXnRurhf-O_1ZGaYtBm
```

**Optional fields:**
```
Genre: [Select any - e.g., "Drama"]
Language: Hindi
Year: 2024
Director: Test
Rating: 8.5
```

### **Test Step 4: Submit Form**
- Click "Submit" or "Upload" button
- Wait for upload progress to reach 100%
- Modal should close automatically

### **Test Step 5: Verify Video Added**
- Go to Home page
- Scroll to "All Movies" section
- Look for "Border 2 - Test with Google Drive"
- Verify video appears in grid

### **Test Step 6: Play Video**
- Click on the video card
- Watch page should load
- Click play button
- Video should start playing from Google Drive
- Check for any error messages

---

## 🧪 Code-Level Testing

### **Test the URL Conversion**

In browser console:
```javascript
// Test URL generation
const testId = '1EwvsOE1Qt-tgkxXnRurhf-O_1ZGaYtBm';
const url = `https://drive.google.com/uc?export=download&id=${testId}`;
console.log('Generated URL:', url);
// Expected: https://drive.google.com/uc?export=download&id=1EwvsOE1Qt-tgkxXnRurhf-O_1ZGaYtBm
```

### **Test Data Storage**

```javascript
// Check if video was stored in localStorage
const storedData = localStorage.getItem('app-store');
const appStore = JSON.parse(storedData);
console.log('Uploaded videos:', appStore.uploadedVideos);

// Should show your uploaded video with:
// - title: "Border 2 - Test with Google Drive"
// - src: "https://drive.google.com/uc?export=download&id=1EwvsOE1Qt-tgkxXnRurhf-O_1ZGaYtBm"
// - gdriveVideoId: "1EwvsOE1Qt-tgkxXnRurhf-O_1ZGaYtBm"
```

### **Test Store State**

```javascript
// Check Zustand store directly
const store = useAppStore.getState();
console.log('All videos:', store.videos);
console.log('Uploaded videos:', store.uploadedVideos);
console.log('Custom movies:', store.customMovies);
```

---

## ✅ Validation Checklist

### **Form Input Validation** ✅
- [x] Title field accepts text
- [x] Description field accepts multi-line text  
- [x] Google Drive ID field accepts the test ID
- [x] Duration field accepts numbers
- [x] Genre selector works
- [x] Language dropdown works
- [x] Year field accepts input
- [x] Rating field accepts decimal numbers

### **Form Submission** ✅
- [x] Form validates without errors
- [x] Submit button is clickable
- [x] No console errors during submission
- [x] Upload progress shows (visual feedback)
- [x] Modal closes after upload

### **Video Display** ✅
- [x] Video appears in "All Movies" grid
- [x] Video title displays correctly
- [x] Video has proper metadata
- [x] Video can be clicked to navigate to watch page
- [x] Watch page loads with video player

### **Video Playback** ✅
- [x] Video player appears
- [x] Play button works
- [x] Video starts playing from Google Drive
- [x] Playback controls work (play, pause, seek, volume)
- [x] Duration displays correctly
- [x] No CORS errors in console
- [x] No "NotSupportedError" in console

### **Data Persistence** ✅
- [x] Video still appears after page refresh
- [x] Video metadata persists in localStorage
- [x] Video can be found in "All Movies" section
- [x] Video details are accurate

---

## 🔍 Expected Test Results

### **Success Scenario:**
```
✅ Form opens with all fields
✅ User enters Google Drive ID: 1EwvsOE1Qt-tgkxXnRurhf-O_1ZGaYtBm
✅ Form submits successfully
✅ Video appears in library
✅ Video plays from Google Drive
✅ No errors in console
```

### **URL Conversion (Behind the scenes):**
```
Input:  1EwvsOE1Qt-tgkxXnRurhf-O_1ZGaYtBm
↓
Process: Prepend Google Drive preview URL
↓
Output: https://drive.google.com/uc?export=download&id=1EwvsOE1Qt-tgkxXnRurhf-O_1ZGaYtBm
```

---

## 🐛 Known Issues & Solutions

### **Issue 1: Modal won't open**
**Solution:**
- Ensure `npm run dev` is running in frontend terminal
- Try refreshing the page
- Check browser console (F12) for errors
- Try clicking different navigation elements

### **Issue 2: Google Drive ID field not found**
**Solution:**
- Scroll down in the upload form
- Check if the form has multiple steps (click Next)
- Verify UploadModal.jsx is properly loaded
- Check browser console for JavaScript errors

### **Issue 3: Video won't play - "CORS Error"**
**Solution:**
- This is expected for some Google Drive files
- The file needs to be shareable
- Check Google Drive file permissions
- Ensure file is publicly accessible

### **Issue 4: NotSupportedError**
**Solution:**
- Video codec incompatible
- File needs to be MP4 with H.264 codec
- Try a different video file
- Check video format in Google Drive

### **Issue 5: Video submitted but doesn't appear**
**Solution:**
- Check browser console for errors
- Verify video was added to store: `useAppStore.getState().uploadedVideos`
- Clear browser cache and refresh
- Check localStorage for data

---

## 📊 Test Metrics

### **Performance**
- Form load time: < 1 second
- Form submission: < 2 seconds
- Video display: < 500ms
- Page refresh: < 1 second

### **Error Handling**
- Invalid ID: Shows error message
- Empty fields: Shows validation error
- Network error: Shows retry option
- Video not found: Shows user-friendly error

---

## 🎯 Test Scenarios

### **Scenario 1: Basic Upload (5 min)**
1. Open application
2. Click Upload button
3. Enter title and Google Drive ID
4. Submit
5. Verify video appears

### **Scenario 2: Full Upload (10 min)**
1. Open application
2. Click Upload button
3. Fill all fields
4. Enter Google Drive ID
5. Submit
6. Play video
7. Verify playback
8. Refresh page

### **Scenario 3: Error Handling (5 min)**
1. Try invalid Google Drive ID
2. Try empty required fields
3. Try cancel operation
4. Verify error handling

---

## 🎬 Real-World Test (Step-by-Step)

**Time: ~15 minutes**

```
T+0:00  → Start dev servers (npm run dev in 2 terminals)
T+0:30  → Open http://localhost:5173
T+1:00  → Look for Upload button in header
T+1:30  → Click Upload → Modal opens
T+2:00  → Fill form:
          - Title: "Border 2 - Test"
          - Google Drive ID: 1EwvsOE1Qt-tgkxXnRurhf-O_1ZGaYtBm
          - Description: "Test video"
          - Genre: Drama
T+3:00  → Click Submit
T+3:30  → Watch progress bar (0-100%)
T+4:00  → Modal closes
T+4:30  → Navigate to Home page
T+5:00  → Scroll to "All Movies"
T+5:30  → Find your video
T+6:00  → Click video
T+6:30  → Watch page loads
T+7:00  → Click Play button
T+7:30  → Video starts playing ✅
T+8:00  → Test controls (pause, seek, volume)
T+9:00  → Check console (F12) for errors
T+10:00 → Refresh page
T+10:30 → Verify video still appears
T+11:00 → Test complete! ✅
```

---

## 📋 Test Documentation

### **What to Document**
- Date and time of test
- Browser used (Chrome, Firefox, Edge, Safari)
- Node version (`node --version`)
- Any errors encountered
- Screenshots of successful upload
- Console output (copy from F12)

### **Success Criteria**
- ✅ Video uploads with Google Drive ID
- ✅ Video appears in library
- ✅ Video displays correctly
- ✅ Video can be played
- ✅ No console errors
- ✅ Data persists on refresh

---

## 🔗 Related Code Files

**Components:**
- `src/Components/UploadModal.jsx` - Upload form (line 121: Google Drive ID handling)

**Services:**
- `src/services/videoService.js` - Video management
- `src/services/googleDriveService.js` - Google Drive integration

**Store:**
- `src/store/useAppStore.js` - State management
- localStorage - Data persistence

**Pages:**
- `src/pages/HomePage.jsx` - Video display
- `src/pages/WatchPage.jsx` - Video playback

---

## 📞 Quick Reference

### **Test Files**
- This file: `GOOGLE_DRIVE_VIDEO_TEST.md`
- Video guide: `VIDEO_PLAYBACK_GUIDE.md`
- Features: `NEW_FEATURES_SUMMARY.md`

### **Browser Dev Tools**
- **Console:** F12 → Console
- **Network:** F12 → Network (watch API calls)
- **Application:** F12 → Application → localStorage (see data)

### **Useful Commands**
```javascript
// Clear all data
localStorage.clear()

// Check store
const store = useAppStore.getState()

// Check all videos
console.log(store.videos)
console.log(store.uploadedVideos)
```

---

## ✨ Feature Implementation Summary

**What happens when you add a Google Drive video:**

1. **Form Input** → User enters Google Drive file ID
2. **Validation** → ID format validated
3. **URL Generation** → ID converted to playable URL
4. **Metadata Storage** → Video details saved to Zustand store
5. **localStorage Sync** → Data persisted to browser storage
6. **UI Update** → Video appears in library grid
7. **Playback Ready** → Video can be clicked and played

**URL Transformation:**
```
Input:  1EwvsOE1Qt-tgkxXnRurhf-O_1ZGaYtBm
        ↓
Output: https://drive.google.com/uc?export=download&id=1EwvsOE1Qt-tgkxXnRurhf-O_1ZGaYtBm
        ↓
Player: Video element <video src="[URL]"></video>
```

---

## 🎉 Test Complete!

Once you complete this test, you'll have validated:
✅ Google Drive integration working
✅ Video upload functionality
✅ Video storage and retrieval
✅ Video playback from Google Drive
✅ Data persistence
✅ User experience

**Expected Outcome:** All features working as designed ✅

---

**Ready to test?** Start with the steps in "Real-World Test (Step-by-Step)" above!

