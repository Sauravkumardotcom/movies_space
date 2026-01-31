// Google Sheets Service for MovieSpace
// Sends data through backend proxy which forwards to Google Apps Script
// Backend handles CORS, frontend calls /api/apps-script endpoint

/**
 * Backend API endpoint that proxies to Google Apps Script
 */
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
const APPS_SCRIPT_PROXY = `${BACKEND_URL}/api/apps-script`;

// Validate that backend URL is configured
const isConfigured = () => {
  if (!BACKEND_URL) {
    console.warn('⚠️ VITE_BACKEND_URL not configured in .env');
    return false;
  }
  return true;
};

/**
 * Store user registration data to Google Sheet
 */
export async function storeUser({ name, email, registeredAt }) {
  try {
    if (!isConfigured()) {
      console.log('[DEMO MODE] User stored locally:', { name, email, registeredAt });
      return { success: true, demoMode: true };
    }

    const response = await fetch(APPS_SCRIPT_PROXY, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'storeUser',
        data: {
          name,
          email,
          registeredAt: registeredAt || new Date().toISOString()
        }
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log('✅ User data stored in Google Sheets:', { name, email });
    return result;
  } catch (error) {
    console.error('❌ Error storing user in Google Sheets:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Store movie/video data to Google Sheet
 */
export async function storeMovie({ title, videoUrl, addedBy, addedAt }) {
  try {
    if (!isConfigured()) {
      console.log('[DEMO MODE] Movie stored locally:', { title, videoUrl, addedBy, addedAt });
      return { success: true, demoMode: true };
    }

    const response = await fetch(APPS_SCRIPT_PROXY, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'storeMovie',
        data: {
          title,
          videoUrl,
          addedBy: addedBy || 'admin',
          addedAt: addedAt || new Date().toISOString()
        }
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log('✅ Movie data stored in Google Sheets:', { title, videoUrl });
    return result;
  } catch (error) {
    console.error('❌ Error storing movie in Google Sheets:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Store movie request to Google Sheet
 */
export async function storeMovieRequest({ name, email, title, type, message, requestedAt }) {
  try {
    if (!isConfigured()) {
      console.log('[DEMO MODE] Movie request stored locally:', { name, email, title, type });
      return { success: true, demoMode: true };
    }

    const response = await fetch(APPS_SCRIPT_PROXY, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'storeRequest',
        data: {
          name,
          email,
          title,
          type,
          message: message || '',
          requestedAt: requestedAt || new Date().toISOString(),
          status: 'pending'
        }
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log('✅ Movie request stored in Google Sheets:', { title, email });
    return result;
  } catch (error) {
    console.error('❌ Error storing movie request in Google Sheets:', error);
    return { success: false, error: error.message };
  }
}

export default {
  storeUser,
  storeMovie,
  storeMovieRequest,
  isConfigured
};
