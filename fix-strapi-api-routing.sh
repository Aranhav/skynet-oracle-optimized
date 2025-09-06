#!/bin/bash

# =====================================================
# FIX STRAPI API ROUTING (404 ERRORS)
# =====================================================

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}=========================================${NC}"
echo -e "${BLUE}   FIXING STRAPI API 404 ERRORS${NC}"
echo -e "${BLUE}=========================================${NC}"
echo ""

# 1. First check if Strapi is running
echo -e "${YELLOW}1. Checking Strapi status...${NC}"
if pm2 describe skynet-cms > /dev/null 2>&1; then
    pm2 status skynet-cms
else
    echo -e "${RED}✗ Strapi not found in PM2${NC}"
    echo -e "${YELLOW}Starting Strapi...${NC}"
    cd /var/www/skynet/cms
    pm2 start npm --name skynet-cms -- start
fi

# 2. Test Strapi directly on port 1337
echo -e "\n${YELLOW}2. Testing Strapi directly on port 1337...${NC}"
echo "Testing: http://localhost:1337/api/blog-posts"
curl -s "http://localhost:1337/api/blog-posts?populate=*&pagination[pageSize]=1" | head -50 || {
    echo -e "${RED}✗ Strapi API not responding on port 1337${NC}"
    echo -e "${YELLOW}Checking Strapi logs...${NC}"
    pm2 logs skynet-cms --lines 20 --nostream
}

# 3. Fix Nginx configuration - CRITICAL FIX
echo -e "\n${YELLOW}3. Fixing Nginx configuration for proper API routing...${NC}"
sudo tee /etc/nginx/sites-available/skynet > /dev/null << 'NGINX'
server {
    listen 80;
    server_name _;
    client_max_body_size 250M;

    # IMPORTANT: Order matters! More specific routes first

    # Next.js specific API routes (must come FIRST)
    location ~ ^/api/(track|health|mock) {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Strapi API routes - ALL other /api/* routes go to Strapi
    location /api/ {
        proxy_pass http://localhost:1337/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_read_timeout 90;
        
        # CORS headers
        add_header 'Access-Control-Allow-Origin' '*' always;
        add_header 'Access-Control-Allow-Methods' 'GET, POST, PUT, DELETE, OPTIONS' always;
        add_header 'Access-Control-Allow-Headers' 'DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range,Authorization' always;
        add_header 'Access-Control-Expose-Headers' 'Content-Length,Content-Range' always;
        
        # Handle OPTIONS preflight
        if ($request_method = 'OPTIONS') {
            add_header 'Access-Control-Allow-Origin' '*';
            add_header 'Access-Control-Allow-Methods' 'GET, POST, PUT, DELETE, OPTIONS';
            add_header 'Access-Control-Allow-Headers' 'DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range,Authorization';
            add_header 'Access-Control-Max-Age' 1728000;
            add_header 'Content-Type' 'text/plain; charset=utf-8';
            add_header 'Content-Length' 0;
            return 204;
        }
    }

    # Strapi Admin Panel
    location /admin {
        proxy_pass http://localhost:1337/admin;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Strapi Content Manager and other admin routes
    location ~ ^/(content-manager|content-type-builder|upload|users-permissions|_health) {
        proxy_pass http://localhost:1337;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Static uploads from Strapi
    location /uploads {
        proxy_pass http://localhost:1337/uploads;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }

    # Frontend - Everything else goes to Next.js
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_read_timeout 90;
    }
}
NGINX

# Test Nginx configuration
echo -e "${YELLOW}Testing Nginx configuration...${NC}"
sudo nginx -t || {
    echo -e "${RED}✗ Nginx configuration error${NC}"
    exit 1
}

# Reload Nginx
echo -e "${YELLOW}Reloading Nginx...${NC}"
sudo systemctl reload nginx
echo -e "${GREEN}✓ Nginx reloaded with fixed configuration${NC}"

# 4. Ensure Strapi API permissions are public
echo -e "\n${YELLOW}4. Setting Strapi API permissions to public...${NC}"
cat > /tmp/set-public-api.js << 'JSSCRIPT'
// Script to set Strapi API permissions to public
const strapi = require('@strapi/strapi');

async function setPublicPermissions() {
  const strapiInstance = await strapi.load();
  
  // Get the public role
  const publicRole = await strapiInstance.query('plugin::users-permissions.role').findOne({
    where: { type: 'public' },
    populate: ['permissions'],
  });

  if (!publicRole) {
    console.log('Public role not found');
    process.exit(1);
  }

  // Get all API permissions
  const permissions = await strapiInstance.query('plugin::users-permissions.permission').findMany({
    where: {
      role: publicRole.id,
    },
  });

  // Update permissions to allow find and findOne for all content types
  const contentTypes = [
    'api::blog-post.blog-post',
    'api::service.service',
    'api::office-location.office-location',
    'api::global-setting.global-setting',
    'api::testimonial.testimonial',
    'api::faq.faq',
    'api::partner.partner',
  ];

  for (const contentType of contentTypes) {
    // Enable find and findOne
    await strapiInstance.query('plugin::users-permissions.permission').updateMany({
      where: {
        role: publicRole.id,
        type: contentType,
        action: { $in: ['find', 'findOne'] },
      },
      data: {
        enabled: true,
      },
    });
  }

  console.log('Public API permissions updated successfully');
  process.exit(0);
}

setPublicPermissions().catch(console.error);
JSSCRIPT

# Note: Manual step needed
echo -e "${YELLOW}Note: You need to manually set API permissions to public in Strapi admin panel${NC}"
echo "1. Go to: http://152.67.4.226/admin"
echo "2. Navigate to: Settings → Users & Permissions → Roles → Public"
echo "3. Enable 'find' and 'findOne' for all content types"

# 5. Test the API endpoints through Nginx
echo -e "\n${YELLOW}5. Testing API endpoints through Nginx...${NC}"
echo ""
echo "Testing blog-posts API:"
curl -s "http://localhost/api/blog-posts?populate=*&pagination[pageSize]=1" | head -50 || echo "Failed"
echo ""
echo "Testing services API:"
curl -s "http://localhost/api/services?populate=*&pagination[pageSize]=1" | head -50 || echo "Failed"
echo ""
echo "Testing through external IP:"
curl -s "http://152.67.4.226/api/blog-posts?pagination[pageSize]=1" | head -50 || echo "Failed"

# 6. Restart services to ensure clean state
echo -e "\n${YELLOW}6. Restarting services...${NC}"
pm2 restart skynet-cms
sleep 5
pm2 restart skynet-frontend
pm2 status

# 7. Final diagnostics
echo -e "\n${GREEN}=========================================${NC}"
echo -e "${GREEN}   FIX COMPLETE - TEST URLS${NC}"
echo -e "${GREEN}=========================================${NC}"
echo ""
echo -e "${BLUE}Direct Strapi API:${NC}"
echo "  http://localhost:1337/api/blog-posts"
echo "  http://localhost:1337/api/services"
echo ""
echo -e "${BLUE}Through Nginx (This should work):${NC}"
echo "  http://152.67.4.226/api/blog-posts"
echo "  http://152.67.4.226/api/services"
echo "  http://152.67.4.226/api/global-settings"
echo "  http://152.67.4.226/api/office-locations"
echo ""
echo -e "${BLUE}Admin Panel:${NC}"
echo "  http://152.67.4.226/admin"
echo ""
echo -e "${RED}IMPORTANT:${NC}"
echo "1. Set API permissions to public in Strapi admin"
echo "2. Ensure content exists in Strapi CMS"
echo "3. Check pm2 logs if still having issues: pm2 logs skynet-cms"