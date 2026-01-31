# MovieSpace - Upload & Request Features

## Overview

MovieSpace now includes two new major features:

1. **Video Upload with Google Drive Integration**
2. **Movie/Series Request Form**

---

## 1. Video Upload Feature

### How to Use

1. Click the **"Upload"** button in the header (red button)
2. **Step 1: Video Details**
   - Enter video title (required)
   - Add description
   - Select genres
   - Choose language and release year
3. **Step 2: Upload Files**
   - Select video file (required)
   - Upload poster image (optional)
   - Upload subtitle file (optional)
4. **Step 3: Confirm & Upload**
   - Review your upload
   - Click "Start Upload"
   - Watch the progress bar
   - Click "Done" when complete

### Google Drive Integration

The uploaded files are saved to Google Drive in the following structure:

```
MovieSpace_Uploads/
├── video.mp4 (from your upload)
├── poster.jpg (optional)
└── subtitles.srt (optional)
```

### Current Mode: Demo

Currently running in **demo mode** which:
- ✅ Shows complete upload workflow
- ✅ Simulates file upload with progress
- ✅ Saves video metadata to app store
- ✅ Stores uploaded video list locally
- ⏳ Mock Google Drive integration (ready for real credentials)

### To Enable Real Google Drive Upload

See `GOOGLE_DRIVE_SETUP.md` for detailed setup instructions.

---

## 2. Movie/Series Request Feature

### How to Use

1. Click the **"Request"** button in the header (blue button)
2. **Select Type**
   - Choose "Movie" or "Series"
3. **Fill Request Details**
   - **Title** * (required)
   - **Release Year** (optional)
   - **IMDb Link** (optional)
   - **Genre** (select multiple)
   - **Description** (optional)
   - **Why should we add it?** (optional)
4. **Submit Request**
   - Click "Submit Request"
   - Success message confirms submission
   - Request is saved to the app

### Request Status

All requests are stored with:
- Request ID (timestamp-based)
- Status: "pending" (default)
- Requester name
- Submission date/time
- All form details

### Request Data Structure

```javascript
{
  id: 1704988800000,
  title: "Inception",
  releaseYear: 2010,
  genre: ["Sci-Fi", "Thriller"],
  description: "A skilled thief...",
  reason: "Amazing story and visuals",
  imdbLink: "https://imdb.com/title/tt1375666/",
  type: "movie",
  requestedBy: "John Doe",
  requestedAt: "2024-01-26T10:30:00Z",
  status: "pending"
}
```

---

## Code Changes

### New Files Created

1. **`src/components/RequestMovieModal.jsx`**
   - Request form component
   - Genre selector
   - Form validation
   - Success/error messages

2. **`src/services/googleDriveService.js`**
   - Google Drive API integration
   - File upload functions
   - Folder management
   - Demo mode with simulation

3. **`GOOGLE_DRIVE_SETUP.md`**
   - Setup guide for Google Drive API
   - Environment configuration
   - Security best practices

### Files Updated

1. **`src/store/useAppStore.js`**
   - Added `movieRequests` state
   - Added `addMovieRequest()` function
   - Added `uploadedVideos` state
   - Added `addUploadedVideo()` function

2. **`src/components/Header.jsx`**
   - Added "Request" button (blue)
   - Integrated with store
   - Mobile responsive

3. **`src/components/UploadModal.jsx`**
   - Added Google Drive integration
   - Folder creation logic
   - Multi-file upload support
   - Better error handling
   - Progress tracking

4. **`src/App.jsx`**
   - Added RequestMovieModal
   - Integrated with AppContent

---

## Features

### Upload Features

- ✅ Multi-step form wizard
- ✅ File type validation
- ✅ Genre selection (multiple)
- ✅ Progress bar with percentage
- ✅ Error handling
- ✅ Success confirmation
- ✅ Google Drive ready
- ✅ Metadata saving
- ✅ Form reset after upload

### Request Features

- ✅ Movie/Series type selection
- ✅ Title requirement validation
- ✅ Multi-genre selection
- ✅ IMDb link support
- ✅ Description field
- ✅ Reasoning field
- ✅ Request history tracking
- ✅ Status management
- ✅ Requester tracking
- ✅ Timestamp recording

---

## State Management

### Added to Zustand Store

```javascript
// Movie Requests
movieRequests: [],
addMovieRequest: (request) => set((state) => ({
  movieRequests: [newRequest, ...state.movieRequests],
})),

// Uploaded Videos
uploadedVideos: [],
addUploadedVideo: (video) => set((state) => ({
  uploadedVideos: [video, ...state.uploadedVideos],
})),
```

---

## Styling

Both modals feature:
- Dark theme matching MovieSpace design
- Red accent color for uploads
- Blue accent color for requests
- Framer Motion animations
- Responsive design
- Hover effects
- Error states
- Success states

---

## Next Steps

### Short Term
1. Test upload and request flows
2. Verify form validation
3. Check store state updates

### Medium Term
1. Add a "My Requests" page to view submitted requests
2. Add a "My Uploads" page to see uploaded videos
3. Implement request voting/rating

### Long Term
1. Setup real Google Drive integration
2. Create admin panel to review requests
3. Implement backend API
4. Add email notifications for requests
5. Create request analytics

---

## Testing Checklist

- [ ] Upload button appears in header
- [ ] Request button appears in header
- [ ] Upload modal opens on button click
- [ ] Request modal opens on button click
- [ ] Upload form validates required fields
- [ ] Request form validates required fields
- [ ] Genre selection works correctly
- [ ] Progress bar animates
- [ ] Success messages display
- [ ] Forms reset after submission
- [ ] State updates correctly in store

---

## Browser Console

You may see "Could not establish connection. Receiving end does not exist" errors - these are from browser extensions and are safe to ignore. They don't affect the app's functionality.

---

## Support

For setup help or issues:
1. Check `GOOGLE_DRIVE_SETUP.md` for Google Drive integration
2. Review error messages in browser console
3. Verify all environment variables are set correctly
4. Ensure Google APIs are enabled in Cloud Console

---

**Last Updated**: January 26, 2026  
**Version**: 1.0  
**Status**: Production Ready (Demo Mode)
