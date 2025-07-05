#!/bin/bash

# Risk UI Cloud Run Deployment Script
# ================================================

set -e

echo "🚀 Deploying Risk UI to Cloud Run..."

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
    echo -e "${BLUE}[DEPLOY]${NC} $1"
}

# Check if .env file exists
if [ ! -f .env ]; then
    print_error ".env file not found! Copy env.example to .env and configure it."
    exit 1
fi

# Load environment variables
print_status "Loading environment variables..."
source .env

# Validate required variables
required_vars=("PROJECT_ID" "REGION" "ARTIFACT_REGISTRY" "SERVICE_NAME" "IMAGE_NAME" "IMAGE_TAG" "RISK_API_SERVER")
for var in "${required_vars[@]}"; do
    if [ -z "${!var}" ]; then
        print_error "Required variable $var is not set in .env"
        exit 1
    fi
done

# Check prerequisites
if ! command -v gcloud &> /dev/null; then
    print_error "gcloud CLI not installed"
    exit 1
fi

if ! docker info > /dev/null 2>&1; then
    print_error "Docker not running"
    exit 1
fi

# Set project and configure Docker
print_header "Configuring Google Cloud..."
gcloud config set project "$PROJECT_ID"
gcloud auth configure-docker "$REGION-docker.pkg.dev" --quiet

# Build and push image
print_header "Building and pushing Docker image..."
docker build -t "$ARTIFACT_REGISTRY/$IMAGE_NAME:$IMAGE_TAG" .
docker push "$ARTIFACT_REGISTRY/$IMAGE_NAME:$IMAGE_TAG"

# Deploy to Cloud Run
print_header "Deploying to Cloud Run..."
deploy_cmd="gcloud run deploy $SERVICE_NAME"
deploy_cmd="$deploy_cmd --image $ARTIFACT_REGISTRY/$IMAGE_NAME:$IMAGE_TAG"
deploy_cmd="$deploy_cmd --region $REGION"
deploy_cmd="$deploy_cmd --memory ${MEMORY:-512Mi}"
deploy_cmd="$deploy_cmd --cpu ${CPU:-1}"
deploy_cmd="$deploy_cmd --max-instances ${MAX_INSTANCES:-10}"
deploy_cmd="$deploy_cmd --timeout ${TIMEOUT:-300}"
deploy_cmd="$deploy_cmd --port ${PORT:-8080}"
deploy_cmd="$deploy_cmd --set-env-vars RISK_API_SERVER=$RISK_API_SERVER"

if [ "${ALLOW_UNAUTHENTICATED:-true}" = "true" ]; then
    deploy_cmd="$deploy_cmd --allow-unauthenticated"
fi

eval $deploy_cmd

# Get service URL
SERVICE_URL=$(gcloud run services describe "$SERVICE_NAME" --region="$REGION" --format="value(status.url)")

print_status "✅ Deployment successful!"
echo "📱 Service URL: $SERVICE_URL"
echo "🔧 API Backend: $RISK_API_SERVER" 