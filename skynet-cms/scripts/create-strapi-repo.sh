#!/bin/bash

echo "Creating Strapi CMS repository..."

# Create skynet-cms directory at parent level
cd ..
mkdir -p skynet-cms
cd skynet-cms

# Copy files from skynet-revamp
cp ../skynet-revamp/skynet-cms/package.json .
cp ../skynet-revamp/skynet-cms/render.yaml .
cp ../skynet-revamp/skynet-cms/.gitignore .
cp ../skynet-revamp/skynet-cms/.nvmrc .
cp -r ../skynet-revamp/skynet-cms/config .
cp -r ../skynet-revamp/skynet-cms/src .
cp -r ../skynet-revamp/skynet-cms/public .

# Initialize git
git init
git add .
git commit -m "Initial Strapi setup with build scripts and Cloudinary"

echo "✅ Strapi repository created!"
echo ""
echo "Next steps:"
echo "1. Create a new repository on GitHub called 'skynet-cms'"
echo "2. Run: git remote add origin https://github.com/YOUR_USERNAME/skynet-cms.git"
echo "3. Run: git push -u origin main"
echo "4. Go back to Render and deploy from this repository"