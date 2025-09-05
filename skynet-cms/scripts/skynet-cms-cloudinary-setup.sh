#!/bin/bash

echo "Setting up Cloudinary for Strapi..."

cd ../skynet-cms

# Create config directory if not exists
mkdir -p config

# Create plugins.js with Cloudinary config
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
      actionOptions: {
        upload: {},
        uploadStream: {},
        delete: {},
      },
    },
  },
});
EOF

# Install Cloudinary provider
npm install @strapi/provider-upload-cloudinary

# Add to git
git add .
git commit -m "Configure Cloudinary for media uploads"
git push origin main

echo "✅ Cloudinary configuration added!"
echo ""
echo "Now add these to Render environment variables:"
echo "CLOUDINARY_NAME=djtqcvdta (or check your dashboard)"
echo "CLOUDINARY_KEY=677751458712735"
echo "CLOUDINARY_SECRET=<your-regenerated-secret>"