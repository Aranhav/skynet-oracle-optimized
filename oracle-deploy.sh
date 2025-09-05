#!/bin/bash

# =====================================================
# SKYNET ORACLE DEPLOYMENT SCRIPT
# Optimized for Oracle Cloud Free Tier (24GB RAM, 4 ARM Cores)
# =====================================================

set -e

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Configuration
DB_NAME="skynet_db"
DB_USER="skynet"
DB_PASS="SkynetOracle2024!"
SERVER_IP=$(hostname -I | awk '{print $1}')

echo -e "${BLUE}==========================================${NC}"
echo -e "${BLUE}  SKYNET ORACLE DEPLOYMENT${NC}"
echo -e "${BLUE}  Server: ARM 4-Core, 24GB RAM${NC}"
echo -e "${BLUE}==========================================${NC}"

# Function to check status
check_status() {
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ $1 completed${NC}"
    else
        echo -e "${YELLOW}✗ $1 failed${NC}"
        exit 1
    fi
}

# =====================================================
# STEP 1: System Update and Dependencies
# =====================================================
echo -e "${YELLOW}Step 1: Installing system dependencies...${NC}"
sudo apt update
sudo apt install -y nodejs npm postgresql postgresql-contrib nginx git build-essential
npm install -g pm2
check_status "System dependencies"

# =====================================================
# STEP 2: PostgreSQL Setup
# =====================================================
echo -e "${YELLOW}Step 2: Setting up PostgreSQL...${NC}"
sudo systemctl start postgresql
sudo systemctl enable postgresql

sudo -u postgres psql << EOF
DROP DATABASE IF EXISTS ${DB_NAME};
DROP USER IF EXISTS ${DB_USER};
CREATE DATABASE ${DB_NAME};
CREATE USER ${DB_USER} WITH PASSWORD '${DB_PASS}';
GRANT ALL PRIVILEGES ON DATABASE ${DB_NAME} TO ${DB_USER};
ALTER DATABASE ${DB_NAME} OWNER TO ${DB_USER};
\q
EOF
check_status "PostgreSQL setup"

# =====================================================
# STEP 3: Create Application Directory
# =====================================================
echo -e "${YELLOW}Step 3: Setting up application directory...${NC}"
sudo mkdir -p /var/www/skynet
sudo chown -R $USER:$USER /var/www/skynet
cd /var/www/skynet
check_status "Directory setup"

# =====================================================
# STEP 4: Deploy Strapi CMS
# =====================================================
echo -e "${YELLOW}Step 4: Deploying Strapi CMS...${NC}"
cp -r ~/Skynet_oracle_docker/skynet-cms /var/www/skynet/cms
cd /var/www/skynet/cms

# Create environment file
cat > .env << EOF
HOST=0.0.0.0
PORT=1337
APP_KEYS=$(openssl rand -base64 32),$(openssl rand -base64 32)
ADMIN_JWT_SECRET=$(openssl rand -base64 32)
API_TOKEN_SALT=$(openssl rand -base64 32)
TRANSFER_TOKEN_SALT=$(openssl rand -base64 32)
JWT_SECRET=$(openssl rand -base64 32)

# Database
DATABASE_CLIENT=postgres
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=${DB_NAME}
DATABASE_USERNAME=${DB_USER}
DATABASE_PASSWORD=${DB_PASS}
DATABASE_SSL=false

# Server
URL=http://${SERVER_IP}
PUBLIC_URL=http://${SERVER_IP}:1337
EOF

# Create uploads directory
mkdir -p public/uploads
chmod 755 public/uploads

# Install and build
npm install
npm run build
check_status "Strapi deployment"

# =====================================================
# STEP 5: Deploy Frontend
# =====================================================
echo -e "${YELLOW}Step 5: Deploying Frontend...${NC}"
cp -r ~/Skynet_oracle_docker/skynet-revamp /var/www/skynet/frontend
cd /var/www/skynet/frontend

# Create environment file
cat > .env.local << EOF
NEXT_PUBLIC_API_URL=http://${SERVER_IP}:1337
NEXT_PUBLIC_SITE_URL=http://${SERVER_IP}
NEXT_PUBLIC_STRAPI_URL=http://${SERVER_IP}:1337
STRAPI_API_URL=http://localhost:1337
NEXT_PUBLIC_DEMO_MODE=false
NODE_ENV=production
EOF

# Install and build
npm install
npm run build
check_status "Frontend deployment"

# =====================================================
# STEP 6: Configure Nginx
# =====================================================
echo -e "${YELLOW}Step 6: Configuring Nginx...${NC}"
sudo tee /etc/nginx/sites-available/skynet > /dev/null << EOF
server {
    listen 80;
    server_name ${SERVER_IP};
    client_max_body_size 250M;

    # Frontend
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }

    # Strapi Admin
    location /admin {
        proxy_pass http://localhost:1337/admin;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }

    # Strapi API
    location /api {
        proxy_pass http://localhost:1337/api;
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }

    # Strapi uploads
    location /uploads {
        proxy_pass http://localhost:1337/uploads;
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF

sudo ln -sf /etc/nginx/sites-available/skynet /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl restart nginx
check_status "Nginx configuration"

# =====================================================
# STEP 7: Start Services with PM2
# =====================================================
echo -e "${YELLOW}Step 7: Starting services with PM2...${NC}"

# Start Strapi
cd /var/www/skynet/cms
pm2 start npm --name "strapi-cms" -- start
pm2 save

# Start Frontend
cd /var/www/skynet/frontend
pm2 start npm --name "frontend" -- start
pm2 save

# Setup PM2 startup
pm2 startup systemd -u $USER --hp /home/$USER
pm2 save
check_status "PM2 services"

# =====================================================
# STEP 8: Configure Firewall
# =====================================================
echo -e "${YELLOW}Step 8: Configuring firewall...${NC}"
sudo iptables -I INPUT -p tcp --dport 80 -j ACCEPT
sudo iptables -I INPUT -p tcp --dport 443 -j ACCEPT
sudo iptables -I INPUT -p tcp --dport 22 -j ACCEPT
sudo netfilter-persistent save
check_status "Firewall configuration"

# =====================================================
# FINAL STATUS
# =====================================================
echo ""
echo -e "${GREEN}==========================================${NC}"
echo -e "${GREEN}  DEPLOYMENT COMPLETED SUCCESSFULLY!${NC}"
echo -e "${GREEN}==========================================${NC}"
echo ""
pm2 status
echo ""
echo -e "${BLUE}Access URLs:${NC}"
echo -e "  Frontend:     ${GREEN}http://${SERVER_IP}${NC}"
echo -e "  Strapi Admin: ${GREEN}http://${SERVER_IP}/admin${NC}"
echo -e "  API:          ${GREEN}http://${SERVER_IP}/api${NC}"
echo ""
echo -e "${YELLOW}Next Steps:${NC}"
echo "1. Create Strapi admin: http://${SERVER_IP}/admin"
echo "2. Configure content types in Strapi"
echo "3. Generate API token for frontend"
echo ""
echo -e "${BLUE}Server Resources:${NC}"
echo "  RAM: 24GB available (using ~3GB)"
echo "  CPU: 4 ARM cores"
echo "  Storage: 200GB available"
echo ""