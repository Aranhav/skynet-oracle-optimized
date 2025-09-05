#!/bin/bash

# =====================================================
# SKYNET ORACLE DEPLOYMENT - ALL-IN-ONE SCRIPT
# For Oracle Cloud Free Tier (24GB RAM, 4 ARM Cores)
# =====================================================

set -e

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Configuration
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
DEPLOY_DIR="/var/www/skynet"
FRONTEND_DIR="skynet-revamp"
CMS_DIR="skynet-cms"

# Default values
MODE=${1:-"full"}  # full, env-only, deploy-only
SERVER_IP=${2:-$(hostname -I | awk '{print $1}')}

# =====================================================
# FUNCTIONS
# =====================================================

show_header() {
    echo -e "${BLUE}==========================================${NC}"
    echo -e "${BLUE}  SKYNET ORACLE DEPLOYMENT${NC}"
    echo -e "${BLUE}  Mode: ${MODE}${NC}"
    echo -e "${BLUE}==========================================${NC}\n"
}

check_status() {
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ $1${NC}"
    else
        echo -e "${RED}✗ $1${NC}"
        exit 1
    fi
}

generate_random() {
    openssl rand -base64 $1 2>/dev/null || cat /dev/urandom | tr -dc 'a-zA-Z0-9' | head -c $1
}

check_architecture() {
    ARCH=$(uname -m)
    if [[ "$ARCH" == "aarch64" ]] || [[ "$ARCH" == "arm64" ]]; then
        echo -e "${GREEN}✓ ARM architecture detected${NC}"
    else
        echo -e "${YELLOW}⚠ Warning: Not ARM architecture ($ARCH)${NC}"
        echo -n "Continue anyway? (y/n): "
        read confirm
        if [ "$confirm" != "y" ]; then
            exit 1
        fi
    fi
}

# =====================================================
# ENVIRONMENT SETUP
# =====================================================

setup_environment() {
    echo -e "${YELLOW}Setting up environment variables...${NC}\n"
    
    # Confirm server IP
    echo -e "Server IP: ${GREEN}$SERVER_IP${NC}"
    echo -n "Is this correct? (y/n): "
    read confirm
    if [ "$confirm" != "y" ]; then
        echo -n "Enter server IP: "
        read SERVER_IP
    fi
    
    echo -e "\n${YELLOW}Generating security keys...${NC}"
    
    # Generate keys
    APP_KEY1=$(generate_random 16)
    APP_KEY2=$(generate_random 16)
    APP_KEY3=$(generate_random 16)
    APP_KEY4=$(generate_random 16)
    APP_KEYS="$APP_KEY1,$APP_KEY2,$APP_KEY3,$APP_KEY4"
    
    ADMIN_JWT_SECRET=$(generate_random 32)
    API_TOKEN_SALT=$(generate_random 32)
    TRANSFER_TOKEN_SALT=$(generate_random 32)
    JWT_SECRET=$(generate_random 32)
    DB_PASSWORD=$(generate_random 16)
    
    # Create Frontend .env.local
    echo -e "\n${YELLOW}Creating Frontend environment file...${NC}"
    cat > "$FRONTEND_DIR/.env.local" << EOF
# API Configuration
NEXT_PUBLIC_API_URL=http://${SERVER_IP}:1337
NEXT_PUBLIC_SITE_URL=http://${SERVER_IP}
NEXT_PUBLIC_STRAPI_URL=http://${SERVER_IP}:1337
STRAPI_API_URL=http://localhost:1337
STRAPI_API_TOKEN=

# Environment
NEXT_PUBLIC_DEMO_MODE=false
NODE_ENV=production

# Analytics (Optional)
NEXT_PUBLIC_GA_ID=
NEXT_PUBLIC_FB_PIXEL_ID=789190690162066

# Server Configuration
PORT=3000
HOSTNAME=0.0.0.0
EOF
    
    # Create CMS .env
    echo -e "${YELLOW}Creating CMS environment file...${NC}"
    cat > "$CMS_DIR/.env" << EOF
# Server Configuration
HOST=0.0.0.0
PORT=1337
NODE_ENV=production

# Security Keys
APP_KEYS=${APP_KEYS}
ADMIN_JWT_SECRET=${ADMIN_JWT_SECRET}
API_TOKEN_SALT=${API_TOKEN_SALT}
TRANSFER_TOKEN_SALT=${TRANSFER_TOKEN_SALT}
JWT_SECRET=${JWT_SECRET}

# Database Configuration
DATABASE_CLIENT=postgres
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=skynet_db
DATABASE_USERNAME=skynet
DATABASE_PASSWORD=${DB_PASSWORD}
DATABASE_SSL=false

# Public URLs
URL=http://${SERVER_IP}:1337
PUBLIC_URL=http://${SERVER_IP}:1337

# Upload Configuration
UPLOAD_PROVIDER=local
UPLOAD_SIZE_LIMIT=250

# CORS
CORS_ORIGINS=http://${SERVER_IP},http://localhost:3000
EOF
    
    # Save credentials
    echo -e "\n${YELLOW}Saving credentials...${NC}"
    cat > "credentials.txt" << EOF
=========================================
SKYNET DEPLOYMENT CREDENTIALS
Generated: $(date)
=========================================

SERVER IP: ${SERVER_IP}

DATABASE:
---------
Database: skynet_db
Username: skynet
Password: ${DB_PASSWORD}

URLS:
-----
Frontend: http://${SERVER_IP}
CMS Admin: http://${SERVER_IP}/admin
API: http://${SERVER_IP}/api

NEXT STEPS:
-----------
1. Run deployment: ./deploy.sh deploy-only
2. Create Strapi admin account
3. Generate API token in Strapi Settings
4. Update STRAPI_API_TOKEN in frontend/.env.local
5. Restart frontend: pm2 restart skynet-frontend

=========================================
EOF
    
    # Set permissions
    chmod 600 "$FRONTEND_DIR/.env.local"
    chmod 600 "$CMS_DIR/.env"
    chmod 600 "credentials.txt"
    
    echo -e "${GREEN}✓ Environment setup complete!${NC}"
    echo -e "${YELLOW}Credentials saved to: credentials.txt${NC}"
    echo -e "${RED}⚠ Delete credentials.txt after saving the information!${NC}\n"
}

