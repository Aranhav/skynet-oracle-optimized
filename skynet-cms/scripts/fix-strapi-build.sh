#!/bin/bash

echo "🚀 Fixing Strapi Build Error..."

# Create temporary directory for Strapi
mkdir -p /tmp/skynet-cms-fix
cd /tmp/skynet-cms-fix

# Create package.json with build script
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

# Create Strapi app structure
npx create-strapi-app@latest . --quickstart --no-run --skip-cloud

# Copy config files
mkdir -p config/env/production

# Database config
cat > config/env/production/database.js << 'EOF'
const { parse } = require("pg-connection-string");

module.exports = ({ env }) => {
  const { host, port, database, user, password } = parse(env("DATABASE_URL"));
  
  return {
    connection: {
      client: 'postgres',
      connection: {
        host,
        port,
        database,
        user,
        password,
        ssl: { rejectUnauthorized: false },
      },
      debug: false,
    },
  };
};
EOF

# Server config
cat > config/env/production/server.js << 'EOF'
module.exports = ({ env }) => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 1337),
  app: {
    keys: env.array('APP_KEYS'),
  },
});
EOF

# Cloudinary config
cat > config/plugins.js << 'EOF'
module.exports = ({ env }) => ({
  upload: {
    config: {
      provider: 'cloudinary',
      providerOptions: {
        cloud_name: env('CLOUDINARY_NAME'),
        api_key: env('CLOUDINARY_KEY'),
        api_secret: env('CLOUDINARY_SECRET'),
      },
    },
  },
});
EOF

# render.yaml
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

echo "✅ Files created successfully!"
echo ""
echo "📋 Copy these commands one by one:"
echo ""
echo "cd /tmp/skynet-cms-fix"
echo "git init"
echo "git add ."
echo 'git commit -m "Fix Strapi build with all required scripts"'
echo "git remote add origin https://github.com/YOUR_USERNAME/skynet-cms.git"
echo "git push -f origin main"