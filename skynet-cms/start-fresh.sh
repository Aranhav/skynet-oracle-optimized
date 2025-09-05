#!/bin/bash

echo "🧹 Cleaning up old data..."
rm -rf .tmp/
rm -rf .cache/

echo "📦 Creating fresh directories..."
mkdir -p .tmp

echo "🚀 Starting Strapi in development mode..."
npm run develop