#!/bin/bash

# Risk UI Build and Test Script
# ================================================

set -e

echo "🚀 Building and testing Risk UI..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_header() {
    echo -e "${BLUE}[TEST]${NC} $1"
}

# Load environment variables from .env file
print_header "Loading environment variables..."
if [ -f .env ]; then
    source .env
    print_status "Environment variables loaded from .env"
else
    print_warning ".env file not found, using defaults"
    # Set defaults for local testing
    RISK_API_SERVER=${RISK_API_SERVER:-"http://localhost:8000"}
    PORT=${PORT:-3000}
fi

# Validate required environment variables
if [ -z "$RISK_API_SERVER" ]; then
    print_error "RISK_API_SERVER environment variable is not set"
    exit 1
fi

print_status "Using API Server: $RISK_API_SERVER"
print_status "Using Port: ${PORT:-3000}"

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    print_error "Docker is not running. Please start Docker and try again."
    exit 1
fi

# Build the Docker image
print_header "Building Docker image..."
docker build -t risk-ui:latest .

if [ $? -eq 0 ]; then
    print_status "✅ Docker image built successfully"
else
    print_error "❌ Docker build failed"
    exit 1
fi

# Stop any existing containers
print_status "Stopping existing containers..."
docker stop risk-ui-test 2>/dev/null || true
docker rm risk-ui-test 2>/dev/null || true

# Start the container with environment variables
print_header "Starting container with environment variables..."
docker run -d --name risk-ui-test \
    -p ${PORT:-3000}:80 \
    -e RISK_API_SERVER="$RISK_API_SERVER" \
    risk-ui:latest

# Wait for container to be ready
print_status "Waiting for container to be ready..."
sleep 10

# Check if container is running
if docker ps | grep -q "risk-ui-test"; then
    print_status "✅ Container is running"
else
    print_error "❌ Container failed to start"
    docker logs risk-ui-test
    exit 1
fi

# Test the health endpoint
print_status "Testing health endpoint..."
if curl -f http://localhost:${PORT:-3000}/health > /dev/null 2>&1; then
    print_status "✅ Health endpoint is responding"
else
    print_warning "⚠️  Health endpoint not responding (this might be normal)"
fi

# Test the main application
print_status "Testing main application..."
if curl -f http://localhost:${PORT:-3000}/ > /dev/null 2>&1; then
    print_status "✅ Main application is responding"
else
    print_error "❌ Main application is not responding"
    docker logs risk-ui-test
    exit 1
fi

# Check environment variable injection
print_status "Checking environment variable injection..."
if curl -s http://localhost:${PORT:-3000}/env-config.js | grep -q "$RISK_API_SERVER"; then
    print_status "✅ Environment variables injected correctly"
else
    print_warning "⚠️  Environment variables may not be injected correctly"
    print_status "Expected: $RISK_API_SERVER"
    print_status "Got: $(curl -s http://localhost:${PORT:-3000}/env-config.js)"
fi

print_status "🎉 Risk UI is ready!"
echo ""
echo "📱 Access the application at: http://localhost:${PORT:-3000}"
echo "🔧 API Server: $RISK_API_SERVER"
echo ""
echo "📋 Useful commands:"
echo "  View logs: docker logs -f risk-ui-test"
echo "  Stop: docker stop risk-ui-test"
echo "  Remove: docker rm risk-ui-test"
echo "  Rebuild: ./build-and-test.sh"
echo "" 