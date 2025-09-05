#!/bin/bash

echo "🚀 Setting up Strapi for GitHub..."

# Create all necessary files in ../skynet-cms-repo
cd ../skynet-cms-repo

# Create directory structure
mkdir -p config/env/production src/api src/extensions public/uploads .tmp

# Create .gitignore
cat > .gitignore << 'EOF'
# Dependencies
node_modules/

# Strapi
.env
.tmp
.cache
build
dist
exports
*.cache

# Logs
logs
*.log
npm-debug.log*

# OS
.DS_Store

# Tests
coverage

# Strapi
license.txt
.strapi-updater.json
.strapi
EOF

# Create render.yaml
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

# Create database config
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

# Create server config
cat > config/env/production/server.js << 'EOF'
module.exports = ({ env }) => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 1337),
  app: {
    keys: env.array('APP_KEYS'),
  },
});
EOF

# Create plugins config for Cloudinary
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

# Create src/index.js
cat > src/index.js << 'EOF'
'use strict';

module.exports = {
  register(/*{ strapi }*/) {},
  bootstrap(/*{ strapi }*/) {},
};
EOF

# Create public/robots.txt
cat > public/robots.txt << 'EOF'
User-agent: *
Disallow: /admin
Disallow: /api
EOF

# Create .nvmrc
echo "18.20.4" > .nvmrc

# Create public/uploads/.gitkeep
touch public/uploads/.gitkeep

echo "✅ All files created!"
echo ""
echo "Now run these commands:"
echo ""
echo "cd ../skynet-cms-repo"
echo "git init"
echo "git add ."
echo 'git commit -m "Initial Strapi setup with build scripts"'
echo "git branch -M main"
echo "git remote add origin https://github.com/Aranhav/skynet-cms.git"
echo "git push -u origin main"