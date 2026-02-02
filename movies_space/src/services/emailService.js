// Email Service for MovieSpace
// Handles sending emails via Google Apps Script through backend proxy
// Backend proxy handles CORS, frontend calls /api/apps-script endpoint

/**
 * PRODUCTION FIX: Intelligent API base URL detection
 * Supports both localhost development and Vercel production
 */
const getBackendURL = () => {
  // Priority 1: Environment variable
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }

  // Priority 2: Production Vercel detection
  if (typeof window !== 'undefined' && window.location.hostname !== 'localhost') {
    return `${window.location.origin}/api`;
  }

  // Priority 3: Development
  return 'http://localhost:5000';
};

const BACKEND_URL = getBackendURL();
const APPS_SCRIPT_PROXY = `${BACKEND_URL}/api/apps-script`;

// Validate configuration
const isConfigured = () => {
  if (!BACKEND_URL) {
    console.warn('⚠️ API Base URL not configured');
    return false;
  }
  return true;
};

export const emailService = {
  /**
   * Send request confirmation email to user via Google Apps Script
   */
  sendRequestConfirmationEmail: async (requestData) => {
    try {
      if (!isConfigured()) {
        console.log('[DEMO MODE] Request confirmation email to:', requestData.email);
        return { success: true, demoMode: true };
      }

      const payload = {
        action: 'sendRequestEmail',
        data: {
          to_email: requestData.email,
          to_name: requestData.name || 'User',
          title: requestData.title,
          request_type: requestData.type || 'Movie',
          message: requestData.description || requestData.reason || 'No additional message',
          admin_email: import.meta.env.VITE_ADMIN_EMAIL || 'admin@moviespace.com'
        }
      };

      const response = await fetch(APPS_SCRIPT_PROXY, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('✅ Confirmation email sent to:', requestData.email);
      return { success: true, message: 'Confirmation email sent successfully!' };
    } catch (error) {
      console.error('Email send error:', error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Send admin notification about new request via Google Apps Script
   */
  sendAdminNotification: async (requestData) => {
    try {
      if (!isConfigured()) {
        console.log('[DEMO MODE] Admin notification for:', requestData.title);
        return { success: true, demoMode: true };
      }

      const payload = {
        action: 'sendAdminEmail',
        data: {
          to_email: import.meta.env.VITE_ADMIN_EMAIL || 'admin@moviespace.com',
          user_name: requestData.name || 'User',
          user_email: requestData.email,
          title: requestData.title,
          request_type: requestData.type || 'Movie',
          message: requestData.description || requestData.reason || 'No additional message'
        }
      };

      const response = await fetch(APPS_SCRIPT_PROXY, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('📧 Admin notification sent for request:', requestData.title);
      return { success: true, message: 'Admin notification sent' };
    } catch (error) {
      console.error('Admin notification error:', error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Send contact form email via Google Apps Script
   */
  sendContactEmail: async (email, name, message) => {
    try {
      if (!isConfigured()) {
        console.log('[DEMO MODE] Contact email from:', email);
        return { success: true, demoMode: true };
      }

      const payload = {
        action: 'sendContactEmail',
        data: {
          from_email: email,
          from_name: name,
          message: message,
          to_email: import.meta.env.VITE_ADMIN_EMAIL || 'admin@moviespace.com'
        }
      };

      const response = await fetch(APPS_SCRIPT_PROXY, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('✅ Contact email sent from:', email);
      return { success: true, message: 'Email sent successfully!' };
    } catch (error) {
      console.error('Contact email error:', error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Validate email address
   */
  validateEmail: (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },
};

export default emailService;
