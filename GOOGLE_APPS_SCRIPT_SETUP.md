# Google Apps Script Setup Guide

This guide will help you set up Google Apps Script to handle both data storage AND email sending for MovieSpace without requiring a backend server or external email services.

## Overview

MovieSpace now uses Google Apps Script as a lightweight backend to:
1. Store data in Google Sheets
2. Send confirmation emails via Gmail
3. Send admin notifications

All using only Google's native services - no external dependencies needed!

## Prerequisites

- Google Account
- Access to Google Drive
- Access to Google Apps Script
- Gmail account (for sending emails)

## Step 1: Create a Google Sheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Click "Create" → "Blank spreadsheet"
3. Name it "MovieSpace Data"
4. Create the following sheets:
   - **Users** - for user registrations
   - **Movies** - for movies/videos added
   - **Requests** - for movie requests

### Sheet Column Headers

#### Users Sheet:
- Column A: Name
- Column B: Email
- Column C: Registered At
- Column D: Status

#### Movies Sheet:
- Column A: Title
- Column B: Video URL
- Column C: Added By
- Column D: Added At
- Column E: Category

#### Requests Sheet:
- Column A: Name
- Column B: Email
- Column C: Title
- Column D: Type
- Column E: Message
- Column F: Requested At
- Column G: Status

## Step 2: Set Up Gmail App Password

Before creating the Apps Script, set up Gmail authentication:

