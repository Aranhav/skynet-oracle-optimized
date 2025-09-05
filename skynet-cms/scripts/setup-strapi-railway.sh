#!/bin/bash

echo "🚀 Setting up Strapi for Railway deployment..."

# Create Strapi directory
mkdir -p ../skynet-cms
cd ../skynet-cms

# Initialize Strapi with PostgreSQL support
echo "📦 Creating Strapi project..."
npx create-strapi-app@latest . \
  --no-run \
  --dbclient=postgres \
  --dbhost='${{Postgres.PGHOST}}' \
  --dbport='${{Postgres.PGPORT}}' \
  --dbname='${{Postgres.PGDATABASE}}' \
  --dbusername='${{Postgres.PGUSER}}' \
  --dbpassword='${{Postgres.PGPASSWORD}}'

# Install additional dependencies
echo "📦 Installing production dependencies..."
npm install pg @strapi/provider-upload-cloudinary

# Create config/env/production/database.js
mkdir -p config/env/production
cat > config/env/production/database.js << 'EOF'
module.exports = ({ env }) => ({
  connection: {
    client: 'postgres',
    connection: {
      host: env('PGHOST', 'localhost'),
      port: env.int('PGPORT', 5432),
      database: env('PGDATABASE', 'railway'),
      user: env('PGUSER', 'postgres'),
      password: env('PGPASSWORD', 'password'),
      ssl: env.bool('DATABASE_SSL', false),
    },
    debug: false,
  },
});
EOF

# Create config/env/production/server.js
cat > config/env/production/server.js << 'EOF'
module.exports = ({ env }) => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 1337),
  app: {
    keys: env.array('APP_KEYS'),
  },
  url: env('PUBLIC_URL', 'https://skynet-cms.up.railway.app'),
  webhooks: {
    populateRelations: env.bool('WEBHOOKS_POPULATE_RELATIONS', false),
  },
});
EOF

# Create config/plugins.js - using local storage for now
cat > config/plugins.js << 'EOF'
module.exports = ({ env }) => ({
  // Using default local storage
  // Add Cloudinary later if needed
});
EOF

# Create railway.json
cat > railway.json << 'EOF'
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "npm run build"
  },
  "deploy": {
    "startCommand": "npm run start",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
EOF

# Create .gitignore
cat > .gitignore << 'EOF'
############################
# OS X
############################

.DS_Store
.AppleDouble
.LSOverride
Icon
.Spotlight-V100
.Trashes
._*

############################
# Linux
############################

*~

############################
# Windows
############################

Thumbs.db
ehthumbs.db
Desktop.ini
$RECYCLE.BIN/
*.cab
*.msi
*.msm
*.msp

############################
# Packages
############################

*.7z
*.csv
*.dat
*.dmg
*.gz
*.iso
*.jar
*.rar
*.tar
*.zip
*.com
*.class
*.dll
*.exe
*.o
*.seed
*.so
*.swo
*.swp
*.swn
*.swm
*.out
*.pid

############################
# Logs and databases
############################

.tmp
*.log
*.sql
*.sqlite
*.sqlite3

############################
# Misc.
############################

*#
ssl
.idea
nbproject
public/uploads/*
!public/uploads/.gitkeep

############################
# Node.js
############################

lib-cov
lcov.info
pids
logs
results
node_modules
.node_history

############################
# Tests
############################

coverage

############################
# Strapi
############################

.env
license.txt
exports
*.cache
dist
build
.strapi-updater.json
.strapi
.tmp
EOF

# Initialize git
git init
git add .
git commit -m "Initial Strapi setup for Railway"

echo "✅ Strapi is ready for Railway deployment!"
echo ""
echo "Next steps:"
echo "1. cd ../skynet-cms"
echo "2. railway login"
echo "3. railway link"
echo "4. railway add postgresql"
echo "5. railway up"
echo ""
echo "Don't forget to set these environment variables in Railway dashboard:"
echo "- APP_KEYS (generate with: openssl rand -base64 32)"
echo "- API_TOKEN_SALT (generate with: openssl rand -base64 16)"
echo "- ADMIN_JWT_SECRET (generate with: openssl rand -base64 16)"
echo "- JWT_SECRET (generate with: openssl rand -base64 16)"
echo "- CLOUDINARY_NAME"
echo "- CLOUDINARY_KEY" 
echo "- CLOUDINARY_SECRET"