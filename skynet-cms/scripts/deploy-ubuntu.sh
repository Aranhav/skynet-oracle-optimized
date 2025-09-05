#!/bin/bash

# Deployment script for Skynet CMS on Ubuntu Server
# This script runs on the server when triggered by GitHub Actions

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

PROJECT_DIR="/var/www/skynet/skynet-cms"
PM2_APP_NAME="strapi-cms"
LOG_FILE="/var/log/skynet-cms-deploy.log"

# Function to log messages
log_message() {
    echo -e "${GREEN}[$(date '+%Y-%m-%d %H:%M:%S')]${NC} $1" | tee -a $LOG_FILE
}

log_error() {
    echo -e "${RED}[$(date '+%Y-%m-%d %H:%M:%S')] ERROR:${NC} $1" | tee -a $LOG_FILE
}

log_warning() {
    echo -e "${YELLOW}[$(date '+%Y-%m-%d %H:%M:%S')] WARNING:${NC} $1" | tee -a $LOG_FILE
}

# Start deployment
log_message "🚀 Starting deployment for Skynet CMS..."

# Navigate to project directory
cd $PROJECT_DIR || { log_error "Failed to navigate to project directory"; exit 1; }

# Store current commit hash
OLD_COMMIT=$(git rev-parse HEAD)

# Pull latest changes
log_message "📥 Pulling latest changes from main branch..."
git fetch origin main
git reset --hard origin/main

# Get new commit hash
NEW_COMMIT=$(git rev-parse HEAD)

# Check if there are actual changes
if [ "$OLD_COMMIT" == "$NEW_COMMIT" ]; then
    log_warning "No new changes detected. Skipping deployment."
    exit 0
fi

# Show what changed
log_message "📝 Changes detected:"
git log --oneline $OLD_COMMIT..$NEW_COMMIT

# Check if package.json changed
if git diff $OLD_COMMIT $NEW_COMMIT --name-only | grep -q "package.json"; then
    log_message "📦 Package.json changed. Installing dependencies..."
    npm install --legacy-peer-deps
    # Ensure critical packages are installed
    npm install ajv@8.12.0 ajv-draft-04 --save --legacy-peer-deps
else
    log_message "✅ No dependency changes detected."
fi

# Check if database schema changed
if git diff $OLD_COMMIT $NEW_COMMIT --name-only | grep -q "src/api/.*schema.json"; then
    log_warning "⚠️  Database schema changed. Manual migration may be required."
fi

# Build Strapi admin panel
log_message "🔨 Building Strapi admin panel..."
npm run build || { log_error "Build failed"; exit 1; }

# Health check before switching
log_message "🏥 Performing pre-deployment health check..."
if pm2 show $PM2_APP_NAME > /dev/null 2>&1; then
    log_message "✅ PM2 process exists"
else
    log_warning "PM2 process not found. Will create new process."
fi

# Restart or start the application
log_message "🔄 Restarting CMS with PM2..."
if pm2 show $PM2_APP_NAME > /dev/null 2>&1; then
    pm2 restart $PM2_APP_NAME --update-env
else
    pm2 start npm --name "$PM2_APP_NAME" -- start
fi

# Save PM2 state
pm2 save

# Wait for app to start
log_message "⏳ Waiting for CMS to start..."
sleep 10  # Strapi takes longer to start

# Post-deployment health check
log_message "🏥 Performing post-deployment health check..."
for i in {1..15}; do
    if curl -f -s -o /dev/null -w "%{http_code}" http://localhost:1337/_health | grep -q "204"; then
        log_message "✅ CMS is responding correctly!"
        break
    else
        if [ $i -eq 15 ]; then
            log_error "CMS health check failed after 15 attempts"
            # Rollback
            log_warning "🔙 Rolling back to previous version..."
            git reset --hard $OLD_COMMIT
            npm install --legacy-peer-deps
            npm run build
            pm2 restart $PM2_APP_NAME
            exit 1
        fi
        log_warning "Attempt $i/15: CMS not ready yet. Waiting..."
        sleep 4
    fi
done

# Verify API is accessible
log_message "🔍 Verifying API endpoints..."
if curl -f -s http://localhost:1337/api/global-settings > /dev/null 2>&1; then
    log_message "✅ API endpoints are accessible"
else
    log_warning "⚠️  API endpoints may not be publicly accessible. Check permissions."
fi

# Clear old logs if they're too large
LOG_SIZE=$(du -m $LOG_FILE | cut -f1)
if [ $LOG_SIZE -gt 100 ]; then
    log_warning "Log file is large ($LOG_SIZE MB). Rotating..."
    mv $LOG_FILE "$LOG_FILE.old"
    touch $LOG_FILE
fi

# Database backup reminder
log_warning "💾 Remember to backup database regularly!"

log_message "🎉 CMS deployment completed successfully!"
log_message "📊 Deployment stats:"
log_message "  - Old commit: $OLD_COMMIT"
log_message "  - New commit: $NEW_COMMIT"
log_message "  - PM2 Status:"
pm2 status $PM2_APP_NAME

exit 0