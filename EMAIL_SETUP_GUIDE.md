# Email Notification Setup Guide

## Overview

MovieSpace now sends email confirmations when users request movies or series. Currently running in **demo mode** but ready for real email integration.

---

## Current Features

✅ **Email field** in request form (pre-filled: souravshakya951@gmail.com)  
✅ **Email validation** on form submission  
✅ **Confirmation message** to user  
✅ **Admin notification** system ready  
✅ **Email templates** included  
✅ **Demo mode** logs emails to console  

---

## How It Currently Works (Demo Mode)

1. User fills request form with their email
2. Submits the form
3. Email service logs confirmation to console
4. Shows success message to user
5. Request saved to app store

**Check your browser console (F12)** to see email logs!

---

## To Enable Real Email Notifications

### Option 1: Nodemailer (Backend Node.js)

**Best for**: Full control, self-hosted

#### Setup:

1. **Install dependencies:**
```bash
npm install nodemailer dotenv
```

2. **Create backend email route** (`backend/routes/email.js`):
```javascript
const express = require('express');
const nodemailer = require('nodemailer');
const router = express.Router();

// Configure your email provider
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD, // App-specific password
  },
});

router.post('/send-request-confirmation', async (req, res) => {
  const { email, title, type, id } = req.body;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: `🎬 Movie Request Received - MovieSpace`,
    html: generateEmailTemplate(req.body),
  };

  try {
    await transporter.sendMail(mailOptions);
    res.json({ success: true, message: 'Email sent' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
```

3. **Create .env file:**
```env
EMAIL_USER=souravshakya951@gmail.com
EMAIL_PASSWORD=your_app_specific_password
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
```

