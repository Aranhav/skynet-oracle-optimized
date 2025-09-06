#!/bin/bash

# Automated Deployment Script for Oracle Cloud Server
# Version: 1.0 - Complete deployment with all fixes

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Server details
SERVER_IP="152.67.4.226"
SERVER_USER="ubuntu"

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}         SKYNET INDIA - ORACLE CLOUD DEPLOYMENT           ${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

# Function to execute commands on server
execute_on_server() {
    ssh ${SERVER_USER}@${SERVER_IP} "$@"
}

# Function to copy files to server
copy_to_server() {
    scp -r "$1" ${SERVER_USER}@${SERVER_IP}:"$2"
}

echo -e "\n${YELLOW}Step 1: Pushing latest code to GitHub...${NC}"
git add -A
git commit -m "Deploy: Complete fixes for Strapi API and blog visibility" || true
git push origin main

echo -e "\n${YELLOW}Step 2: Connecting to Oracle server...${NC}"
echo -e "${GREEN}Server: ${SERVER_IP}${NC}"

# Create deployment script to run on server
cat > /tmp/remote-deploy.sh << 'EOF'
#!/bin/bash

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "\n${YELLOW}Updating code from GitHub...${NC}"
cd ~/skynet-oracle-optimized
git pull origin main

echo -e "\n${YELLOW}Copying frontend files...${NC}"
sudo cp -r skynet-revamp/* /var/www/skynet/frontend/

echo -e "\n${YELLOW}Installing frontend dependencies...${NC}"
cd /var/www/skynet/frontend
npm install

echo -e "\n${YELLOW}Building frontend with all fixes...${NC}"
npm run build

echo -e "\n${YELLOW}Restarting frontend service...${NC}"
pm2 restart skynet-frontend

echo -e "\n${YELLOW}Fixing Nginx configuration...${NC}"
sudo bash ~/skynet-oracle-optimized/fix-strapi-api-routing.sh

echo -e "\n${YELLOW}Checking services status...${NC}"
pm2 status

echo -e "\n${GREEN}✓ Deployment completed!${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}Next Steps:${NC}"
echo -e "1. Access Strapi Admin: http://${SERVER_IP}/admin"
echo -e "   Email: admin@skynet.com"
echo -e "   Password: SkynetAdmin@2025"
echo -e "2. Set public permissions for all content types"
echo -e "3. Create and publish blog posts"
echo -e "4. Visit http://${SERVER_IP}/blog to verify"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
EOF

echo -e "\n${YELLOW}Step 3: Deploying to server...${NC}"
scp /tmp/remote-deploy.sh ${SERVER_USER}@${SERVER_IP}:/tmp/
execute_on_server "chmod +x /tmp/remote-deploy.sh && /tmp/remote-deploy.sh"

echo -e "\n${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}         DEPLOYMENT SUCCESSFUL!           ${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "\n${YELLOW}IMPORTANT: Configure Strapi Permissions${NC}"
echo -e "1. Login to Strapi: ${BLUE}http://${SERVER_IP}/admin${NC}"
echo -e "2. Go to Settings → Users & Permissions → Roles → Public"
echo -e "3. Enable 'find' and 'findOne' for all content types"
echo -e "4. Create and publish blog posts"
echo -e "\n${GREEN}Test URLs:${NC}"
echo -e "- Blog Page: ${BLUE}http://${SERVER_IP}/blog${NC}"
echo -e "- API Test: ${BLUE}http://${SERVER_IP}/api/blog-posts${NC}"

# Clean up
rm /tmp/remote-deploy.sh