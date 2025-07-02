# Risk Game UI

A React-based user interface for interacting with a [Risk board game API](https://github.com/Krilecy/risk-board_game-server) implementation written in Rust. This UI provides a simple way to play the game and showcases the backend which is the actual star of the show.

**🚀 Now with Docker containerization and Cloud Run deployment support!**

## Features

- Interactive SVG-based game board showing territory ownership and army counts
- Real-time game state updates with observer mode
- Visual probability indicators for attack success
- Support for all core Risk game actions:
  - Reinforcing territories
  - Attacking neighboring territories
  - Fortifying positions
  - Trading cards
  - Auto-attack mode for quick conquests

## Prerequisites

### For Development
- Node.js (v18 or higher recommended)
- npm
- The Risk game API server running locally (default: http://localhost:8000)

### For Docker & Cloud Run Deployment
- Docker
- Google Cloud CLI (gcloud)
- Access to Google Cloud project

## Installation

1. Clone this repository
2. Navigate to the project directory
3. Install dependencies:
```bash
npm install
```
## Running the Application

### Development Mode

Start the development server:
```bash
npm start
```

This will launch the application. You can access it in your browser at http://localhost:3000.

### Docker Mode

Build and test the Docker container locally:
```bash
./build-and-test.sh
```

This script will:
- Build the Docker image
- Start the container with environment variables
- Test the health endpoint and application
- Display the service URL

### Environment Configuration

The application uses environment variables for configuration:

1. Copy the environment template:
   ```bash
   cp env.example .env
   ```

2. Edit `.env` with your configuration:
   ```bash
   # API Server URL
   RISK_API_SERVER=https://your-api-server-url.run.app
   
   # For local development
   RISK_API_SERVER=http://localhost:8000
   ```

The container automatically injects environment variables at runtime, making it suitable for both local development and Cloud Run deployment.

## Project Structure

### Application Files
- `src/GameBoard.js` - Main game board component with territory rendering and state management
- `src/PossibleActions.js` - Handles all game actions and API interactions
- `src/config.js` - Environment configuration and API base URL management
- `src/classic_map.svg` - SVG map of the Risk game board
- `src/App.js` - Root application component

### Docker & Deployment Files
- `Dockerfile` - Multi-stage build for React app with nginx
- `nginx.conf` - Nginx configuration for serving the React app
- `docker-entrypoint.sh` - Runtime environment variable injection
- `deploy.sh` - Cloud Run deployment script
- `build-and-test.sh` - Local Docker build and test script
- `env.example` - Environment variable template
- `DEPLOYMENT.md` - Complete deployment guide

## Technical Details

The UI makes use of several key technologies and features:

### Frontend Technologies
- SVG manipulation for dynamic territory coloring and army count display
- Axios for API communication
- Real-time game state polling in observer mode (200ms intervals)
- CSS Grid layout for responsive design
- Custom styling with semi-transparent overlay for better readability

### Container & Deployment Features
- **Multi-stage Docker build**: Node.js for building, nginx for serving
- **Runtime configuration**: Environment variables injected at container startup
- **Cloud Run ready**: Proper port configuration (8080) and health endpoints
- **Environment variable support**: Configurable API endpoints via RISK_API_SERVER
- **Production optimized**: Gzip compression, caching headers, security headers

## Building for Production

### Local Build

To create a production build:
```bash
npm run build
```

This will create an optimized build in the `build` folder ready for deployment.

### Docker Build

Build the production Docker image:
```bash
docker build -t risk-ui:latest .
```

### Cloud Run Deployment

Deploy to Google Cloud Run:
```bash
# 1. Configure environment
cp env.example .env
# Edit .env with your values

# 2. Deploy
./deploy.sh
```

For detailed deployment instructions, see [DEPLOYMENT.md](DEPLOYMENT.md).

## Quick Start

### Local Development
```bash
npm install
npm start
```

### Docker Testing
```bash
./build-and-test.sh
```

### Cloud Run Deployment
```bash
cp env.example .env
# Edit .env with your values
./deploy.sh
```

## Contributing

Don't feel free to submit issues or enhancement requests. This is a personal project and I'm not looking for contributions. Honestly, If you want a better UI make a new one. This is just the showcase for the backend.

## License

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).
Disclaimer: This is a non-commercial hobby project and not in any way affiliated with the copy write holders of the Risk board game.
