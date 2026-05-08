import express from 'express';
import nodemailer from 'nodemailer';

const router = express.Router();

/**
 * Email Service Route
 * Handles sending emails for movie requests and confirmations
 * Uses Nodemailer with environment-based configuration
 */

// Initialize email transporter
let transporter = null;

const initializeTransporter = () => {
  // Check required environment variables
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.warn('⚠️ Email service not configured. Set EMAIL_USER and EMAIL_PASS environment variables.');
    return null;
  }

  try {
    transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      },
      timeout: 10000,
      connectionTimeout: 10000
    });

    console.log('✅ Email transporter initialized successfully');
    return transporter;
  } catch (error) {
    console.error('❌ Failed to initialize email transporter:', error.message);
    return null;
  }
};

// Initialize transporter on startup
initializeTransporter();

/**
 * POST /api/email/send-email
 * Sends email for movie requests
 */
router.post('/send-email', async (req, res) => {
  try {
    const { template, to, data } = req.body;

    // Validate required fields
    if (!to || !template || !data) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: to, template, data'
      });
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(to)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid email address'
      });
    }

    // Check if transporter is available
    if (!transporter) {
      console.warn('⚠️ Email service not configured, skipping email send');
      return res.status(200).json({
        success: true,
        message: 'Email service not configured (skipped)',
        skipped: true
      });
    }

    let subject = '';
    let htmlContent = '';

    // Generate email based on template
    if (template === 'requestConfirmation') {
      subject = `Movie Request Confirmation - ${data.movieTitle}`;
      htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">📽️ Request Confirmation</h2>
          <p>Hi <strong>${data.userName}</strong>,</p>
          <p>Thank you for requesting <strong>${data.movieTitle}</strong>!</p>
          <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p><strong>Request Details:</strong></p>
            <ul>
              <li><strong>Title:</strong> ${data.movieTitle}</li>
              <li><strong>Type:</strong> ${data.requestType}</li>
              <li><strong>Message:</strong> ${data.message}</li>
            </ul>
          </div>
          <p>We'll review your request and get back to you soon!</p>
          <p style="color: #666; font-size: 12px; margin-top: 30px;">
            MovieSpace Team
          </p>
        </div>
      `;
    } else if (template === 'adminNotification') {
      subject = `New Movie Request: ${data.movieTitle}`;
      htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">🎬 New Movie Request</h2>
          <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p><strong>User:</strong> ${data.userName}</p>
            <p><strong>Email:</strong> ${data.userEmail}</p>
            <p><strong>Movie Title:</strong> ${data.movieTitle}</p>
            <p><strong>Request Type:</strong> ${data.requestType}</p>
            <p><strong>Message:</strong> ${data.message}</p>
          </div>
          <p style="color: #666; font-size: 12px; margin-top: 30px;">
            Sent: ${new Date().toLocaleString()}
          </p>
        </div>
      `;
    } else {
      return res.status(400).json({
        success: false,
        error: `Unknown template: ${template}`
      });
    }

    // Send email with timeout
    const emailPromise = transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: to,
      subject: subject,
      html: htmlContent,
      timeout: 10000
    });

    // Add timeout to prevent hanging requests
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Email send timeout')), 15000);
    });

    const result = await Promise.race([emailPromise, timeoutPromise]);

    console.log(`✅ Email sent successfully to ${to}. Message ID: ${result.messageId}`);

    return res.status(200).json({
      success: true,
      message: 'Email sent successfully',
      messageId: result.messageId
    });
  } catch (error) {
    console.error('❌ Email send error:', error.message);

    // Return error but with appropriate status
    return res.status(200).json({
      success: false,
      message: 'Failed to send email',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

/**
 * POST /api/email/test
 * Test email endpoint (development only)
 */
router.post('/test', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        error: 'Email address required'
      });
    }

    if (!transporter) {
      return res.status(503).json({
        success: false,
        error: 'Email service not configured'
      });
    }

    const result = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: '🎉 MovieSpace - Test Email',
      html: '<h2>Test Email</h2><p>Your email configuration is working!</p>'
    });

    return res.status(200).json({
      success: true,
      message: 'Test email sent',
      messageId: result.messageId
    });
  } catch (error) {
    console.error('❌ Test email error:', error.message);
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

export default router;