1. Go to your [Google Account](https://myaccount.google.com)
2. Select "Security" from the left menu
3. Enable "2-Step Verification" if not already enabled
4. Go to [App passwords](https://myaccount.google.com/apppasswords)
5. Select "Mail" and "Windows Computer" (or your device type)
6. Click "Generate"
7. Copy the 16-character password shown
8. **Keep this password safe** - you'll need it in Step 3

## Step 3: Create Apps Script Project

1. Open your Google Sheet
2. Go to **Tools** → **Script Editor**
3. This will open Google Apps Script in a new tab
4. Replace the default code with the following:

```javascript
// Google Apps Script for MovieSpace
// Handles data storage in Google Sheets

// Get the spreadsheet and sheets
const ss = SpreadsheetApp.getActiveSpreadsheet();

// Get Gmail credentials from script properties
const GMAIL_ACCOUNT = PropertiesService.getScriptProperties().getProperty('GMAIL_ACCOUNT');
const GMAIL_APP_PASSWORD = PropertiesService.getScriptProperties().getProperty('GMAIL_APP_PASSWORD');

/**
 * Handle POST requests from frontend
 */
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const action = data.action;
    const payload = data.data;

    let result;

    switch (action) {
      case 'storeUser':
        result = storeUser(payload);
        break;
      case 'storeMovie':
        result = storeMovie(payload);
        break;
      case 'storeRequest':
        result = storeRequest(payload);
        break;
      case 'sendRequestEmail':
        result = sendRequestEmail(payload);
        break;
      case 'sendAdminEmail':
        result = sendAdminEmail(payload);
        break;
      case 'sendContactEmail':
        result = sendContactEmail(payload);
        break;
      default:
        result = { success: false, error: 'Unknown action' };
    }

    return ContentService.createTextOutput(JSON.stringify(result)).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ success: false, error: error.toString() })).setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Store user registration data
 */
function storeUser(data) {
  try {
    const sheet = ss.getSheetByName('Users');
    const lastRow = sheet.getLastRow();
    const newRow = lastRow + 1;

    sheet.getRange(newRow, 1).setValue(data.name);
    sheet.getRange(newRow, 2).setValue(data.email);
    sheet.getRange(newRow, 3).setValue(data.registeredAt);
    sheet.getRange(newRow, 4).setValue('active');

    return { success: true, message: 'User stored successfully', row: newRow };
  } catch (error) {
    Logger.log('Error in storeUser: ' + error.toString());
    return { success: false, error: error.toString() };
  }
}

/**
 * Store movie/video data
 */
function storeMovie(data) {
  try {
    const sheet = ss.getSheetByName('Movies');
    const lastRow = sheet.getLastRow();
    const newRow = lastRow + 1;

    sheet.getRange(newRow, 1).setValue(data.title);
    sheet.getRange(newRow, 2).setValue(data.videoUrl);
    sheet.getRange(newRow, 3).setValue(data.addedBy);
    sheet.getRange(newRow, 4).setValue(data.addedAt);
    sheet.getRange(newRow, 5).setValue('new');

    return { success: true, message: 'Movie stored successfully', row: newRow };
  } catch (error) {
    Logger.log('Error in storeMovie: ' + error.toString());
    return { success: false, error: error.toString() };
  }
}

/**
 * Store movie request data
 */
function storeRequest(data) {
  try {
    const sheet = ss.getSheetByName('Requests');
    const lastRow = sheet.getLastRow();
    const newRow = lastRow + 1;

    sheet.getRange(newRow, 1).setValue(data.name);
    sheet.getRange(newRow, 2).setValue(data.email);
    sheet.getRange(newRow, 3).setValue(data.title);
    sheet.getRange(newRow, 4).setValue(data.type);
    sheet.getRange(newRow, 5).setValue(data.message);
    sheet.getRange(newRow, 6).setValue(data.requestedAt);
    sheet.getRange(newRow, 7).setValue(data.status || 'pending');

    return { success: true, message: 'Request stored successfully', row: newRow };
  } catch (error) {
    Logger.log('Error in storeRequest: ' + error.toString());
    return { success: false, error: error.toString() };
  }
}

/**
 * Send request confirmation email via Gmail
 */
function sendRequestEmail(data) {
  try {
    if (!GMAIL_ACCOUNT || !GMAIL_APP_PASSWORD) {
      return { success: false, error: 'Gmail credentials not configured in script properties' };
    }

    const subject = `🎬 Your Movie Request Has Been Received - ${data.title}`;
    const htmlBody = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; background: #1a1a1a; color: #e0e0e0; padding: 40px 20px; border-radius: 8px;">
        <h1 style="color: #ff1744; text-align: center;">🎬 MovieSpace</h1>
        <h2 style="color: #00bcd4;">Request Received!</h2>
        
        <div style="background: #222; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ff1744;">
          <p><strong>Type:</strong> ${data.request_type}</p>
          <p><strong>Title:</strong> ${data.title}</p>
          <p><strong>Status:</strong> <span style="color: #4caf50;">✓ Received</span></p>
          <p><strong>Message:</strong> ${data.message}</p>
        </div>

        <p>Hi ${data.to_name},</p>
        <p>Thank you for requesting <strong>${data.title}</strong>! We've received your request and will review it shortly.</p>

        <div style="background: #222; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p><strong>What happens next?</strong></p>
          <ul>
            <li>Our team reviews your request</li>
            <li>If approved, we notify you</li>
            <li>You'll get an email when content is ready</li>
          </ul>
        </div>

        <p style="color: #999; font-size: 12px;">MovieSpace © 2026 | All Rights Reserved</p>
      </div>
    `;

    MailApp.sendEmail(data.to_email, subject, '', { htmlBody: htmlBody });
    
    Logger.log('✅ Request email sent to: ' + data.to_email);
    return { success: true, message: 'Email sent successfully' };
  } catch (error) {
    Logger.log('Error in sendRequestEmail: ' + error.toString());
    return { success: false, error: error.toString() };
  }
}

/**
 * Send admin notification email
 */
