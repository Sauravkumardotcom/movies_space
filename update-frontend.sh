#!/bin/bash
# Frontend Update Script - Updates backend URL and redeploys
# Usage: bash update-frontend.sh https://your-new-backend-url.vercel.app

if [ -z "$1" ]; then
  echo "❌ Error: Backend URL required"
  echo "Usage: bash update-frontend.sh https://your-new-backend-url.vercel.app"
  exit 1
fi

NEW_BACKEND_URL=$1

echo "🔄 Updating frontend with new backend URL..."
echo "New Backend URL: $NEW_BACKEND_URL"
echo ""

# Update frontend .env.production
FRONTEND_ENV="movies_space/.env.production"

if [ ! -f "$FRONTEND_ENV" ]; then
  echo "❌ Error: $FRONTEND_ENV not found"
  exit 1
fi

# Backup current config
cp "$FRONTEND_ENV" "$FRONTEND_ENV.backup"
echo "💾 Backed up current config to $FRONTEND_ENV.backup"

# Update the backend URL
sed -i.tmp "s|VITE_BACKEND_URL=.*|VITE_BACKEND_URL=$NEW_BACKEND_URL|g" "$FRONTEND_ENV"
rm -f "$FRONTEND_ENV.tmp"

echo "✅ Updated $FRONTEND_ENV with new backend URL"
echo ""

# Show what was changed
echo "📝 Changes:"
echo "---"
grep "VITE_BACKEND_URL" "$FRONTEND_ENV"
echo "---"
echo ""

# Commit changes
echo "📤 Committing changes to git..."
git add "$FRONTEND_ENV"
git commit -m "Update frontend with new backend URL: $NEW_BACKEND_URL" || echo "⚠️ No changes to commit"

# Push to GitHub
echo "🚀 Pushing to GitHub..."
git push origin main

echo ""
echo "✅ Frontend updated and deployed!"
echo "🌐 Your frontend will redeploy automatically on Vercel"
echo ""
echo "Monitor at: https://vercel.com/dashboard"
