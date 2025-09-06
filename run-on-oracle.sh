#!/bin/bash

# SINGLE SCRIPT TO RUN ON ORACLE SERVER
# This script executes all deployment steps automatically

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}         SKYNET ORACLE SERVER DEPLOYMENT                  ${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

echo -e "\n${YELLOW}Step 1: Pulling latest code...${NC}"
cd ~/skynet-oracle-optimized
git pull origin main

echo -e "\n${YELLOW}Step 2: Updating frontend files...${NC}"
sudo cp -r skynet-revamp/* /var/www/skynet/frontend/

echo -e "\n${YELLOW}Step 3: Installing dependencies...${NC}"
cd /var/www/skynet/frontend
npm install

echo -e "\n${YELLOW}Step 4: Building frontend...${NC}"
npm run build

echo -e "\n${YELLOW}Step 5: Fixing Nginx configuration...${NC}"
# Backup current config
sudo cp /etc/nginx/sites-available/skynet /etc/nginx/sites-available/skynet.backup.$(date +%s)

# Update Nginx configuration
sudo tee /etc/nginx/sites-available/skynet > /dev/null << 'NGINX'
server {
    listen 80;
    listen [::]:80;
    server_name 152.67.4.226;
    client_max_body_size 100M;

    # Route Next.js specific APIs to port 3000
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

    # Route all other /api/* to Strapi on port 1337
    location /api/ {
        rewrite ^/api/(.*)$ /api/$1 break;
        proxy_pass http://localhost:1337;
        proxy_http_version 1.1;
        proxy_set_header X-Forwarded-Host $host;
        proxy_set_header X-Forwarded-Server $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header Host $http_host;
        proxy_set_header Connection "";
        proxy_pass_request_headers on;
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

    # Strapi uploads and assets
    location /uploads {
        proxy_pass http://localhost:1337/uploads;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Strapi health check
    location /_health {
        proxy_pass http://localhost:1337/_health;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
    }

    # Socket.io for Strapi
    location /socket.io/ {
        proxy_pass http://localhost:1337;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Main Next.js app (everything else)
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
    }
}
NGINX

echo -e "\n${YELLOW}Step 6: Testing and reloading Nginx...${NC}"
sudo nginx -t
sudo systemctl reload nginx

echo -e "\n${YELLOW}Step 7: Restarting services...${NC}"
pm2 restart skynet-cms
pm2 restart skynet-frontend
pm2 save

echo -e "\n${YELLOW}Step 8: Checking service status...${NC}"
pm2 status

echo -e "\n${YELLOW}Step 9: Testing API endpoints...${NC}"
echo "Testing Blog Posts API:"
if curl -s http://152.67.4.226/api/blog-posts | grep -q '"data"'; then
    echo -e "${GREEN}✓ Blog Posts API working${NC}"
else
    echo -e "${RED}✗ Blog Posts API not responding correctly${NC}"
fi

echo "Testing Services API:"
if curl -s http://152.67.4.226/api/services | grep -q '"data"'; then
    echo -e "${GREEN}✓ Services API working${NC}"
else
    echo -e "${RED}✗ Services API not responding correctly${NC}"
fi

echo "Testing Office Locations API:"
if curl -s http://152.67.4.226/api/office-locations | grep -q '"data"'; then
    echo -e "${GREEN}✓ Office Locations API working${NC}"
else
    echo -e "${RED}✗ Office Locations API not responding correctly${NC}"
fi

echo -e "\n${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}         DEPLOYMENT COMPLETE!                             ${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

echo -e "\n${YELLOW}IMPORTANT NEXT STEPS:${NC}"
echo -e "1. ${BLUE}Set Public Permissions in Strapi:${NC}"
echo -e "   - Go to: http://152.67.4.226/admin"
echo -e "   - Email: admin@skynet.com"
echo -e "   - Password: SkynetAdmin@2025"
echo -e "   - Navigate to: Settings → Users & Permissions → Roles → Public"
echo -e "   - Enable 'find' and 'findOne' for all content types"
echo -e "   - Click Save"

echo -e "\n2. ${BLUE}Create Content:${NC}"
echo -e "   - Create and publish blog posts"
echo -e "   - Add services"
echo -e "   - Upload logo and favicon in Global Settings"

echo -e "\n3. ${BLUE}Test the website:${NC}"
echo -e "   - Homepage: http://152.67.4.226"
echo -e "   - Blog: http://152.67.4.226/blog"
echo -e "   - API: http://152.67.4.226/api/blog-posts"

echo -e "\n${GREEN}Deployment log saved to: ~/deployment-$(date +%Y%m%d-%H%M%S).log${NC}"