# =====================================================
# DEPLOYMENT
# =====================================================

deploy_application() {
    echo -e "${YELLOW}Starting deployment...${NC}\n"
    
    # Check environment files
    if [ ! -f "$SCRIPT_DIR/$FRONTEND_DIR/.env.local" ] || [ ! -f "$SCRIPT_DIR/$CMS_DIR/.env" ]; then
        echo -e "${RED}Error: Environment files not found${NC}"
        echo -e "${YELLOW}Run: ./deploy.sh env-only${NC}"
        exit 1
    fi
    
    # Read database credentials
    DB_PASS=$(grep "DATABASE_PASSWORD=" "$SCRIPT_DIR/$CMS_DIR/.env" | cut -d'=' -f2)
    DB_NAME=$(grep "DATABASE_NAME=" "$SCRIPT_DIR/$CMS_DIR/.env" | cut -d'=' -f2)
    DB_USER=$(grep "DATABASE_USERNAME=" "$SCRIPT_DIR/$CMS_DIR/.env" | cut -d'=' -f2)
    
    # Install system dependencies
    echo -e "${YELLOW}Installing system dependencies...${NC}"
    
    if ! command -v node &> /dev/null; then
        curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
        sudo apt-get install -y nodejs
    fi
    
    sudo apt-get update
    sudo apt-get install -y postgresql postgresql-contrib nginx git build-essential
    
    if ! command -v pm2 &> /dev/null; then
        sudo npm install -g pm2
    fi
    
    check_status "System dependencies installed"
    
    # Setup PostgreSQL
    echo -e "${YELLOW}Setting up PostgreSQL...${NC}"
    sudo systemctl start postgresql
    sudo systemctl enable postgresql
    
    DB_EXISTS=$(sudo -u postgres psql -lqt | cut -d \| -f 1 | grep -w "$DB_NAME" || true)
    
    if [ -z "$DB_EXISTS" ]; then
        sudo -u postgres psql << EOF
CREATE DATABASE ${DB_NAME};
CREATE USER ${DB_USER} WITH PASSWORD '${DB_PASS}';
GRANT ALL PRIVILEGES ON DATABASE ${DB_NAME} TO ${DB_USER};
ALTER DATABASE ${DB_NAME} OWNER TO ${DB_USER};
\q
EOF
        check_status "PostgreSQL database created"
    else
        echo -e "${GREEN}✓ Database already exists${NC}"
    fi
    
    # Create application directory
    echo -e "${YELLOW}Setting up application directory...${NC}"
    sudo mkdir -p "$DEPLOY_DIR"
    sudo chown -R $USER:$USER "$DEPLOY_DIR"
    sudo mkdir -p /var/log/pm2
    sudo chown -R $USER:$USER /var/log/pm2
    
    # Deploy CMS
    echo -e "${YELLOW}Deploying Strapi CMS...${NC}"
    cp -r "$SCRIPT_DIR/$CMS_DIR" "$DEPLOY_DIR/cms"
    cd "$DEPLOY_DIR/cms"
    mkdir -p public/uploads
    chmod 755 public/uploads
    npm install --production
    npm run build
    check_status "CMS deployed"
    
    # Deploy Frontend
    echo -e "${YELLOW}Deploying Frontend...${NC}"
    cp -r "$SCRIPT_DIR/$FRONTEND_DIR" "$DEPLOY_DIR/frontend"
    cd "$DEPLOY_DIR/frontend"
    npm install --production
    npm run build
    check_status "Frontend deployed"
    
    # Configure Nginx
    echo -e "${YELLOW}Configuring Nginx...${NC}"
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
        proxy_read_timeout 90;
    }

    # Strapi Admin & API
    location ~ ^/(admin|api|content-manager|content-type-builder|upload|users-permissions|_health) {
        proxy_pass http://localhost:1337;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }

    # Static uploads
    location /uploads {
        proxy_pass http://localhost:1337/uploads;
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
}
EOF
    
    sudo ln -sf /etc/nginx/sites-available/skynet /etc/nginx/sites-enabled/
    sudo rm -f /etc/nginx/sites-enabled/default
    sudo nginx -t
    sudo systemctl restart nginx
    check_status "Nginx configured"
    
    # Start services with PM2
    echo -e "${YELLOW}Starting services with PM2...${NC}"
    pm2 stop all 2>/dev/null || true
    pm2 delete all 2>/dev/null || true
    
    cd "$DEPLOY_DIR/cms"
    pm2 start npm --name "skynet-cms" -- start
    
    cd "$DEPLOY_DIR/frontend"
    pm2 start npm --name "skynet-frontend" -- start
    
    pm2 save
    pm2 startup systemd -u $USER --hp /home/$USER | grep 'sudo' | bash || true
    check_status "PM2 services started"
    
    # Configure firewall
    echo -e "${YELLOW}Configuring firewall...${NC}"
    if command -v ufw &> /dev/null; then
        sudo ufw allow 22/tcp
        sudo ufw allow 80/tcp
        sudo ufw allow 443/tcp
        echo "y" | sudo ufw enable
        check_status "Firewall configured"
    else
        sudo iptables -I INPUT -p tcp --dport 80 -j ACCEPT
        sudo iptables -I INPUT -p tcp --dport 443 -j ACCEPT
        sudo iptables -I INPUT -p tcp --dport 22 -j ACCEPT
        if command -v netfilter-persistent &> /dev/null; then
            sudo netfilter-persistent save
        fi
        check_status "Firewall configured"
    fi
}

