# MovieSpace Features - Quick Start Guide

## 🎬 Main Header Buttons

Located in the top-right corner of MovieSpace:

```
┌─────────────────────────────────────────────┐
│ MovieSpace    🔍 Search...   [Request] [Upload] │
│               (blue button) (red button)       │
└─────────────────────────────────────────────┘
```

---

## 📤 Upload Videos to Google Drive

### Button Location
**Header → Red "Upload" Button**

### Step-by-Step Process

#### Step 1: Video Information
```
┌────────────────────────────┐
│ 📤 Upload Your Content     │
├────────────────────────────┤
│ Title: [________________]  │
│ Description: [___________] │
│ Genre: [Action] [Comedy]   │
│ Language: [English    ▼]   │
│ Year: [2024]               │
│                     [Next] │
└────────────────────────────┘
```

#### Step 2: Select Files
```
┌────────────────────────────┐
│ 📤 Upload Your Content     │
├────────────────────────────┤
│ Video File *               │
│ ┌──────────────────────┐   │
│ │ Click to upload      │   │
│ │ or drag video        │   │
│ └──────────────────────┘   │
│                            │
│ Poster (optional)          │
│ Subtitle (optional)        │
│                    [Upload]│
└────────────────────────────┘
```

#### Step 3: Upload Progress
```
┌────────────────────────────┐
│ 📤 Upload Your Content     │
├────────────────────────────┤
│ Uploading Your Content     │
│ 45%                        │
│ ██████░░░░░░░░░░░░░░░░    │
│                            │
│ Saving to Google Drive...  │
│                     [Done] │
└────────────────────────────┘
```

### Where Files Are Saved

```
Google Drive
└── MovieSpace_Uploads/
    ├── Your_Movie_Title.mp4
    ├── poster.jpg
    └── subtitles.srt
```

### What Gets Stored

- ✅ Video file → Google Drive
- ✅ Poster image → Google Drive
- ✅ Subtitles → Google Drive
- ✅ Metadata → App Store
- ✅ Upload history → Local storage

---

## 🎬 Request Movies/Series

### Button Location
**Header → Blue "Request" Button**

### Step-by-Step Process

#### Type Selection
```
┌────────────────────────────┐
│ 🎬 Request a Movie or Series│
│ Tell us what you'd like   │
├────────────────────────────┤
│ Type: [Movie] [Series]     │
└────────────────────────────┘
```

#### Fill Request Form
```
┌────────────────────────────┐
│ 🎬 Request a Movie or Series│
├────────────────────────────┤
│ Title: [________________]* │
│ Release Year: [2024]       │
│ IMDb Link: [https://...]   │
│ Genre: [Action] [Comedy]   │
│ Description: [__________]  │
│ Why add it?: [__________]  │
│              [Submit Req.] │
└────────────────────────────┘
```

#### Success Confirmation
```
┌────────────────────────────┐
│ ✓ Request submitted!       │
│ We'll review it soon.      │
└────────────────────────────┘
```

### Request Data Saved

```javascript
{
  title: "Dune 2",
  type: "movie",
  releaseYear: 2024,
  genres: ["Sci-Fi", "Action"],
  reason: "Amazing visual effects",
  status: "pending",
  requestedAt: "2024-01-26",
  requestedBy: "User Name"
}
```

---

## 🔄 Navigation Guide

### Main Navigation (Sidebar)

```
HOME
📊 Trending
🎉 New & Hot
❤️ My List
📺 Watch History
🎬 Shorts
```

### Top Navigation (Header)

```
[MovieSpace Logo]  [Search]  [Request] [Upload] [Sign In]
```

---

## 💾 Data Flow

### Video Upload
```
User fills form
    ↓
Select files
    ↓
Upload to Google Drive
    ↓
Save metadata to store
    ↓
Update UI with success
```

### Movie Request
```
User fills form
    ↓
Select type & genres
    ↓
Submit request
    ↓
Save to app store
    ↓
Show success message
```

---

## ✅ Feature Checklist

### Upload Features
- [x] Multi-step form
- [x] File selection
- [x] Genre tagging
- [x] Progress tracking
- [x] Google Drive integration
- [x] Error handling
- [x] Success confirmation

### Request Features
- [x] Type selection (movie/series)
- [x] Genre selection
- [x] IMDb link support
- [x] Requester tracking
- [x] Status management
- [x] Timestamp recording
- [x] Form validation

---

## 🎨 Color Scheme

| Element | Color | Hex |
|---------|-------|-----|
| Upload Button | Red | #DC2626 |
| Request Button | Blue | #2563EB |
| Accent | Red | #EF4444 |
| Success | Green | #10B981 |
| Error | Red | #F87171 |
| Background | Dark | #0F0F0F |
| Card | Dark Gray | #111827 |

---

## 🚀 Quick Tips

1. **Upload**: Upload videos to Google Drive and MovieSpace
2. **Request**: Ask for specific movies or series
3. **Genre Tags**: Multi-select for better categorization
4. **Optional Fields**: Description and reason are helpful but optional
5. **IMDb Links**: Helps identify the exact content requested
6. **Success Confirmation**: Shows when submission is complete

---

## 📱 Mobile Support

Both features are mobile responsive:
- Forms adapt to screen size
- Touch-friendly buttons
- Readable on all devices
- Modals work on mobile

---

## 🔐 Privacy & Security

- Uploads are saved to your Google Drive
- Requests are stored locally in the app
- No data is sent to external servers (demo mode)
- Email stored only for requester tracking
- Timestamps recorded automatically

---

## 🆘 Common Issues

| Issue | Solution |
|-------|----------|
| Button not visible | Scroll right in header or use mobile menu |
| Form won't submit | Fill all required fields (title for request) |
| Upload stuck | Check file size and format |
| Google Drive integration | See GOOGLE_DRIVE_SETUP.md |

---

## 📞 Need Help?

1. Check form error messages
2. Review console for errors (F12)
3. Ensure files are valid format
4. Try refreshing the page
5. Clear browser cache

---

**Last Updated**: January 26, 2026  
**Status**: Ready to Use ✓
