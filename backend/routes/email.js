import express from 'express';
import nodemailer from 'nodemailer';
import cors from 'cors';

const router = express.Router();

/**
 * ==========================================
 * CORS CONFIGURATION
 * ==========================================
 */

const allowedOrigins = [
  'https://movies-space-shakyalabs.vercel.app',
  'https://movies-space03.vercel.app',
  'https://movies-space-brown.vercel.app',
  'http://localhost:3000',
  'http://localhost:5173',
  'http://localhost:5174'
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) {
      return callback(null, true);
    }

    if (allowedOrigins.includes(origin) || origin.endsWith('.vercel.app')) {
      return callback(null, true);
    }

    callback(new Error('Not allowed by CORS'));
  },
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin'],
  credentials: true,
  optionsSuccessStatus: 200,
};

/**
 * ==========================================
 * EMAIL TRANSPORTER
 * ==========================================
 */

let transporter = null;

const initializeTransporter = () => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.warn(
      '⚠️ EMAIL_USER or EMAIL_PASS environment variables are missing'
    );
    return null;
  }

  try {
    transporter = nodemailer.createTransport({
      service: 'gmail',

      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },

      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 10000,
    });

    console.log('✅ Email transporter initialized successfully');

    return transporter;
  } catch (error) {
    console.error(
      '❌ Failed to initialize email transporter:',
      error.message
    );

    return null;
  }
};

// Initialize transporter
initializeTransporter();

/**
 * ==========================================
 * OPTIONS HANDLER (VERY IMPORTANT FOR CORS)
 * ==========================================
 */

router.options('/send-email', cors(corsOptions));

router.options('/test', cors(corsOptions));

/**
 * ==========================================
 * SEND EMAIL ROUTE
 * ==========================================
 */

router.post(
  '/send-email',
  cors(corsOptions),
  async (req, res) => {
    /**
     * MANUAL CORS HEADERS
     * Important for Vercel serverless functions
     */
    const requestOrigin = req.headers.origin || 'https://movies-space-shakyalabs.vercel.app';
    res.setHeader('Access-Control-Allow-Origin', requestOrigin);
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept, Origin');
    res.setHeader('Access-Control-Allow-Credentials', 'true');

    try {
      /**
       * VALIDATE METHOD
       */

      if (req.method !== 'POST') {
        return res.status(405).json({
          success: false,
          message: 'Method not allowed',
        });
      }

      /**
       * REQUEST DATA
       */

      const { template, to, data } = req.body;

      /**
       * VALIDATION
       */

      if (!template || !to || !data) {
        return res.status(400).json({
          success: false,
          error: 'Missing required fields: template, to, data',
        });
      }

      /**
       * EMAIL VALIDATION
       */

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailRegex.test(to)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid email address',
        });
      }

      /**
       * CHECK EMAIL SERVICE
       */

      if (!transporter) {
        console.warn(
          '⚠️ Email transporter not configured'
        );

        return res.status(503).json({
          success: false,
          error: 'Email service unavailable',
        });
      }

      let subject = '';
      let htmlContent = '';

      /**
       * REQUEST CONFIRMATION EMAIL
       */

      if (template === 'requestConfirmation') {
        subject = `🎬 Movie Request Confirmation - ${data.movieTitle}`;

        htmlContent = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            
            <h2 style="color: #333;">
              🎥 Request Confirmation
            </h2>

            <p>
              Hi <strong>${data.userName}</strong>,
            </p>

            <p>
              Thank you for requesting 
              <strong>${data.movieTitle}</strong>.
            </p>

            <div style="
              background: #f5f5f5;
              padding: 20px;
              border-radius: 8px;
              margin: 20px 0;
            ">

              <h3>Request Details</h3>

              <p>
                <strong>Movie:</strong> ${data.movieTitle}
              </p>

              <p>
                <strong>Type:</strong> ${data.requestType}
              </p>

              <p>
                <strong>Message:</strong> ${data.message}
              </p>

            </div>

            <p>
              We'll review your request soon.
            </p>

            <p style="
              margin-top: 30px;
              color: #666;
              font-size: 12px;
            ">
              MovieSpace Team
            </p>

          </div>
        `;
      }

      /**
       * ADMIN NOTIFICATION EMAIL
       */

      else if (template === 'adminNotification') {
        subject = `📩 New Movie Request - ${data.movieTitle}`;

        htmlContent = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            
            <h2 style="color: #333;">
              🎬 New Movie Request
            </h2>

            <div style="
              background: #f5f5f5;
              padding: 20px;
              border-radius: 8px;
              margin: 20px 0;
            ">

              <p>
                <strong>User:</strong> ${data.userName}
              </p>

              <p>
                <strong>Email:</strong> ${data.userEmail}
              </p>

              <p>
                <strong>Movie:</strong> ${data.movieTitle}
              </p>

              <p>
                <strong>Type:</strong> ${data.requestType}
              </p>

              <p>
                <strong>Message:</strong> ${data.message}
              </p>

            </div>

            <p style="
              margin-top: 30px;
              color: #666;
              font-size: 12px;
            ">
              Sent: ${new Date().toLocaleString()}
            </p>

          </div>
        `;
      }

      /**
       * UNKNOWN TEMPLATE
       */

      else {
        return res.status(400).json({
          success: false,
          error: `Unknown template: ${template}`,
        });
      }

      /**
       * SEND EMAIL
       */

      const emailPromise = transporter.sendMail({
        from: process.env.EMAIL_USER,
        to,
        subject,
        html: htmlContent,
      });

      /**
       * PREVENT HANGING REQUESTS
       */

      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => {
          reject(new Error('Email send timeout'));
        }, 15000);
      });

      const result = await Promise.race([
        emailPromise,
        timeoutPromise,
      ]);

      console.log(
        `✅ Email sent successfully to ${to}`
      );

      return res.status(200).json({
        success: true,
        message: 'Email sent successfully',
        messageId: result.messageId,
      });

    } catch (error) {

      console.error(
        '❌ Email send error:',
        error
      );

      return res.status(500).json({
        success: false,
        message: 'Failed to send email',
        error:
          process.env.NODE_ENV === 'development'
            ? error.message
            : 'Internal server error',
      });
    }
  }
);

/**
 * ==========================================
 * TEST EMAIL ROUTE
 * ==========================================
 */

router.post(
  '/test',
  cors(corsOptions),
  async (req, res) => {

    res.setHeader(
      'Access-Control-Allow-Origin',
      'https://movies-space-shakyalabs.vercel.app'
    );

    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({
          success: false,
          error: 'Email address required',
        });
      }

      if (!transporter) {
        return res.status(503).json({
          success: false,
          error: 'Email service unavailable',
        });
      }

      const result = await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: '🎉 MovieSpace Test Email',
        html: `
          <h2>Test Email</h2>
          <p>Email configuration is working correctly.</p>
        `,
      });

      return res.status(200).json({
        success: true,
        message: 'Test email sent successfully',
        messageId: result.messageId,
      });

    } catch (error) {

      console.error(
        '❌ Test email error:',
        error
      );

      return res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }
);

export default router;