function sendAdminEmail(data) {
  try {
    const subject = `📌 New Movie Request: ${data.title}`;
    const htmlBody = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; background: #1a1a1a; color: #e0e0e0; padding: 40px 20px;">
        <h2 style="color: #ff1744;">New Movie Request</h2>
        
        <div style="background: #222; padding: 20px; border-radius: 8px;">
          <p><strong>From:</strong> ${data.user_name}</p>
          <p><strong>Email:</strong> ${data.user_email}</p>
          <p><strong>Type:</strong> ${data.request_type}</p>
          <p><strong>Title:</strong> ${data.title}</p>
          <p><strong>Message:</strong> ${data.message}</p>
          <p><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
        </div>
      </div>
    `;

    MailApp.sendEmail(data.to_email, subject, '', { htmlBody: htmlBody });
    
    Logger.log('✅ Admin email sent');
    return { success: true, message: 'Admin notification sent' };
  } catch (error) {
    Logger.log('Error in sendAdminEmail: ' + error.toString());
    return { success: false, error: error.toString() };
  }
}

/**
 * Send contact form email
 */
function sendContactEmail(data) {
  try {
    const subject = `Message from ${data.from_name}`;
    const htmlBody = `
      <div style="font-family: Arial, sans-serif;">
        <p><strong>From:</strong> ${data.from_name}</p>
        <p><strong>Email:</strong> ${data.from_email}</p>
        <p><strong>Message:</strong></p>
        <p>${data.message.replace(/\n/g, '<br>')}</p>
      </div>
    `;

    MailApp.sendEmail(data.to_email, subject, '', { htmlBody: htmlBody });
    
    Logger.log('✅ Contact email sent');
    return { success: true, message: 'Email sent successfully' };
  } catch (error) {
    Logger.log('Error in sendContactEmail: ' + error.toString());
    return { success: false, error: error.toString() };
  }
}
```

5. Click **Save** and give your script a name (e.g., "MovieSpace Backend")

## Step 3: Add Gmail Configuration

1. In the Apps Script editor, click **Edit** → **Project settings** (at the bottom left)
2. Under "Script properties", click **Add property**
3. Add these two properties:
   - **Property name:** `GMAIL_ACCOUNT` | **Value:** your gmail address (e.g., your-email@gmail.com)
   - **Property name:** `GMAIL_APP_PASSWORD` | **Value:** The 16-character app password from Step 2

4. Click **Save**

## Step 4: Deploy as Web App

1. In the Apps Script editor, click **Deploy** → **New deployment**
2. Click the dropdown and select **Web app**
3. Configure:
   - **Execute as**: Your Google Account
   - **Who has access**: Anyone
4. Click **Deploy**
5. Copy the **Deployment URL** - this is your `VITE_GOOGLE_APPS_SCRIPT_URL`
6. Click **Authorize access** and grant permissions

Your deployment URL will look like:
```
https://script.google.com/macros/d/YOUR_SCRIPT_ID/usercontent
```

## Step 4: Update Frontend Configuration

1. Open `.env` file in the frontend (`movies_space/` directory)
2. Update `VITE_GOOGLE_APPS_SCRIPT_URL` with your deployment URL:

```
VITE_GOOGLE_APPS_SCRIPT_URL=https://script.google.com/macros/d/YOUR_SCRIPT_ID/usercontent
```

## Step 5: Test the Integration

1. Start the frontend development server
2. Go to the app and try:
   - Creating an account (should store data in Users sheet)
   - Making a movie request (should store in Requests sheet)
   - Adding new content (should store in Movies sheet)

3. Go back to your Google Sheet to verify the data is being stored

## Troubleshooting

### CORS Errors
If you get CORS errors, make sure your Apps Script deployment is set to "Anyone" can access.

### Script Won't Save Data
- Check the Apps Script logs: **View** → **Logs**
- Make sure sheet names match exactly (case-sensitive)
- Ensure the script is properly deployed

### Empty Data in Sheets
- Verify the column order matches the script
- Check that data is being sent from the frontend (check browser console)

## Security Notes

⚠️ **Important**: This setup makes your Google Sheet publicly accessible for writing. For production:

1. Consider adding authentication
2. Validate input data on the Apps Script side
3. Implement rate limiting
4. Use service accounts for sensitive operations
5. Consider switching to Firebase or a proper backend for sensitive data

## Next Steps

- Set up email notifications (see EMAIL_SETUP_GUIDE.md)
- Configure EmailJS for sending confirmation emails
- Add data validation and filtering

## Resources

- [Google Apps Script Documentation](https://developers.google.com/apps-script)
- [Apps Script Quotas and Limits](https://developers.google.com/apps-script/guides/services/quotas)
- [Deploy Apps Script as Web App](https://developers.google.com/apps-script/guides/web)