# =====================================================
# MAIN EXECUTION
# =====================================================

show_header

case $MODE in
    "env-only")
        setup_environment
        echo -e "\n${BLUE}Environment setup complete!${NC}"
        echo -e "Next: Run ${YELLOW}./deploy.sh deploy-only${NC} to deploy the application"
        ;;
    
    "deploy-only")
        check_architecture
        deploy_application
        
        echo -e "\n${GREEN}==========================================${NC}"
        echo -e "${GREEN}  DEPLOYMENT COMPLETED SUCCESSFULLY!${NC}"
        echo -e "${GREEN}==========================================${NC}\n"
        
        pm2 status
        
        echo -e "\n${BLUE}Access URLs:${NC}"
        echo -e "  Frontend:     ${GREEN}http://${SERVER_IP}${NC}"
        echo -e "  CMS Admin:    ${GREEN}http://${SERVER_IP}/admin${NC}"
        echo -e "  API:          ${GREEN}http://${SERVER_IP}/api${NC}"
        
        echo -e "\n${YELLOW}Next Steps:${NC}"
        echo -e "1. Create Strapi admin: ${GREEN}http://${SERVER_IP}/admin${NC}"
        echo -e "2. Generate API token in Strapi Settings"
        echo -e "3. Update STRAPI_API_TOKEN in frontend/.env.local"
        echo -e "4. Restart frontend: pm2 restart skynet-frontend"
        ;;
    
    "full"|*)
        check_architecture
        setup_environment
        
        echo -e "\n${YELLOW}Environment setup complete. Starting deployment...${NC}\n"
        sleep 2
        
        deploy_application
        
        echo -e "\n${GREEN}==========================================${NC}"
        echo -e "${GREEN}  FULL DEPLOYMENT COMPLETED!${NC}"
        echo -e "${GREEN}==========================================${NC}\n"
        
        pm2 status
        
        echo -e "\n${BLUE}Access URLs:${NC}"
        echo -e "  Frontend:     ${GREEN}http://${SERVER_IP}${NC}"
        echo -e "  CMS Admin:    ${GREEN}http://${SERVER_IP}/admin${NC}"
        echo -e "  API:          ${GREEN}http://${SERVER_IP}/api${NC}"
        
        echo -e "\n${YELLOW}Important:${NC}"
        echo -e "1. ${RED}Save credentials from credentials.txt${NC}"
        echo -e "2. Create Strapi admin: ${GREEN}http://${SERVER_IP}/admin${NC}"
        echo -e "3. Generate API token in Strapi Settings"
        echo -e "4. Update STRAPI_API_TOKEN in frontend/.env.local"
        echo -e "5. Restart frontend: pm2 restart skynet-frontend"
        
        echo -e "\n${BLUE}Useful Commands:${NC}"
        echo -e "  View logs:    pm2 logs"
        echo -e "  Monitor:      pm2 monit"
        echo -e "  Restart all:  pm2 restart all"
        ;;
esac