#!/bin/bash

echo "🚀 Setting up Strapi for Render deployment..."

cd ../skynet-cms

# Create render.yaml for deployment
cat > render.yaml << 'EOF'
services:
  - type: web
    name: skynet-cms
    runtime: node
    plan: free
    buildCommand: npm install && npm run build
    startCommand: npm start
    healthCheckPath: /_health
    envVars:
      - key: NODE_ENV
        value: production
      - key: NODE_VERSION
        value: 18.17.0
      - key: DATABASE_URL
        fromDatabase:
          name: strapi-postgres
          property: connectionString
      - key: APP_KEYS
        generateValue: true
      - key: API_TOKEN_SALT
        generateValue: true
      - key: ADMIN_JWT_SECRET
        generateValue: true
      - key: JWT_SECRET
        generateValue: true

databases:
  - name: strapi-postgres
    plan: free
    databaseName: strapi
    user: strapi
EOF

# Update database config for Render
cat > config/env/production/database.js << 'EOF'
module.exports = ({ env }) => {
  const client = env('DATABASE_CLIENT', 'postgres');
  
  return {
    connection: {
      client,
      connection: {
        connectionString: env('DATABASE_URL'),
        host: env('DATABASE_HOST'),
        port: env.int('DATABASE_PORT'),
        database: env('DATABASE_NAME'),
        user: env('DATABASE_USERNAME'),
        password: env('DATABASE_PASSWORD'),
        ssl: {
          rejectUnauthorized: env.bool('DATABASE_SSL_SELF', false),
        },
      },
      debug: false,
    },
  };
};
EOF

# Commit changes
git add .
git commit -m "Add Render deployment configuration"

echo "✅ Strapi is ready for Render deployment!"
echo ""
echo "Next steps:"
echo "1. Push to GitHub: git push origin main"
echo "2. Go to https://dashboard.render.com"
echo "3. Click 'New' → 'Blueprint'"
echo "4. Connect your GitHub repo"
echo "5. Render will auto-deploy using render.yaml"
echo ""
echo "Note: First request after 15min inactivity will be slow (~30s)"