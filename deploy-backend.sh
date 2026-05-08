#!/bin/bash
# Backend Deployment Helper Script for Vercel
# Usage: bash deploy-backend.sh

set -e

echo "🚀 MovieSpace Backend Deployment Helper"
echo "========================================"
echo ""
echo "This script will prepare your backend for deployment to Vercel"
echo ""

# Step 1: Verify backend is ready
echo "📦 Step 1: Verifying backend setup..."
cd backend

if [ ! -f "vercel.json" ]; then
  echo "❌ Error: vercel.json not found"
  exit 1
fi

if [ ! -f "package.json" ]; then
  echo "❌ Error: package.json not found"
  exit 1
fi

if [ ! -f "server.js" ]; then
  echo "❌ Error: server.js not found"
  exit 1
fi

echo "✅ Backend files verified"

# Step 2: Validate vercel.json
echo ""
echo "📋 Step 2: Validating vercel.json..."
node -e "const config = require('./vercel.json'); console.log('✅ vercel.json is valid JSON')" || {
  echo "❌ Error: vercel.json has invalid JSON syntax"
  exit 1
}

# Step 3: Install dependencies
echo ""
echo "📥 Step 3: Installing dependencies..."
npm install > /dev/null 2>&1 || {
  echo "❌ Error: npm install failed"
  exit 1
}
echo "✅ Dependencies installed"

# Step 4: Validate syntax
echo ""
echo "✔️ Step 4: Checking server.js syntax..."
node -c server.js > /dev/null 2>&1 && echo "✅ server.js syntax OK" || {
  echo "❌ Error: server.js has syntax errors"
  exit 1
}

echo ""
echo "✅ Backend is ready for Vercel deployment!"
echo ""
echo "📝 Next steps:"
echo "  1. Go to: https://vercel.com/dashboard"
echo "  2. Click 'Add New' → 'Project'"
echo "  3. Import: Sauravkumardotcom/movies_space"
echo "  4. Root Directory: backend"
echo "  5. Click Deploy"
echo "  6. After deployment, copy your new backend URL"
echo "  7. Run: bash update-frontend.sh YOUR_NEW_BACKEND_URL"
echo ""

cd ..
