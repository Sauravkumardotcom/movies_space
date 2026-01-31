# 🎥 Google Drive Video Test - Feature Validation

**Test Date:** January 29, 2026  
**Google Drive File ID:** `1EwvsOE1Qt-tgkxXnRurhf-O_1ZGaYtBm`  
**Feature:** Add and play videos using Google Drive file IDs

---

## 📋 Test Plan

### **Feature Overview**
MovieSpace allows users to add videos from Google Drive by entering the file ID directly. This test validates:
- ✅ Google Drive file ID input
- ✅ Video URL generation from file ID
- ✅ Video playback from Google Drive
- ✅ Video metadata management
- ✅ Custom video storage

---

## 🚀 Test Execution Steps

### **Step 1: Start Development Servers**

**Terminal 1 - Frontend:**
```bash
cd c:\Users\Saurav\OneDrive\Desktop\Movies_Space\movies_space
npm run dev
```
Expected: Vite dev server starts on http://localhost:5173

**Terminal 2 - Backend:**
```bash
cd c:\Users\Saurav\OneDrive\Desktop\Movies_Space\backend
npm run dev
```
Expected: Express server starts on http://localhost:5000

---

### **Step 2: Access Application**

Open browser and navigate to:
```
http://localhost:5173
```

Expected Result:
- ✅ Home page loads
- ✅ Video library displays
- ✅ Navigation bar visible
- ✅ No console errors

---

### **Step 3: Open Upload Modal**

**Method 1: Via Navigation Button**
- Look for "Upload" or "📤" button in header/navbar
- Click to open upload modal

**Method 2: Via Console**
```javascript
// In browser console
const { setUploadModalOpen } = window.__appStore || {};
if (setUploadModalOpen) setUploadModalOpen(true);
```

Expected Result:
- ✅ Modal opens with form
- ✅ Form fields visible

---

### **Step 4: Fill Upload Form with Test Data**

**Fill these fields:**

| Field | Value | Notes |
|-------|-------|-------|
| Title | "Border 2 - Test Video" | Any title |
| Description | "Testing Google Drive integration" | Your description |
| Genre | Select 1-2 genres | Multi-select |
| Language | "Hindi" | From dropdown |
| Year | 2024 | From input |
| Director | "Test Director" | Optional |
| Duration | 120 | Minutes |
| Rating | 8.5 | Out of 10 |
| **Google Drive Video ID** | `1EwvsOE1Qt-tgkxXnRurhf-O_1ZGaYtBm` | **KEY FIELD** |

---

### **Step 5: Submit Form**

1. Click "Next Step" button if multi-step form
2. Review your data
3. Click "Upload" or "Submit" button

Expected Result:
- ✅ Form validation passes
- ✅ Upload progress shows (0-100%)
- ✅ No error messages
- ✅ Modal closes after completion

---

### **Step 6: Verify Video Added**

**Check in Homepage:**
1. Go back to home page
2. Scroll to "All Movies" section
3. Look for "Border 2 - Test Video" in the grid

Expected Result:
- ✅ Video appears in grid
- ✅ Title displays correctly
- ✅ Poster/thumbnail visible

---

### **Step 7: Test Video Playback**

**Click on the video card:**
1. Click "Border 2 - Test Video"
2. Navigate to watch page

Expected Result:
- ✅ Watch page loads
- ✅ Video player appears
- ✅ Metadata displays (title, description, rating)

**Try to play video:**
1. Click play button
2. Wait for video to load

Expected Result:
- ✅ Video starts playing from Google Drive
- ✅ No CORS errors
- ✅ Video controls work (play, pause, seek)
- ✅ Duration displays correctly

---

## 🔍 Technical Details

### **Google Drive Video URL Format**
```
Video ID: 1EwvsOE1Qt-tgkxXnRurhf-O_1ZGaYtBm

Converted URL:
https://drive.google.com/uc?export=download&id=1EwvsOE1Qt-tgkxXnRurhf-O_1ZGaYtBm
```

### **Code Implementation**
In `UploadModal.jsx` (line ~121):
```javascript
src: formData.gdriveVideoId 
  ? `https://drive.google.com/uc?export=download&id=${formData.gdriveVideoId}`
  : 'https://www.w3schools.com/html/mov_bbb.mp4'
