#!/bin/bash

# Strapi CMS Setup Script for Skynet India
echo "🚀 Setting up Strapi CMS for Skynet India..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 14+ first."
    exit 1
fi

# Create CMS directory
echo "📁 Creating CMS directory..."
mkdir -p ../skynet-cms
cd ../skynet-cms

# Create Strapi project
echo "🏗️ Creating Strapi project..."
npx create-strapi-app@latest . --quickstart --no-run

# Install additional dependencies
echo "📦 Installing additional dependencies..."
npm install @strapi/plugin-seo @strapi/plugin-graphql

# Create custom configuration
echo "⚙️ Creating custom configuration..."

# Create config directory structure
mkdir -p config

# Create plugins configuration
cat > config/plugins.js << 'EOF'
module.exports = ({ env }) => ({
  // Upload provider
  upload: {
    config: {
      breakpoints: {
        xlarge: 1920,
        large: 1000,
        medium: 750,
        small: 500,
        xsmall: 64
      }
    }
  },
  // SEO plugin
  seo: {
    enabled: true,
  },
  // GraphQL
  graphql: {
    enabled: true,
    config: {
      endpoint: '/graphql',
      shadowCRUD: true,
      playgroundAlways: false,
      defaultLimit: 25,
      maxLimit: 100,
    },
  },
});
EOF

# Create API token for frontend
cat > config/api-tokens.js << 'EOF'
module.exports = {
  'frontend-read': {
    name: 'Frontend Read Token',
    description: 'Read-only token for Next.js frontend',
    type: 'read-only',
    lifespan: null,
  }
};
EOF

# Create .env.example
cat > .env.example << 'EOF'
HOST=0.0.0.0
PORT=1337
APP_KEYS=
API_TOKEN_SALT=
ADMIN_JWT_SECRET=
TRANSFER_TOKEN_SALT=
JWT_SECRET=

# Database
DATABASE_CLIENT=sqlite
DATABASE_FILENAME=.tmp/data.db

# For production, use PostgreSQL:
# DATABASE_CLIENT=postgres
# DATABASE_HOST=localhost
# DATABASE_PORT=5432
# DATABASE_NAME=skynet_cms
# DATABASE_USERNAME=
# DATABASE_PASSWORD=
# DATABASE_SSL=false

# Cloudinary (optional)
# CLOUDINARY_NAME=
# CLOUDINARY_KEY=
# CLOUDINARY_SECRET=
EOF

echo "✅ Strapi setup complete!"
echo ""
echo "Next steps:"
echo "1. cd ../skynet-cms"
echo "2. npm run develop"
echo "3. Create admin user at http://localhost:1337/admin"
echo "4. Create content types as documented in CLAUDE.md"
echo ""
echo "📚 See CLAUDE.md for detailed CMS integration documentation"