#!/bin/bash

# =====================================================
# Fix Strapi 502 Bad Gateway Error
# =====================================================

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}=========================================${NC}"
echo -e "${BLUE}   Fixing Strapi 502 Error${NC}"
echo -e "${BLUE}=========================================${NC}"
echo ""

# 1. Check PM2 status
echo -e "${YELLOW}1. Checking PM2 services...${NC}"
pm2 list

# 2. Check if Strapi is running
echo -e "\n${YELLOW}2. Checking Strapi CMS status...${NC}"
if pm2 describe skynet-cms | grep -q "online"; then
    echo -e "${GREEN}✓ Strapi is running${NC}"
else
    echo -e "${RED}✗ Strapi is not running or crashed${NC}"
fi

# 3. Check Strapi logs for errors
echo -e "\n${YELLOW}3. Recent Strapi errors:${NC}"
pm2 logs skynet-cms --lines 20 --nostream

# 4. Check database connection
echo -e "\n${YELLOW}4. Testing database connection...${NC}"
PGPASSWORD=skynet2024 psql -U skynet -d skynet_cms -h localhost -c "SELECT 'Database OK' as status;" 2>&1 || {
    echo -e "${RED}✗ Database connection failed${NC}"
    echo "Attempting to fix database..."
    
    # Start PostgreSQL if not running
    sudo systemctl start postgresql
    sudo systemctl enable postgresql
    
    # Create database if missing
    sudo -u postgres psql << EOF
CREATE DATABASE IF NOT EXISTS skynet_cms;
CREATE USER IF NOT EXISTS skynet WITH PASSWORD 'skynet2024';
GRANT ALL PRIVILEGES ON DATABASE skynet_cms TO skynet;
EOF
}

# 5. Check Node.js version
echo -e "\n${YELLOW}5. Checking Node.js version...${NC}"
node_version=$(node -v | sed 's/v//' | cut -d. -f1)
if [ "$node_version" -ge 23 ]; then
    echo -e "${RED}✗ Node.js v$node_version is not compatible with Strapi!${NC}"
    echo "Please install Node.js 20 or 22"
    exit 1
else
    echo -e "${GREEN}✓ Node.js $(node -v) is compatible${NC}"
fi

# 6. Check if port 1337 is in use
echo -e "\n${YELLOW}6. Checking port 1337...${NC}"
if sudo lsof -i :1337 | grep -q LISTEN; then
    echo -e "${GREEN}✓ Port 1337 is listening${NC}"
else
    echo -e "${RED}✗ Nothing listening on port 1337${NC}"
fi

# 7. Fix: Rebuild and restart Strapi
echo -e "\n${YELLOW}7. Attempting to fix Strapi...${NC}"

# Stop Strapi
echo "Stopping Strapi..."
pm2 stop skynet-cms

# Navigate to CMS directory
cd /var/www/skynet/cms || {
    echo -e "${RED}CMS directory not found at /var/www/skynet/cms${NC}"
    echo "Trying alternative location..."
    cd ~/skynet-oracle-optimized/skynet-cms || {
        echo -e "${RED}Cannot find CMS directory${NC}"
        exit 1
    }
}

# Check if dependencies are installed
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}Installing dependencies...${NC}"
    npm install --no-audit --no-fund
fi

# Check if .env exists
if [ ! -f ".env" ]; then
    echo -e "${RED}✗ .env file missing!${NC}"
    echo "Creating default .env..."
    cat > .env << 'EOF'
HOST=0.0.0.0
PORT=1337
NODE_ENV=production
APP_KEYS=toBeModified1,toBeModified2,toBeModified3,toBeModified4
ADMIN_JWT_SECRET=toBeModified
API_TOKEN_SALT=toBeModified
TRANSFER_TOKEN_SALT=toBeModified
JWT_SECRET=toBeModified
DATABASE_CLIENT=postgres
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=skynet_cms
DATABASE_USERNAME=skynet
DATABASE_PASSWORD=skynet2024
DATABASE_SSL=false
EOF
fi

# Check if build exists
if [ ! -d "build" ]; then
    echo -e "${YELLOW}Building Strapi...${NC}"
    npm run build || {
        echo -e "${RED}Build failed!${NC}"
        echo "Checking build errors..."
        exit 1
    }
fi

# 8. Start Strapi with PM2
echo -e "\n${YELLOW}8. Starting Strapi...${NC}"
pm2 start skynet-cms || {
    # If not in PM2, add it
    pm2 start npm --name skynet-cms -- start
}

# 9. Wait for Strapi to start
echo -e "\n${YELLOW}9. Waiting for Strapi to start...${NC}"
for i in {1..30}; do
    if curl -s http://localhost:1337/_health > /dev/null; then
        echo -e "${GREEN}✓ Strapi is responding!${NC}"
        break
    fi
    echo -n "."
    sleep 2
done

# 10. Test Strapi endpoints
echo -e "\n${YELLOW}10. Testing Strapi endpoints...${NC}"
echo "Health check:"
curl -s http://localhost:1337/_health | head -5 || echo "Health check failed"
echo ""
echo "Admin panel:"
curl -I http://localhost:1337/admin 2>/dev/null | head -3

# 11. Check Nginx configuration
echo -e "\n${YELLOW}11. Checking Nginx configuration...${NC}"
sudo nginx -t && echo -e "${GREEN}✓ Nginx config is valid${NC}"

# 12. Restart Nginx
echo -e "\n${YELLOW}12. Restarting Nginx...${NC}"
sudo systemctl restart nginx
sudo systemctl status nginx --no-pager | head -5

# 13. Final status
echo -e "\n${GREEN}=========================================${NC}"
echo -e "${GREEN}   Fix Complete - Check Status${NC}"
echo -e "${GREEN}=========================================${NC}"
pm2 list

echo -e "\n${YELLOW}Test URLs:${NC}"
echo "  Admin Panel: http://152.67.4.226/admin"
echo "  API Health:  http://152.67.4.226/api/_health"
echo ""
echo -e "${YELLOW}If still getting 502:${NC}"
echo "1. Check logs: pm2 logs skynet-cms"
echo "2. Restart all: pm2 restart all"
echo "3. Check database: PGPASSWORD=skynet2024 psql -U skynet -d skynet_cms -c '\\dt'"