#!/bin/sh

# Docker entrypoint script for Risk UI
# ================================================

echo "Starting Risk UI with configuration:"
echo "RISK_API_SERVER: ${RISK_API_SERVER:-http://localhost:8000}"
echo "PORT: ${PORT:-80}"

# Replace PORT_PLACEHOLDER in nginx configuration
if [ -n "$PORT" ]; then
    sed -i "s/PORT_PLACEHOLDER/$PORT/g" /etc/nginx/conf.d/default.conf
    echo "Updated nginx to listen on port $PORT"
else
    sed -i "s/PORT_PLACEHOLDER/80/g" /etc/nginx/conf.d/default.conf
    echo "Updated nginx to listen on port 80 (default)"
fi

# Inject environment variables into the HTML
# This allows the React app to access environment variables at runtime
if [ -f /usr/share/nginx/html/index.html ]; then
    # Create a temporary file with environment variables
    cat > /tmp/env-config.js << EOF
window.RISK_API_SERVER = "${RISK_API_SERVER:-http://localhost:8000}";
EOF

    # Insert the script tag before the closing </head> tag
    sed -i '/<\/head>/i \    <script src="/env-config.js"></script>' /usr/share/nginx/html/index.html

    # Copy the environment config file to the nginx serve directory
    cp /tmp/env-config.js /usr/share/nginx/html/env-config.js

    echo "Environment variables injected into HTML"
else
    echo "Warning: index.html not found, skipping environment injection"
fi

# Start nginx
exec "$@" 