4. **Enable Gmail 2-Factor Auth and create App Password:**
   - Go to [myaccount.google.com](https://myaccount.google.com)
   - Security → 2-Step Verification → App passwords
   - Select "Mail" and "Windows Computer"
   - Copy the generated 16-character password
   - Use it as `EMAIL_PASSWORD` in .env

---

### Option 2: SendGrid (Cloud Service)

**Best for**: Scalability, reliability, professional

#### Setup:

1. **Create SendGrid account:**
   - Go to [sendgrid.com](https://sendgrid.com)
   - Sign up free (500 emails/month)
   - Get API key

2. **Install SendGrid npm package:**
```bash
npm install @sendgrid/mail
```

3. **Create backend route:**
```javascript
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

app.post('/api/send-email', async (req, res) => {
  const msg = {
    to: req.body.email,
    from: 'notifications@moviespace.com',
    subject: 'Movie Request Received',
    html: req.body.htmlContent,
  };

  try {
    await sgMail.send(msg);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

4. **Set environment variable:**
```env
SENDGRID_API_KEY=your_api_key_here
```

---

### Option 3: Mailgun (Simple & Free)

**Best for**: Developers, fast setup

#### Setup:

1. **Create Mailgun account:**
   - Go to [mailgun.com](https://www.mailgun.com)
   - Sign up (10,000 emails/month free)

2. **Install axios:**
```bash
npm install axios
```

3. **Create backend route:**
```javascript
const axios = require('axios');

app.post('/api/send-email', async (req, res) => {
  try {
    const response = await axios.post(
      `https://api.mailgun.net/v3/${process.env.MAILGUN_DOMAIN}/messages`,
      {
        from: `MovieSpace <notifications@${process.env.MAILGUN_DOMAIN}>`,
        to: req.body.email,
        subject: req.body.subject,
        html: req.body.html,
      },
      {
        auth: {
          username: 'api',
          password: process.env.MAILGUN_API_KEY,
        },
      }
    );

    res.json({ success: true, id: response.data.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

4. **Set environment variables:**
```env
MAILGUN_DOMAIN=sandbox123abc.mailgun.org
MAILGUN_API_KEY=key-your_key_here
```

---

### Option 4: AWS SES (Enterprise)

**Best for**: Large scale, enterprise

1. **Set up AWS SES:**
   - Go to AWS Console → SES
   - Verify your email address
   - Request production access

2. **Install AWS SDK:**
```bash
npm install aws-sdk
```

3. **Configure and send emails using AWS SDK**

---

## Frontend Integration

### Update emailService.js

Replace the demo code with your API call:

```javascript
// In src/services/emailService.js
export const emailService = {
  sendRequestConfirmationEmail: async (requestData) => {
    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: requestData.email,
          subject: `🎬 Movie Request Received - ${requestData.title}`,
          htmlContent: emailService.generateRequestEmailTemplate(requestData),
        }),
      });

      const result = await response.json();
      return result;
    } catch (error) {
      throw new Error('Failed to send email: ' + error.message);
    }
  },
  // ... rest of code
};
```

---

## Email Templates Included

The app includes a professional HTML email template with:
- ✅ MovieSpace branding
- ✅ Request details
- ✅ Call to action
- ✅ Next steps information
- ✅ Footer with contact info
- ✅ Mobile responsive design

---

## Testing Email

### In Demo Mode
1. Open browser DevTools (F12)
2. Go to Console tab
3. Request a movie
4. Look for "📧 Email would be sent to:" message

### With Real Email Service
1. Request a movie
2. Check your email inbox
3. Should receive confirmation within 2-3 minutes

---

## Email Notifications Included

### 1. **Request Confirmation Email**
- Sent to: User's email address
- When: Immediately after request submission
- Contains: Request details, ID, next steps

### 2. **Admin Notification**
- Sent to: Admin email address
- When: When new request is submitted
- Contains: Request details, user info, genres

### 3. **Content Available Email** (Future)
- Sent to: Users who requested the content
- When: Content is added to MovieSpace
- Contains: How to watch, link to content

---

## Gmail Setup (Easiest for Testing)

### Step-by-Step:

1. **Enable 2-Factor Authentication:**
   - Go to [myaccount.google.com](https://myaccount.google.com)
   - Click "Security" in the left menu
   - Find "2-Step Verification"
   - Complete the setup

2. **Generate App Password:**
   - Go to [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
   - Select "Mail" and "Windows Computer"
   - Google generates a 16-character password
   - Copy this password

3. **Update .env:**
```env
EMAIL_USER=souravshakya951@gmail.com
EMAIL_PASSWORD=xxxx xxxx xxxx xxxx
```

4. **Test the email service:**
```bash
npm start
```

---

## Environment Variables Template

Create a `.env` file in your backend directory:

```env
# Email Configuration
EMAIL_SERVICE=gmail  # or sendgrid, mailgun, aws
EMAIL_USER=souravshakya951@gmail.com
EMAIL_PASSWORD=your_app_password
EMAIL_FROM_NAME=MovieSpace

# For SendGrid
SENDGRID_API_KEY=your_api_key

# For Mailgun
MAILGUN_API_KEY=your_api_key
MAILGUN_DOMAIN=your_domain

# For AWS SES
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_key
AWS_SECRET_ACCESS_KEY=your_secret

# General
BACKEND_URL=http://localhost:3001
FRONTEND_URL=http://localhost:5173
```

---

## Security Best Practices

1. **Never commit .env files** - Add to `.gitignore`
2. **Use app-specific passwords** - Not your main password
3. **Validate email addresses** - Already done in emailService.js
4. **Rate limit emails** - Prevent spam
5. **Use HTTPS** - For production
6. **Store email logs** - For auditing
7. **Implement unsubscribe** - Legal requirement

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| "Invalid password" | Check Gmail app password setup |
| "SMTP error" | Verify SMTP credentials in .env |
| "Email not sent" | Check spam folder, verify recipient |
| "Rate limited" | Wait, reduce send frequency |
| "Invalid domain" | Verify Mailgun/SendGrid setup |

---

## Testing Checklist

- [ ] Email service installed
- [ ] Environment variables set
- [ ] API endpoint created
- [ ] Email template configured
- [ ] Test email received
- [ ] Sender name shows correctly
- [ ] Email contains all details
- [ ] Mobile view looks good
- [ ] Links work properly
- [ ] No spam folder issues

---

## Next Steps

1. **Choose email service** (Gmail easiest for testing)
2. **Set up environment variables**
3. **Create backend API endpoint**
4. **Update emailService.js with real API call**
5. **Test with your email address**
6. **Monitor email delivery**
7. **Set up error logging**

---

## Support

### SendGrid Docs
- [SendGrid Node.js Library](https://github.com/sendgrid/sendgrid-nodejs)
- [Send First Email](https://docs.sendgrid.com/for-developers/sending-email/v3-nodejs)

### Mailgun Docs
- [Mailgun API Documentation](https://documentation.mailgun.com/en/latest/api_reference.html)

### Nodemailer Docs
- [Nodemailer Documentation](https://nodemailer.com/)
- [Gmail Setup Guide](https://support.google.com/accounts/answer/185833)

---

**Current Status**: ✅ Demo Mode Ready  
**Production Status**: ⏳ Waiting for Email Service Setup  
**Difficulty**: ⭐⭐ Easy (Gmail) to ⭐⭐⭐⭐ Complex (Full Backend)  

Start with Gmail + Nodemailer for simplest setup! 🚀
