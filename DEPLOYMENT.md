# Risk UI Cloud Run Deployment Guide

## Prerequisites

1. **Google Cloud CLI** installed and authenticated
2. **Docker** installed and running
3. **Access** to the Google Cloud project

## Setup

1. **Copy environment template:**
   ```bash
   cp env.example .env
   ```

2. **Edit `.env` file** with your actual values:
   ```bash
   # Required values for this project:
   PROJECT_ID=koen-gcompany-demo
   REGION=europe-west4
   ARTIFACT_REGISTRY=europe-west4-docker.pkg.dev/koen-gcompany-demo/risk
   SERVICE_NAME=risk-ui
   IMAGE_NAME=risk-ui
   IMAGE_TAG=latest
   RISK_API_SERVER=https://risk-api-server-441582515789.europe-west4.run.app
   ```

3. **Optional Cloud Run settings** (with defaults):
   ```bash
   MEMORY=512Mi          # Default: 512Mi
   CPU=1                 # Default: 1
   MAX_INSTANCES=10      # Default: 10
   TIMEOUT=300           # Default: 300s
   PORT=8080             # Default: 8080
   ALLOW_UNAUTHENTICATED=true  # Default: true
   ```

## Deployment

Run the deployment script:
```bash
./deploy.sh
```

The script will:
1. ✅ Validate environment variables
2. ✅ Check prerequisites (gcloud, Docker)
3. ✅ Build Docker image
4. ✅ Push to Artifact Registry
5. ✅ Deploy to Cloud Run
6. ✅ Display service URL

## Manual Deployment

If you prefer manual deployment:

```bash
# Build and push image
docker build -t europe-west4-docker.pkg.dev/koen-gcompany-demo/risk/risk-ui:latest .
docker push europe-west4-docker.pkg.dev/koen-gcompany-demo/risk/risk-ui:latest

# Deploy to Cloud Run
gcloud run deploy risk-ui \
  --image europe-west4-docker.pkg.dev/koen-gcompany-demo/risk/risk-ui:latest \
  --region europe-west4 \
  --memory 512Mi \
  --cpu 1 \
  --max-instances 10 \
  --timeout 300 \
  --port 8080 \
  --set-env-vars RISK_API_SERVER=https://risk-api-server-441582515789.europe-west4.run.app \
  --allow-unauthenticated
```

## Useful Commands

```bash
# View service logs
gcloud logs tail --service=risk-ui --region=europe-west4

# Update service
./deploy.sh

# Delete service
gcloud run services delete risk-ui --region=europe-west4

# List services
gcloud run services list --region=europe-west4
```

## Environment Variables

The Risk UI container uses these environment variables:

- `RISK_API_SERVER`: Base URL for the Risk API backend
- All other variables are used for Cloud Run deployment configuration

## Troubleshooting

1. **Authentication issues**: Run `gcloud auth login`
2. **Docker issues**: Ensure Docker is running
3. **Permission issues**: Check IAM roles for Cloud Run and Artifact Registry
4. **Build failures**: Check Docker logs and ensure all files are present 