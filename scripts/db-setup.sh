#!/bin/bash

# Database setup script
set -e

echo "🗄️  Setting up database..."

# Check for required environment variables
if [ -z "$DATABASE_URL" ]; then
  echo "❌ DATABASE_URL not set. Please set it in .env.local"
  exit 1
fi

# Run migrations
echo "Running Prisma migrations..."
npm run db:migrate -w backend

# Seed database
echo "Seeding database..."
npm run db:seed -w backend

echo "✅ Database setup complete!"
