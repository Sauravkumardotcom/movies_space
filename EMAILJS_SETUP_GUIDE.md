# EmailJS Setup Guide for MovieSpace

This guide will help you set up EmailJS to send emails directly from the frontend without requiring a backend server.

## Overview

MovieSpace now uses EmailJS to send confirmation emails and notifications directly from the frontend. This eliminates the need for Nodemailer on the backend.

## Prerequisites

- EmailJS Account (free tier available)
- Gmail account (or other email provider)
- Frontend environment variables configured

## Step 1: Create EmailJS Account

1. Go to [EmailJS](https://www.emailjs.com)
2. Click **Sign Up** and create a free account
3. Verify your email address

## Step 2: Connect Your Email Service

### Option A: Using Gmail (Recommended)

1. In EmailJS Dashboard, go to **Email Services**
2. Click **Add Service**
3. Select **Gmail**
4. Click **Connect with Gmail**
5. Sign in with your Gmail account
6. Grant EmailJS permission to send emails

### Option B: Using Other Email Providers

1. In EmailJS Dashboard, go to **Email Services**
2. Click **Add Service**
3. Select your email provider (Outlook, Yahoo, etc.)
4. Follow the provider-specific setup instructions

**Note**: For Gmail with 2FA enabled:
- Use an [App Password](https://myaccount.google.com/apppasswords) instead of your regular password
- This is more secure than disabling 2FA

## Step 3: Get Your Service ID

1. After connecting your email service, note the **Service ID**
2. It will look like: `service_xxxxxxxxxx`
3. Keep this for later

## Step 4: Create Email Templates

### Template 1: Movie Request Confirmation (User Email)

1. Go to **Email Templates**
2. Click **Create New Template**
3. Name it: "Movie Request Confirmation"
4. Set the **To Email** to: `{{to_email}}`

**Template Content Example:**

```
Subject: 🎬 Your Movie Request Has Been Received - {{title}}

---

<div style="font-family: Arial, sans-serif; max-width: 600px; background: #1a1a1a; color: #e0e0e0; padding: 40px 20px; border-radius: 8px;">
  <h1 style="color: #ff1744; text-align: center;">🎬 MovieSpace</h1>
  
  <p>Hi {{to_name}},</p>
  
  <p>Thank you for requesting <strong style="color: #ff1744;">{{title}}</strong>!</p>
  
  <div style="background: #222; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ff1744;">
    <p><strong>Your Request Details:</strong></p>
    <ul>
      <li><strong>Type:</strong> {{request_type}}</li>
      <li><strong>Title:</strong> {{title}}</li>
      <li><strong>Status:</strong> ✓ Received</li>
    </ul>
    <p>{{message}}</p>
  </div>
  
  <p><strong>What happens next?</strong></p>
  <ul>
    <li>Our team reviews your request</li>
    <li>If approved, we'll notify you when it's available</li>
    <li>You'll receive an email when the content is ready to watch</li>
  </ul>
  
  <p style="margin-top: 30px; color: #999; font-size: 12px;">
    MovieSpace © 2026 | All Rights Reserved<br>
    This is an automated email. Please do not reply.
  </p>
</div>
```

5. Copy the **Template ID** (looks like: `template_xxxxxxxxxx`)

### Template 2: Admin Notification

1. Click **Create New Template**
2. Name it: "Admin Notification - Movie Request"
3. Set the **To Email** to: `{{admin_email}}`

**Template Content Example:**

```
Subject: 📌 New Movie Request: {{title}}

---

<div style="font-family: Arial, sans-serif; max-width: 600px; background: #1a1a1a; color: #e0e0e0; padding: 40px 20px;">
  <h2 style="color: #ff1744;">New Movie Request</h2>
  
  <div style="background: #222; padding: 20px; border-radius: 8px;">
    <p><strong>From:</strong> {{user_name}}</p>
    <p><strong>Email:</strong> {{user_email}}</p>
    <p><strong>Type:</strong> {{request_type}}</p>
    <p><strong>Title:</strong> {{title}}</p>
    <p><strong>Message:</strong> {{message}}</p>
    <p><strong>Submitted:</strong> Just now</p>
  </div>
</div>
```

5. Copy this **Template ID** as well

### Template 3: Contact Form Email (Optional)

1. Click **Create New Template**
2. Name it: "Contact Form"
3. Set the **To Email** to: `{{to_email}}`

Use similar HTML structure for consistency.

## Step 5: Get Your Public Key

1. Go to **Account** → **API Keys**
2. Copy your **Public Key** (looks like: `xxxxxxxxxxxxxxxxxx`)
3. This is your `VITE_EMAILJS_PUBLIC_KEY`

## Step 6: Update Frontend Configuration

1. Open the frontend `.env` file (`movies_space/.env`)
2. Add/update the following:

```env
VITE_EMAILJS_PUBLIC_KEY=your_public_key_here
VITE_EMAILJS_SERVICE_ID=service_xxxxxxxxxx
VITE_EMAILJS_REQUEST_TEMPLATE_ID=template_xxxxxxxxxx
VITE_EMAILJS_ADMIN_TEMPLATE_ID=template_xxxxxxxxxx
VITE_EMAILJS_CONTACT_TEMPLATE_ID=template_xxxxxxxxxx
VITE_ADMIN_EMAIL=your_admin_email@gmail.com
```

3. Save the `.env` file

## Step 7: Install EmailJS Package (Frontend)

If not already installed, install the EmailJS npm package:

```bash
cd movies_space
npm install @emailjs/browser
```

## Step 8: Test Email Sending

1. Start the frontend development server
2. Go to the application
3. Try to make a movie request
4. Check if you receive an email

**Debug Tips:**
- Check browser console for errors
- Check EmailJS Dashboard → Activity for failed attempts
- Verify environment variables are set correctly

## Step 9: Customize Email Templates

You can use the following variables in your templates:

### Movie Request Template Variables:
- `{{to_email}}` - Recipient email
- `{{to_name}}` - Recipient name
- `{{title}}` - Movie/Series title
- `{{request_type}}` - Type (movie, series, documentary)
- `{{message}}` - User's additional message
- `{{admin_email}}` - Admin email address

### Admin Notification Variables:
- `{{admin_email}}` - Admin email
- `{{user_name}}` - Requester name
- `{{user_email}}` - Requester email
- `{{request_type}}` - Type of request
- `{{title}}` - Content title
- `{{message}}` - User message

## Free Tier Limits

EmailJS free tier includes:
- **200 emails per month** (free tier)
- Unlimited email addresses
- Basic templates
- Email history for 7 days

## Troubleshooting

### "No data provided for template variables"
- Make sure all template variables are being passed from the frontend
- Check the variable names match exactly (case-sensitive)

### Emails not sending
- Verify service is connected properly
- Check that Gmail account has 2FA disabled (or use App Password)
- Look at EmailJS Activity dashboard for errors

### CORS Issues
- EmailJS handles CORS automatically
- Make sure Public Key is correct
- Check browser console for specific errors

### Emails going to spam
- Whitelist MovieSpace in your email provider
- Use a dedicated email service domain
- Consider using a transactional email service for production

## Production Recommendations

For production use:

1. **Upgrade to Paid Plan**: More emails per month (10,000+)
2. **Use a Domain Email**: Instead of Gmail personal account
3. **Add SPF/DKIM Records**: For better deliverability
4. **Monitor Email Bounces**: Check for invalid addresses
5. **Implement Unsubscribe**: For newsletter-type emails

## Resources

- [EmailJS Documentation](https://www.emailjs.com/docs/)
- [EmailJS Templates](https://www.emailjs.com/docs/user-guide/templates/)
- [SMTP Configuration](https://www.emailjs.com/docs/user-guide/smtp/)
- [FAQ](https://www.emailjs.com/docs/faqs/)

## Support

For issues with EmailJS:
- Check [EmailJS Status](https://www.emailjs.com/status)
- Visit [EmailJS Help](https://www.emailjs.com/docs/)
- Contact [EmailJS Support](https://www.emailjs.com/)

---

## Summary

You now have:
✅ EmailJS account set up
✅ Email service connected
✅ Email templates created
✅ Frontend environment variables configured
✅ Email functionality integrated

Your MovieSpace app can now send confirmation emails and notifications without requiring a backend server!
