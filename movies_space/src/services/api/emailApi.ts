import client from './client';

/**
 * Email validation utility
 * Fixes Issue #03: Missing validateEmail export
 */
export const validateEmail = (email: string): boolean => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

/**
 * Email API Service
 * Sends emails via backend (Nodemailer or Google Apps Script fallback)
 */
export const emailApi = {
  /**
   * Send request confirmation email to user
   */
  sendRequestConfirmation: async (data: {
    email: string;
    name: string;
    title: string;
    type: string;
    description?: string;
  }) => {
    if (!validateEmail(data.email)) {
      throw new Error('Invalid email address');
    }

    try {
      return await client.post('/api/send-email', {
        template: 'requestConfirmation',
        to: data.email,
        data: {
          userName: data.name,
          movieTitle: data.title,
          requestType: data.type,
          message: data.description || 'N/A',
        },
      });
    } catch (error) {
      console.error('Failed to send confirmation email:', error);
      throw new Error('Failed to send confirmation email. Please try again.');
    }
  },

  /**
   * Send admin notification email
   */
  sendAdminNotification: async (data: {
    email: string;
    name: string;
    title: string;
    type: string;
    description?: string;
  }) => {
    const adminEmail = '';
    // import.meta.env.VITE_ADMIN_EMAIL can be set in .env file
    if (!adminEmail) {
      console.warn('Admin email not configured. Skipping admin notification.');
      return { success: true, skipped: true };
    }

    try {
      return await client.post('/api/send-email', {
        template: 'adminNotification',
        to: adminEmail,
        data: {
          userName: data.name,
          userEmail: data.email,
          movieTitle: data.title,
          requestType: data.type,
          message: data.description || 'N/A',
        },
      });
    } catch (error) {
      console.error('Failed to send admin notification:', error);
      // Don't throw - this is not critical for user flow
      return { success: false, error: (error as Error).message };
    }
  },
};
