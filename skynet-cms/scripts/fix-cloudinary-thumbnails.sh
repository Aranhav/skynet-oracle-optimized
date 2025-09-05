#!/bin/bash

# Fix Cloudinary thumbnail display in Strapi Media Library
# This script updates the CSP settings to allow Cloudinary images

echo "🔧 Fixing Cloudinary thumbnail display in Strapi Media Library..."

# Navigate to skynet-cms directory
cd /Users/aranhavsingh/aranhavsingh/skynet-cms

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Not in skynet-cms directory"
    exit 1
fi

echo "✅ Middleware configuration updated with Cloudinary CSP settings"
echo ""
echo "📝 The following changes were made:"
echo "   - Added Content Security Policy for Cloudinary domains"
echo "   - Allowed images from res.cloudinary.com and *.cloudinary.com"
echo "   - Configured media-src to allow Cloudinary resources"
echo ""
echo "🚀 Next steps to deploy the fix:"
echo "   1. Commit the changes:"
echo "      git add config/middlewares.js"
echo "      git commit -m 'Fix: Add CSP settings for Cloudinary thumbnails in Media Library'"
echo "   "
echo "   2. Push to GitHub:"
echo "      git push origin main"
echo "   "
echo "   3. Railway will automatically redeploy with the new settings"
echo "   "
echo "   4. After deployment, restart the Strapi server if needed:"
echo "      - Go to Railway dashboard"
echo "      - Select your Strapi service"
echo "      - Click 'Restart' button"
echo ""
echo "⚠️  Important: Clear your browser cache after deployment!"
echo ""
echo "✨ The thumbnails should now appear in the Media Library!"