# 🔑 GETTING YOUR VERCEL TOKEN

## Step 1: Get Your Vercel Token

1. Open this URL in your browser:
   https://vercel.com/account/tokens

2. Click "Create Token"

3. Enter a name (e.g., "MovieSpace Deploy")

4. Select validity: "No expiration" (for ongoing deploys)

5. Click "Create"

6. **COPY THE TOKEN** (shown only once!)

Example token looks like:
```
Cjvj_aBcDeFgHiJkLmNoPqRsT123456789
```

## Step 2: Set Token in PowerShell

Once you have the token, run this command in PowerShell:

```powershell
$env:VERCEL_TOKEN = "YOUR_TOKEN_HERE"
```

Replace `YOUR_TOKEN_HERE` with your actual token.

## Step 3: Verify Token Works

```powershell
vercel whoami
```

Should show your Vercel account name.

## Step 4: Deploy Backend

```powershell
cd 'C:\Users\Saurav\OneDrive\Desktop\Movies_Space\backend'
vercel deploy --prod
```

## Step 5: Deploy Frontend

```powershell
cd 'C:\Users\Saurav\OneDrive\Desktop\Movies_Space\movies_space'
vercel deploy --prod
```

---

## ⚠️ SECURITY NOTE

- Never commit your token to GitHub
- Token gives full access to your Vercel account
- Keep it private and secure
- You can revoke tokens anytime at: https://vercel.com/account/tokens

---

Once you have your token, paste it here and I'll deploy both projects!
