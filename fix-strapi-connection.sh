#!/bin/bash

# =====================================================
# FIX STRAPI CONNECTION TIMEOUT ISSUES
# =====================================================

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}=========================================${NC}"
echo -e "${BLUE}   FIXING STRAPI CONNECTION ISSUES${NC}"
echo -e "${BLUE}=========================================${NC}"
echo ""

# 1. Check if Strapi is running
echo -e "${YELLOW}1. Checking Strapi CMS status...${NC}"
pm2 list

# Check if skynet-cms exists in PM2
if ! pm2 describe skynet-cms > /dev/null 2>&1; then
    echo -e "${RED}✗ Strapi CMS not found in PM2${NC}"
    echo -e "${YELLOW}Starting Strapi CMS...${NC}"
    
    # Navigate to CMS directory
    cd /var/www/skynet/cms || cd ~/skynet-oracle-optimized/skynet-cms || {
        echo -e "${RED}CMS directory not found${NC}"
        exit 1
    }
    
    # Start with PM2
    pm2 start npm --name skynet-cms -- start
else
    # Check if it's running
    if pm2 describe skynet-cms | grep -q "stopped\|errored"; then
        echo -e "${RED}✗ Strapi CMS is stopped or errored${NC}"
        echo -e "${YELLOW}Restarting Strapi CMS...${NC}"
        pm2 restart skynet-cms
    else
        echo -e "${GREEN}✓ Strapi CMS is in PM2${NC}"
    fi
fi

# 2. Wait for Strapi to start
echo -e "\n${YELLOW}2. Waiting for Strapi to respond...${NC}"
for i in {1..30}; do
    if curl -s http://localhost:1337/_health > /dev/null 2>&1; then
        echo -e "${GREEN}✓ Strapi is responding on port 1337${NC}"
        break
    fi
    echo -n "."
    sleep 2
done

# 3. Check if port 1337 is accessible
echo -e "\n${YELLOW}3. Checking port 1337...${NC}"
if sudo lsof -i :1337 | grep -q LISTEN; then
    echo -e "${GREEN}✓ Port 1337 is listening${NC}"
    sudo lsof -i :1337 | head -5
else
    echo -e "${RED}✗ Nothing listening on port 1337${NC}"
    
    # Try to start Strapi directly
    echo -e "${YELLOW}Attempting direct start...${NC}"
    cd /var/www/skynet/cms || cd ~/skynet-oracle-optimized/skynet-cms
    npm run develop &
    sleep 10
fi

