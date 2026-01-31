# Backend Setup & Email Integration Guide

## ✅ Backend Server Setup Complete

Your Express.js backend server is ready to handle email sending for MovieSpace!

---

## 🚀 Getting Started

### Step 1: Install Backend Dependencies

```bash
cd backend
npm install
```

This installs:
- `express` - Web server
- `nodemailer` - Email sending
- `cors` - Cross-origin requests
- `dotenv` - Environment variables

### Step 2: Configure Gmail

You have **two options** to send emails:

#### **Option A: Gmail App Password (Recommended - Easiest)**

1. **Enable 2-Factor Authentication on your Gmail account**
   - Go to https://myaccount.google.com/security
   - Find "2-Step Verification" and enable it

2. **Generate App Password**
   - Go to https://myaccount.google.com/apppasswords
   - Select "Mail" and "Windows Computer"
   - Google will generate a 16-character password
   - Copy this password

3. **Update `.env` file** (in the `backend/` folder)
   ```
   PORT=5000
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=xxxx xxxx xxxx xxxx
   ADMIN_EMAIL=Souravshakya951@gmail.com
   NODE_ENV=development
   FRONTEND_URL=http://localhost:5173
   ```
   - Replace `your-email@gmail.com` with your Gmail address
   - Replace `xxxx xxxx xxxx xxxx` with the 16-character App Password

#### **Option B: Gmail SMTP (If App Password fails)**

1. Go to https://myaccount.google.com/security
2. Enable "Less secure app access"
3. Use your regular Gmail password in `.env`

### Step 3: Start Both Servers

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

You should see:
```
🚀 MovieSpace Backend Server Running on http://localhost:5000
📧 Email Service: ✓ Configured
🌐 CORS Origin: http://localhost:5173
```

**Terminal 2 - Frontend (keep existing running):**
```bash
cd movies_space
npm run dev
```

---

## 📧 Email Endpoints

### 1. **Send Movie Request Confirmation**

**Endpoint:** `POST /api/send-request-confirmation`

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "requestType": "movie",
  "title": "Avatar 3",
  "message": "Can't wait to watch this!"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Confirmation email sent successfully!",
  "email": "john@example.com"
}
```

**What it does:**
- Sends professional confirmation email to user
- Sends admin notification to Souravshakya951@gmail.com
- Both emails include request details and branding

### 2. **Generic Email Endpoint**

**Endpoint:** `POST /api/send-email`

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "message": "Your message here"
}
```

### 3. **Health Check**

**Endpoint:** `GET /api/health`

**Response:**
```json
{
  "status": "Backend server is running"
}
```

---

## 🔗 Frontend Integration

Your frontend is **already updated** to use the backend! Here's what changed:

### emailService.js Updates
```javascript
// Before (Demo Mode)
sendRequestConfirmationEmail: async (requestData) => {
  console.log('📧 Email would be sent...');
  // Logs to console
}

// After (Real Email)
sendRequestConfirmationEmail: async (requestData) => {
  const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
  const response = await fetch(`${API_URL}/api/send-request-confirmation`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({...})
  });
  return response.json();
}
```

---

## 🧪 Testing Email

### Manual Test with cURL:

```bash
curl -X POST http://localhost:5000/api/send-request-confirmation \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "requestType": "movie",
    "title": "Test Movie",
    "message": "Test message"
  }'
```

### Test in App:

1. Open MovieSpace at http://localhost:5173
2. Click the blue **"Request"** button (top right)
3. Fill in the form:
   - Type: Movie
   - Title: Avatar 3
   - Release Year: 2025
   - Genres: Sci-Fi
   - Description: Amazing movie!
   - Reason: Love the franchise
   - Email: (pre-filled with your email)
4. Click **"Submit Request"**
5. Check your email inbox for confirmation!

---

## 🛠️ Troubleshooting

### Email Not Sending?

**1. Check if backend is running:**
```bash
curl http://localhost:5000/api/health
```

Should return: `{"status":"Backend server is running"}`

**2. Check backend console for errors:**
```
Error sending email: [error message]
```

**3. Verify .env file in backend/ folder:**
- `EMAIL_USER` is correct Gmail address
- `EMAIL_PASS` is the 16-character App Password (with/without spaces)
- `ADMIN_EMAIL` is correct

**4. Gmail 2-Factor Authentication Required:**
```
Error: Invalid login credentials
Solution: Use App Password, NOT regular password
```

**5. CORS Error in browser console:**
```
Access to XMLHttpRequest blocked by CORS policy
Solution: Make sure backend is running and FRONTEND_URL in .env is correct
```

**6. "Cannot find module 'nodemailer'":**
```bash
cd backend
npm install
```

---

## 📧 Email Template Features

Your emails are **professional and mobile-responsive**:

✅ Dark theme (matches your app)
✅ Red/Blue branding colors (#ff1744, #00bcd4)
✅ Request details included
✅ Next steps information
✅ Mobile-friendly HTML
✅ Admin dashboard link (ready for future)

---

## 🔒 Security Notes

1. **Never commit `.env` file:**
   - It's already in `.gitignore`
   - Keep credentials safe!

2. **Use App Password, NOT regular Gmail password**
   - More secure
   - Works better with Nodemailer
   - Can be revoked if leaked

3. **CORS is configured:**
   - Only allows requests from `http://localhost:5173`
   - Update `FRONTEND_URL` when deploying

---

## 🚀 Deployment (Future)

When deploying to production:

1. **Update `.env` in backend:**
   ```
   FRONTEND_URL=https://yourdomain.com
   NODE_ENV=production
   ```

2. **Use production email service:**
   - SendGrid (best for scale)
   - Mailgun (developer-friendly)
   - AWS SES (enterprise)
   - Keep Gmail for testing

3. **Deploy backend separately:**
   - Heroku, Vercel, AWS Lambda, DigitalOcean, etc.
   - Update frontend `VITE_BACKEND_URL` to production backend URL

---

## 📚 API Reference

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/health` | Check if backend is running |
| POST | `/api/send-request-confirmation` | Send movie request email |
| POST | `/api/send-email` | Generic email endpoint |

---

## 🎯 Next Steps

1. ✅ Install backend dependencies (`npm install`)
2. ✅ Configure Gmail credentials in `.env`
3. ✅ Start backend server (`npm run dev`)
4. ✅ Test email sending in the app
5. 📋 View email logs in Node.js console
6. 🚀 Deploy when ready!

---

**Questions or issues?** Check the troubleshooting section above or review the backend server logs for detailed error messages.