```

### **Data Storage**
Video metadata is stored in:
- **useAppStore** - Zustand state with localStorage persistence
- **videoService** - Video service layer
- **uploadedVideos** - Custom videos array

---

## ✅ Validation Checklist

### **Form Input:**
- [ ] Title field accepts text
- [ ] Description field accepts multi-line text
- [ ] Genre selector works (single and multiple)
- [ ] Language dropdown displays options
- [ ] Year input accepts numbers
- [ ] Director field accepts text
- [ ] Duration field accepts numbers
- [ ] Rating field accepts decimal numbers
- [ ] **Google Drive ID field accepts the test ID**

### **Submission:**
- [ ] Form validates required fields
- [ ] No console errors during submission
- [ ] Upload progress bar shows
- [ ] Modal closes after successful upload
- [ ] No 404 or 500 errors

### **Video Display:**
- [ ] Video appears in home page grid
- [ ] Video displays with correct title
- [ ] Video includes metadata (title, description)
- [ ] Video can be clicked
- [ ] Watch page loads correctly

### **Playback:**
- [ ] Video player loads
- [ ] Play button is functional
- [ ] Video starts playing
- [ ] Controls work (play, pause, mute, fullscreen)
- [ ] Video duration is correct
- [ ] No CORS errors in console
- [ ] No codec errors ("NotSupportedError")

### **Data Persistence:**
- [ ] Refresh page - video still appears
- [ ] Check localStorage - video data persists
- [ ] Video appears in favorites if added
- [ ] Video appears in watch history if played

---

## 🐛 Troubleshooting

### **Issue: "Google Drive Video ID field not found"**
**Solution:** 
- Check UploadModal.jsx is properly loaded
- Look for input field with placeholder "Google Drive Video ID"
- Verify npm run dev compiled successfully

### **Issue: "Video won't play - CORS error"**
**Solution:**
- This is expected with some Google Drive files
- The URL format `drive.google.com/uc?export=download` should work
- If error occurs, the video file may not be shareable

### **Issue: "NotSupportedError: No supported sources"**
**Solution:**
- This means the file format isn't compatible
- Try different video files
- The test ID provided should work if file is accessible

### **Issue: "Modal won't open"**
**Solution:**
- Ensure npm run dev is running
- Check browser console for errors
- Try clicking different buttons to trigger modal
- Refresh page and try again

### **Issue: "Video doesn't appear after upload"**
**Solution:**
- Check browser console for JavaScript errors
- Verify form submitted successfully (check network tab)
- Look in localStorage for video data
- Check if video was added to "All Movies" section

---

## 📊 Expected Test Results

### **Successful Flow:**
```
1. Upload Form Opens ✅
2. Enter Test Data ✅
3. Enter Google Drive ID: 1EwvsOE1Qt-tgkxXnRurhf-O_1ZGaYtBm ✅
4. Submit Form ✅
5. Video Added to Library ✅
6. Navigate to Video ✅
7. Video Plays Successfully ✅
8. Data Persists on Refresh ✅
```

### **Error Handling:**
- ✅ Invalid ID shows error
- ✅ Empty required fields show validation
- ✅ Network errors handled gracefully
- ✅ User-friendly error messages

---

## 🎬 Quick Test (5 minutes)

If you want to quickly test without full setup:

**In Browser Console:**
```javascript
// Mock video for testing
const testVideo = {
  id: 'test_gdrive_' + Date.now(),
  title: 'Test Google Drive Video',
  src: 'https://drive.google.com/uc?export=download&id=1EwvsOE1Qt-tgkxXnRurhf-O_1ZGaYtBm',
  gdriveVideoId: '1EwvsOE1Qt-tgkxXnRurhf-O_1ZGaYtBm',
  description: 'Testing Google Drive integration',
  duration: 120,
  rating: 8.5,
  genre: ['Drama'],
  poster: 'https://placehold.co/300x450?text=Test+Video'
};

// Add to store (if store exposed)
console.log('Test video object:', testVideo);
```

---

## 📝 Test Report Template

**Use this format to document your test:**

```
TEST REPORT - Google Drive Video Upload
=====================================
Date: January 29, 2026
Tester: [Your Name]
Test ID: 1EwvsOE1Qt-tgkxXnRurhf-O_1ZGaYtBm

RESULTS:
--------
✅ Form opens: [PASS/FAIL]
✅ Data entry: [PASS/FAIL]
✅ Submit: [PASS/FAIL]
✅ Video display: [PASS/FAIL]
✅ Playback: [PASS/FAIL]
✅ Persistence: [PASS/FAIL]

ISSUES FOUND:
[List any issues]

NOTES:
[Any additional observations]
```

---

## 🔗 Related Documentation

- [VIDEO_PLAYBACK_GUIDE.md](VIDEO_PLAYBACK_GUIDE.md) - Video playing issues
- [QUICK_START_GUIDE.md](QUICK_START_GUIDE.md) - Initial setup
- [NEW_FEATURES_SUMMARY.md](NEW_FEATURES_SUMMARY.md) - All features

---

## 📞 Support

**Need help?**

1. Check browser console for errors (F12 → Console tab)
2. Verify both servers are running (npm run dev)
3. Clear browser cache and refresh
4. Check network tab to see API calls
5. Review troubleshooting section above

---

**Test Status:** Ready to Execute  
**Test Duration:** 10-15 minutes  
**Complexity:** Medium  
**Dependencies:** Frontend & Backend running, Browser

Start the servers and follow the steps above to validate the Google Drive video upload feature!