# 4. Fix Nginx configuration for Strapi API
echo -e "\n${YELLOW}4. Updating Nginx configuration...${NC}"
sudo tee /etc/nginx/sites-available/skynet > /dev/null << 'NGINX'
server {
    listen 80;
    server_name _;
    client_max_body_size 250M;

    # Next.js API routes
    location /api/track {
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
    
    location /api/health {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
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

    # Strapi API endpoints - IMPORTANT: This must come before the root location
    location ~ ^/(api|content-manager|content-type-builder|upload|users-permissions|_health)/? {
        # Skip if it's a Next.js API route
        if ($uri ~* ^/api/(track|health|mock)) {
            proxy_pass http://localhost:3000;
            break;
        }
        
        # Otherwise proxy to Strapi
        proxy_pass http://localhost:1337;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_read_timeout 90;
        
        # CORS headers for Strapi API
        add_header 'Access-Control-Allow-Origin' '*' always;
        add_header 'Access-Control-Allow-Methods' 'GET, POST, PUT, DELETE, OPTIONS' always;
        add_header 'Access-Control-Allow-Headers' 'DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range,Authorization' always;
        add_header 'Access-Control-Expose-Headers' 'Content-Length,Content-Range' always;
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

    # Frontend (everything else)
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

# Add a specific server block for port 1337 direct access
server {
    listen 1337;
    server_name _;
    
    location / {
        proxy_pass http://localhost:1337;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        
        # CORS headers
        add_header 'Access-Control-Allow-Origin' '*' always;
        add_header 'Access-Control-Allow-Methods' 'GET, POST, PUT, DELETE, OPTIONS' always;
        add_header 'Access-Control-Allow-Headers' 'DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range,Authorization' always;
    }
}
NGINX

# Test and reload Nginx
sudo nginx -t && sudo systemctl reload nginx
echo -e "${GREEN}✓ Nginx configuration updated${NC}"

# 5. Check firewall rules
echo -e "\n${YELLOW}5. Checking firewall rules...${NC}"
# Check if port 1337 is open
if sudo iptables -L INPUT -n | grep -q "1337"; then
    echo -e "${GREEN}✓ Port 1337 is in firewall rules${NC}"
else
    echo -e "${YELLOW}Adding port 1337 to firewall...${NC}"
    sudo iptables -I INPUT -p tcp --dport 1337 -j ACCEPT
    sudo iptables -I INPUT -p tcp --dport 80 -j ACCEPT
    # Save rules
    if command -v netfilter-persistent &> /dev/null; then
        sudo netfilter-persistent save
    fi
fi

# 6. Update environment variables for frontend
echo -e "\n${YELLOW}6. Checking frontend environment...${NC}"
FRONTEND_ENV="/var/www/skynet/frontend/.env.local"
if [ -f "$FRONTEND_ENV" ]; then
    # Check if using port in URL
    if grep -q "NEXT_PUBLIC_STRAPI_URL=http://152.67.4.226:1337" "$FRONTEND_ENV"; then
        echo -e "${YELLOW}Frontend is configured to use port 1337 directly${NC}"
        # Update to use proxy through port 80
        sed -i 's|NEXT_PUBLIC_STRAPI_URL=http://152.67.4.226:1337|NEXT_PUBLIC_STRAPI_URL=http://152.67.4.226|g' "$FRONTEND_ENV"
        sed -i 's|NEXT_PUBLIC_API_URL=http://152.67.4.226:1337|NEXT_PUBLIC_API_URL=http://152.67.4.226|g' "$FRONTEND_ENV"
        echo -e "${GREEN}✓ Updated to use Nginx proxy${NC}"
        
        # Restart frontend
        echo -e "${YELLOW}Restarting frontend...${NC}"
        pm2 restart skynet-frontend
    fi
fi

# 7. Test Strapi endpoints
echo -e "\n${YELLOW}7. Testing Strapi endpoints...${NC}"
echo ""
echo "Testing health endpoint:"
curl -s http://localhost:1337/_health | head -5 || echo "Direct health check failed"
echo ""
echo "Testing through Nginx (port 80):"
curl -s http://localhost/api/blog-posts | head -5 || echo "Nginx proxy failed"
echo ""
echo "Testing admin panel:"
curl -I http://localhost/admin 2>/dev/null | head -3

# 8. Check PM2 logs for errors
echo -e "\n${YELLOW}8. Recent Strapi logs:${NC}"
pm2 logs skynet-cms --lines 10 --nostream

# 9. Final status
echo -e "\n${GREEN}=========================================${NC}"
echo -e "${GREEN}   DIAGNOSTICS COMPLETE${NC}"
echo -e "${GREEN}=========================================${NC}"
pm2 list

echo -e "\n${YELLOW}Test URLs:${NC}"
echo "  Direct Strapi:  http://152.67.4.226:1337/api/blog-posts"
echo "  Through Nginx:  http://152.67.4.226/api/blog-posts"
echo "  Admin Panel:    http://152.67.4.226/admin"
echo ""
echo -e "${YELLOW}If still having issues:${NC}"
echo "1. Check Oracle Security Lists for ports 80 and 1337"
echo "2. Ensure Strapi API permissions are set to public"
echo "3. Check database connection: pm2 logs skynet-cms"
echo "4. Rebuild frontend: cd /var/www/skynet/frontend && npm run build && pm2 restart skynet-frontend"