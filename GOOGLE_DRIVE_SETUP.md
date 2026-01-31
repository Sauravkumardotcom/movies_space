# Google Drive Integration Setup Guide

This guide will help you set up real Google Drive integration for the MovieSpace application.

## Current Status

Currently, the app uses a **demo/mock mode** for Google Drive integration. This allows you to test the UI and workflow without actual authentication.

## To Enable Real Google Drive Integration

### Step 1: Get Google API Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project named "MovieSpace"
3. Enable the **Google Drive API**:
   - Click on "Enable APIs and Services"
   - Search for "Google Drive API"
   - Click "Enable"
4. Create OAuth 2.0 credentials:
   - Go to "Credentials" in the left sidebar
   - Click "Create Credentials" → "OAuth client ID"
   - Choose "Web application"
   - Add authorized redirect URIs:
     - `http://localhost:5173`
     - `http://localhost:5173/callback`
     - Your production URL
   - Copy the **Client ID** and **Client Secret**

### Step 2: Set Environment Variables

Create a `.env.local` file in the `movies_space` directory:

```env
VITE_GOOGLE_CLIENT_ID=your_client_id_here
VITE_GOOGLE_API_KEY=your_api_key_here
```

### Step 3: Install Google API Client

```bash
npm install @react-oauth/google @react-gapi/gapi-script
```

### Step 4: Update `googleDriveService.js`

Replace the demo functions with actual Google Drive API calls:

```javascript
import { gapi } from 'gapi-script';

const googleDriveService = {
  uploadToGoogleDrive: async (file, metadata = {}) => {
    try {
      const form = new FormData();
      form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
      form.append('file', file);

      const response = await fetch(
        'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${gapi.auth.getToken().access_token}`,
          },
          body: form,
        }
      );

      const result = await response.json();
      return {
        success: true,
        fileId: result.id,
        url: result.webViewLink,
      };
    } catch (error) {
      throw error;
    }
  },

  // ... implement other methods similarly
};
```

### Step 5: Update App Component

Add Google authentication to your App component:

```jsx
import { GoogleOAuthProvider } from '@react-oauth/google';

function App() {
  return (
    <GoogleOAuthProvider clientId={process.env.VITE_GOOGLE_CLIENT_ID}>
      {/* Your app content */}
    </GoogleOAuthProvider>
  );
}
```

### Step 6: Update Header Component

Add sign-in button:

```jsx
import { useGoogleLogin } from '@react-oauth/google';

const Header = () => {
  const login = useGoogleLogin({
    onSuccess: (codeResponse) => {
      // Save token to state
      setGoogleToken(codeResponse.access_token);
    },
  });

  return (
    // ... existing code
    <button onClick={() => login()}>Sign in with Google</button>
  );
};
```

## Folder Structure in Google Drive

The app will create the following folder structure:

```
MovieSpace_Uploads/
├── 2024-01-26/
│   ├── video_title.mp4
│   ├── poster.jpg
│   └── subtitles.srt
└── 2024-01-27/
    └── ...
```

## Security Considerations

1. **Never expose your Client Secret** - Only use Client ID in frontend
2. **Use OAuth 2.0 with proper scopes** - `https://www.googleapis.com/auth/drive.file`
3. **Validate file types and sizes** on backend
4. **Store file IDs securely** in your database
5. **Implement rate limiting** for uploads
6. **Set up proper error handling** and retry logic

## Testing

To test Google Drive integration:

1. Sign in with your Google account
2. Upload a video
3. Check your Google Drive for the uploaded files in the "MovieSpace_Uploads" folder

## Troubleshooting

### "Receiving end does not exist" error
- This is from browser extensions, not your code
- It's safe to ignore in the console

### CORS errors
- Set up a backend proxy or configure CORS properly
- Consider using a backend server for file uploads

### Quota exceeded
- Google Drive has upload limits
- Implement size validation and chunked uploads for large files

### Authentication issues
- Make sure your redirect URIs match exactly
- Clear browser cache and try again
- Check that APIs are enabled in Google Cloud Console

## Demo Mode

The current implementation uses demo mode which:
- ✅ Shows the upload workflow
- ✅ Displays progress bars
- ✅ Allows form testing
- ✅ Saves metadata locally
- ❌ Doesn't actually upload to Google Drive

To switch to real Google Drive, follow the steps above.

## Next Steps

1. Get Google API credentials
2. Set environment variables
3. Install required packages
4. Update googleDriveService.js with real API calls
5. Add Google authentication to the app
6. Test the integration

## Resources

- [Google Drive API Documentation](https://developers.google.com/drive/api)
- [Google OAuth 2.0](https://developers.google.com/identity/protocols/oauth2)
- [React Google Login](https://www.npmjs.com/package/@react-oauth/google)

---

**Note**: The app currently works in demo mode. Follow these steps when you're ready to implement real Google Drive integration.
