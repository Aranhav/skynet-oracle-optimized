#!/bin/bash

echo "🚀 Pushing Strapi to GitHub..."

# Create temp directory
mkdir -p /tmp/skynet-cms-push
cd /tmp/skynet-cms-push

# Create all files
cat > package.json << 'EOF'
{
  "name": "skynet-cms",
  "private": true,
  "version": "0.1.0",
  "description": "Skynet India CMS",
  "scripts": {
    "develop": "strapi develop",
    "start": "strapi start",
    "build": "strapi build",
    "strapi": "strapi"
  },
  "dependencies": {
    "@strapi/strapi": "4.20.5",
    "@strapi/plugin-users-permissions": "4.20.5",
    "@strapi/plugin-i18n": "4.20.5",
    "@strapi/provider-upload-cloudinary": "^4.20.5",
    "pg": "^8.11.3",
    "pg-connection-string": "^2.6.2"
  },
  "engines": {
    "node": ">=16.0.0 <=20.x.x",
    "npm": ">=6.0.0"
  }
}
EOF

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
      - key: NODE_VERSION
        value: 18.20.4
      - key: NODE_ENV
        value: production
      - key: DATABASE_CLIENT
        value: postgres
      - key: DATABASE_SSL
        value: true
      - key: JWT_SECRET
        generateValue: true
      - key: ADMIN_JWT_SECRET
        generateValue: true
      - key: APP_KEYS
        generateValue: true
      - key: API_TOKEN_SALT
        generateValue: true
      - key: TRANSFER_TOKEN_SALT
        generateValue: true
      - key: DATABASE_URL
        fromDatabase:
          name: skynet-postgres
          property: connectionString

databases:
  - name: skynet-postgres
    plan: free
    ipAllowList: []
EOF

# Initialize git and push
git init
git add .
git commit -m "Strapi setup with build scripts"
git branch -M main
git remote add origin https://github.com/Aranhav/skynet-cms.git
git push -f origin main

echo "✅ Pushed to GitHub successfully!"
echo "Check: https://github.com/Aranhav/skynet-cms"