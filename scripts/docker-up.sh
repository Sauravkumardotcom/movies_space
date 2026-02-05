#!/bin/bash

# Docker development environment setup
set -e

echo "🐳 Starting Docker environment..."

# Check for Docker
if ! command -v docker &> /dev/null; then
  echo "❌ Docker is not installed. Please install Docker and try again."
  exit 1
fi

# Check for Docker Compose
if ! command -v docker-compose &> /dev/null; then
  echo "❌ Docker Compose is not installed. Please install Docker Compose and try again."
  exit 1
fi

cd docker

echo "Starting services..."
docker-compose up -d

echo ""
echo "✅ Services started!"
echo ""
echo "📊 Service URLs:"
echo "  Frontend: http://localhost"
echo "  Backend API: http://localhost:3000"
echo "  PostgreSQL: localhost:5432"
echo "  Redis: localhost:6379"
echo "  Minio Console: http://localhost:9001"
echo "    (user: minioadmin, password: minioadmin)"
echo ""
echo "To stop services: docker-compose down"
