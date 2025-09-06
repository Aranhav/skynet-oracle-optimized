#!/bin/bash

# =====================================================
# COMPREHENSIVE FIX FOR ALL DEPLOYMENT ISSUES
# =====================================================

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}=========================================${NC}"
echo -e "${BLUE}   FIXING ALL DEPLOYMENT ISSUES${NC}"
echo -e "${BLUE}=========================================${NC}"
echo ""

# 1. Stop all services
echo -e "${YELLOW}1. Stopping all services...${NC}"
pm2 stop all
pm2 delete all

# 2. Fix database foreign key constraint issue
echo -e "${YELLOW}2. Fixing database constraints...${NC}"
PGPASSWORD=skynet2024 psql -U skynet -d skynet_cms << 'EOF'
-- Drop the problematic foreign key constraint
ALTER TABLE files DROP CONSTRAINT IF EXISTS files_created_by_id_fk;
ALTER TABLE files DROP CONSTRAINT IF EXISTS files_updated_by_id_fk;

-- Create a dummy admin user if none exists
INSERT INTO admin_users (id, firstname, lastname, username, email, password, is_active, blocked, created_at, updated_at)
VALUES (1, 'System', 'Admin', 'system', 'system@skynet.com', '$2a$10$dummy', true, false, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Update files table to use the dummy admin user where needed
UPDATE files SET created_by_id = 1 WHERE created_by_id IS NOT NULL AND created_by_id NOT IN (SELECT id FROM admin_users);
UPDATE files SET updated_by_id = 1 WHERE updated_by_id IS NOT NULL AND updated_by_id NOT IN (SELECT id FROM admin_users);

-- Re-add the foreign key constraints with CASCADE
ALTER TABLE files 
ADD CONSTRAINT files_created_by_id_fk 
FOREIGN KEY (created_by_id) 
REFERENCES admin_users(id) 
ON DELETE SET NULL;

ALTER TABLE files 
ADD CONSTRAINT files_updated_by_id_fk 
FOREIGN KEY (updated_by_id) 
REFERENCES admin_users(id) 
ON DELETE SET NULL;

-- Fix any other orphaned references
UPDATE files SET created_by_id = NULL WHERE created_by_id NOT IN (SELECT id FROM admin_users);
UPDATE files SET updated_by_id = NULL WHERE updated_by_id NOT IN (SELECT id FROM admin_users);

-- Grant permissions
GRANT ALL ON ALL TABLES IN SCHEMA public TO skynet;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO skynet;
EOF

echo -e "${GREEN}✓ Database constraints fixed${NC}"

# 3. Create proper admin user
echo -e "${YELLOW}3. Creating admin user...${NC}"
cd /var/www/skynet/cms
npm run strapi admin:create-user -- \
  --firstname="Admin" \
  --lastname="Skynet" \
  --email="admin@skynet.com" \
  --password="Admin123!@#" 2>/dev/null || echo "Admin user may already exist"

# 4. Fix Strapi schema warning
echo -e "${YELLOW}4. Fixing Strapi schema warnings...${NC}"
# Check if service schema exists and needs fixing
if [ -f "/var/www/skynet/cms/src/api/service/content-types/service/schema.json" ]; then
    sed -i 's/"inversedBy"/"mappedBy"/g' /var/www/skynet/cms/src/api/service/content-types/service/schema.json
    echo -e "${GREEN}✓ Schema fixed${NC}"
fi

# 5. Update Nginx configuration to properly proxy API routes
echo -e "${YELLOW}5. Updating Nginx configuration...${NC}"
sudo tee /etc/nginx/sites-available/skynet > /dev/null << 'NGINX'
server {
    listen 80;
    server_name _;
    client_max_body_size 250M;

    # API routes from Next.js (including /api/track)
    location /api {
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

    # Strapi Admin
    location /admin {
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

    # Strapi API and other endpoints
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
NGINX

# Test and reload Nginx
sudo nginx -t && sudo systemctl reload nginx
echo -e "${GREEN}✓ Nginx configuration updated${NC}"

# 6. Rebuild Strapi if needed
echo -e "${YELLOW}6. Rebuilding Strapi...${NC}"
cd /var/www/skynet/cms
npm run build

# 7. Create PM2 ecosystem config
echo -e "${YELLOW}7. Creating PM2 configuration...${NC}"
cat > /var/www/skynet/ecosystem.config.js << 'PMCONF'
module.exports = {
  apps: [
    {
      name: 'skynet-cms',
      cwd: '/var/www/skynet/cms',
      script: 'npm',
      args: 'start',
      max_restarts: 5,
      min_uptime: '30s',
      max_memory_restart: '3G',
      env: {
        NODE_ENV: 'production',
        NODE_OPTIONS: '--max-old-space-size=3072'
      },
      error_file: '/var/log/pm2/cms-error.log',
      out_file: '/var/log/pm2/cms-out.log',
      time: true
    },
    {
      name: 'skynet-frontend',
      cwd: '/var/www/skynet/frontend',
      script: 'npm',
      args: 'start',
      max_restarts: 5,
      min_uptime: '10s',
      max_memory_restart: '2G',
      env: {
        NODE_ENV: 'production',
        NODE_OPTIONS: '--max-old-space-size=2048'
      },
      error_file: '/var/log/pm2/frontend-error.log',
      out_file: '/var/log/pm2/frontend-out.log',
      time: true
    }
  ]
}
PMCONF

# 8. Start services with PM2
echo -e "${YELLOW}8. Starting services...${NC}"
cd /var/www/skynet
pm2 start ecosystem.config.js

# 9. Wait for services to start
echo -e "${YELLOW}9. Waiting for services to start...${NC}"
sleep 10

# 10. Check service status
echo -e "${YELLOW}10. Checking service status...${NC}"
pm2 list

# 11. Test endpoints
echo -e "${YELLOW}11. Testing endpoints...${NC}"
echo ""
echo "Testing Strapi health:"
curl -s http://localhost:1337/_health | head -5 || echo "Strapi health check failed"
echo ""
echo "Testing Frontend:"
curl -I http://localhost:3000 2>/dev/null | head -3
echo ""
echo "Testing tracking API:"
curl -s "http://localhost/api/track?awbNo=620197252555" | head -5 || echo "Tracking API failed"
echo ""
echo "Testing Strapi admin:"
curl -I http://localhost/admin 2>/dev/null | head -3

# 12. Save PM2 configuration
pm2 save
pm2 startup systemd -u $USER --hp /home/$USER | grep 'sudo' | bash

echo ""
echo -e "${GREEN}=========================================${NC}"
echo -e "${GREEN}   ALL FIXES APPLIED${NC}"
echo -e "${GREEN}=========================================${NC}"
echo ""
echo -e "${YELLOW}Test URLs:${NC}"
echo "  Main site:     http://152.67.4.226"
echo "  Strapi admin:  http://152.67.4.226/admin"
echo "  Tracking API:  http://152.67.4.226/api/track?awbNo=620197252555"
echo ""
echo -e "${YELLOW}Admin credentials:${NC}"
echo "  Email: admin@skynet.com"
echo "  Password: Admin123!@#"
echo ""
echo -e "${YELLOW}Monitor logs:${NC}"
echo "  pm2 logs skynet-cms"
echo "  pm2 logs skynet-frontend"
echo ""
echo -e "${RED}Don't forget to configure Oracle Security Lists for port 80!${NC}"