// Risk UI Configuration
// ================================================

// Get API base URL from environment variable
// React requires environment variables to be prefixed with REACT_APP_
// We'll use a custom approach to handle the RISK_API_SERVER variable
const getApiBaseUrl = () => {
    // Check if we're in a browser environment
    if (typeof window !== 'undefined') {
        // In browser, try to get from window object (set by Docker)
        if (window.RISK_API_SERVER) {
            return window.RISK_API_SERVER;
        }
    }
    
    // Fallback to environment variable (for development)
    if (process.env.REACT_APP_RISK_API_SERVER) {
        return process.env.REACT_APP_RISK_API_SERVER;
    }
    
    // Default fallback for local development
    return 'http://localhost:8000';
};

// Export the configuration
export const config = {
    apiBaseUrl: getApiBaseUrl(),
};

// Log the configuration for debugging
console.log('Risk UI Configuration:', {
    apiBaseUrl: config.apiBaseUrl,
    environment: process.env.NODE_ENV,
});

export default config; 