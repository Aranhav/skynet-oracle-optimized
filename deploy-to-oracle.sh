#!/bin/bash

# COMPLETE DEPLOYMENT SCRIPT FOR SKYNET ORACLE
# Version: 5.0 - All-in-one deployment with all fixes

set -e

# Configuration
SERVER_IP="152.67.4.226"
SERVER_USER="ubuntu"
STRAPI_URL="http://152.67.4.226"
ADMIN_EMAIL="admin@skynet.com"
ADMIN_PASSWORD="SkynetAdmin@2025"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}         SKYNET COMPLETE DEPLOYMENT TO ORACLE             ${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

# Step 1: Push to GitHub
echo -e "\n${YELLOW}Step 1: Pushing code to GitHub...${NC}"
git add -A
git commit -m "Deploy: Complete deployment with all fixes" || true
git push origin main
echo -e "${GREEN}✓ Code pushed to GitHub${NC}"

# Step 2: Deploy to server
echo -e "\n${YELLOW}Step 2: Deploying to Oracle server...${NC}"

# Create complete deployment script
cat > /tmp/deploy-remote.sh << 'REMOTE_SCRIPT'
#!/bin/bash

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "\n${YELLOW}Pulling latest code...${NC}"
cd ~/skynet-oracle-optimized
git pull origin main

echo -e "\n${YELLOW}Updating frontend files...${NC}"
sudo cp -r skynet-revamp/* /var/www/skynet/frontend/

echo -e "\n${YELLOW}Installing dependencies...${NC}"
cd /var/www/skynet/frontend
npm install

echo -e "\n${YELLOW}Building frontend...${NC}"
npm run build

echo -e "\n${YELLOW}Configuring Nginx for proper API routing...${NC}"
# Backup existing config
sudo cp /etc/nginx/sites-available/skynet /etc/nginx/sites-available/skynet.backup.$(date +%s)

# Create proper Nginx configuration
sudo tee /etc/nginx/sites-available/skynet > /dev/null << 'NGINX_CONFIG'
server {
    listen 80;
    listen [::]:80;
    server_name 152.67.4.226;
    client_max_body_size 100M;

    # Next.js specific API routes
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

    # Strapi API routes
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

    # Strapi Admin
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

    # Strapi uploads
    location /uploads {
        proxy_pass http://localhost:1337/uploads;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Strapi health
    location /_health {
        proxy_pass http://localhost:1337/_health;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
    }

    # Socket.io
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

    # Next.js app
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
NGINX_CONFIG

echo -e "\n${YELLOW}Testing and reloading Nginx...${NC}"
sudo nginx -t
sudo systemctl reload nginx
echo -e "${GREEN}✓ Nginx configured${NC}"

echo -e "\n${YELLOW}Restarting services...${NC}"
pm2 restart skynet-cms
pm2 restart skynet-frontend
pm2 save
echo -e "${GREEN}✓ Services restarted${NC}"

echo -e "\n${YELLOW}Checking service status...${NC}"
pm2 status

echo -e "\n${YELLOW}Testing API endpoints...${NC}"
BLOG_TEST=$(curl -s -o /dev/null -w "%{http_code}" http://152.67.4.226/api/blog-posts)
SERVICE_TEST=$(curl -s -o /dev/null -w "%{http_code}" http://152.67.4.226/api/services)
OFFICE_TEST=$(curl -s -o /dev/null -w "%{http_code}" http://152.67.4.226/api/office-locations)

if [ "$BLOG_TEST" = "200" ]; then
    echo -e "${GREEN}✓ Blog Posts API working (HTTP 200)${NC}"
else
    echo -e "${YELLOW}⚠ Blog Posts API returned HTTP $BLOG_TEST${NC}"
fi

if [ "$SERVICE_TEST" = "200" ]; then
    echo -e "${GREEN}✓ Services API working (HTTP 200)${NC}"
else
    echo -e "${YELLOW}⚠ Services API returned HTTP $SERVICE_TEST${NC}"
fi

if [ "$OFFICE_TEST" = "200" ]; then
    echo -e "${GREEN}✓ Office Locations API working (HTTP 200)${NC}"
else
    echo -e "${YELLOW}⚠ Office Locations API returned HTTP $OFFICE_TEST${NC}"
fi

echo -e "\n${GREEN}Server deployment complete!${NC}"
REMOTE_SCRIPT

# Execute on server
echo -e "${YELLOW}Connecting to server and deploying...${NC}"
scp /tmp/deploy-remote.sh ${SERVER_USER}@${SERVER_IP}:/tmp/
ssh ${SERVER_USER}@${SERVER_IP} "chmod +x /tmp/deploy-remote.sh && /tmp/deploy-remote.sh && rm /tmp/deploy-remote.sh"

# Step 3: Test deployment
echo -e "\n${YELLOW}Step 3: Testing deployment...${NC}"

test_endpoint() {
    local NAME="$1"
    local URL="$2"
    local RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" "${URL}")
    
    if [ "$RESPONSE" = "200" ]; then
        echo -e "  ${GREEN}✓${NC} $NAME - OK"
    else
        echo -e "  ${RED}✗${NC} $NAME - HTTP $RESPONSE"
    fi
}

echo -e "\n${BLUE}Testing Frontend Pages:${NC}"
test_endpoint "Homepage" "${STRAPI_URL}/"
test_endpoint "Blog Page" "${STRAPI_URL}/blog"
test_endpoint "Services" "${STRAPI_URL}/services"
test_endpoint "Contact" "${STRAPI_URL}/contact"

echo -e "\n${BLUE}Testing Strapi APIs:${NC}"
test_endpoint "Blog Posts API" "${STRAPI_URL}/api/blog-posts"
test_endpoint "Services API" "${STRAPI_URL}/api/services"
test_endpoint "Office Locations API" "${STRAPI_URL}/api/office-locations"
test_endpoint "Global Settings API" "${STRAPI_URL}/api/global-settings"

echo -e "\n${BLUE}Testing Admin:${NC}"
test_endpoint "Strapi Admin" "${STRAPI_URL}/admin"

# Step 4: Attempt to set permissions via API
echo -e "\n${YELLOW}Step 4: Attempting to configure Strapi permissions...${NC}"

# Try to login and set permissions
AUTH_RESPONSE=$(curl -s -X POST "${STRAPI_URL}/admin/login" \
  -H "Content-Type: application/json" \
  -d "{\"email\": \"${ADMIN_EMAIL}\", \"password\": \"${ADMIN_PASSWORD}\"}" 2>/dev/null || echo "")

if echo "$AUTH_RESPONSE" | grep -q "token"; then
    echo -e "${GREEN}✓ Successfully authenticated with Strapi${NC}"
    echo -e "${YELLOW}Note: Manual permission configuration still required${NC}"
else
    echo -e "${YELLOW}⚠ Could not auto-configure permissions${NC}"
fi

# Cleanup
rm -f /tmp/deploy-remote.sh

# Final summary
echo -e "\n${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}                 DEPLOYMENT COMPLETE!                     ${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

echo -e "\n${YELLOW}REQUIRED MANUAL STEPS:${NC}"
echo -e "\n1. ${BLUE}Configure Strapi Public Permissions:${NC}"
echo -e "   ${CYAN}URL:${NC} ${STRAPI_URL}/admin"
echo -e "   ${CYAN}Email:${NC} ${ADMIN_EMAIL}"
echo -e "   ${CYAN}Password:${NC} ${ADMIN_PASSWORD}"
echo -e "   ${CYAN}Steps:${NC}"
echo -e "   - Go to Settings → Users & Permissions → Roles → Public"
echo -e "   - Enable 'find' and 'findOne' for ALL content types:"
echo -e "     • Blog-post"
echo -e "     • Service"
echo -e "     • Office-location"
echo -e "     • Global-setting"
echo -e "     • Faq"
echo -e "     • Partner"
echo -e "     • Testimonial"
echo -e "   - Click Save"

echo -e "\n2. ${BLUE}Create Content in Strapi:${NC}"
echo -e "   - Create and publish blog posts"
echo -e "   - Add services"
echo -e "   - Upload logo and favicon"

echo -e "\n${GREEN}TEST URLS:${NC}"
echo -e "  Website: ${BLUE}${STRAPI_URL}${NC}"
echo -e "  Blog: ${BLUE}${STRAPI_URL}/blog${NC}"
echo -e "  Admin: ${BLUE}${STRAPI_URL}/admin${NC}"
echo -e "  API Test: ${BLUE}${STRAPI_URL}/api/blog-posts${NC}"

echo -e "\n${GREEN}Deployment completed at: $(date)${NC}"