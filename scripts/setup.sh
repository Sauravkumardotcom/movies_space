#!/bin/bash

# Movies Space - Initial Setup Script
set -e

echo "🎬 Setting up Movies Space..."

# Check for required tools
check_command() {
  if ! command -v $1 &> /dev/null; then
    echo "❌ $1 is not installed. Please install it and try again."
    exit 1
  fi
}

check_command node
check_command npm

echo "✅ Node.js and npm found"

# Create .env files from templates
if [ ! -f .env.local ]; then
  echo "📋 Creating .env.local from .env.example..."
  cp .env.example .env.local
  echo "⚠️  Remember to update .env.local with your configuration"
fi

# Install dependencies for all workspaces
echo "📦 Installing dependencies..."
npm install

# Build shared package
echo "🔨 Building shared package..."
npm run build -w shared

echo ""
echo "✅ Setup complete!"
echo ""
echo "📚 Next steps:"
echo "  1. Update .env.local with your configuration"
echo "  2. Set up database: npm run db:migrate"
echo "  3. Seed database: npm run db:seed"
echo "  4. Start development: npm run dev"
echo ""
