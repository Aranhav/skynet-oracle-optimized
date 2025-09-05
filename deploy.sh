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

check_compatibility() {
    echo -e "${YELLOW}Checking system compatibility...${NC}"
    
    # Check OS
    if ! command -v apt-get &> /dev/null; then
        echo -e "${RED}✗ This script requires apt-get (Debian/Ubuntu)${NC}"
        exit 1
    fi
    
    # Check available memory (Oracle Free Tier has 24GB)
    MEMORY_GB=$(free -g | awk '/^Mem:/{print $2}')
    if [ "$MEMORY_GB" -lt 4 ]; then
        echo -e "${YELLOW}⚠ Warning: Low memory detected (${MEMORY_GB}GB). Minimum 4GB recommended${NC}"
        echo -n "Continue anyway? (y/n): "
        read confirm
        if [ "$confirm" != "y" ]; then
            exit 1
        fi
    else
        echo -e "${GREEN}✓ Sufficient memory available (${MEMORY_GB}GB)${NC}"
    fi
    
    # Check disk space
    DISK_SPACE_GB=$(df -BG / | tail -1 | awk '{print $4}' | sed 's/G//')
    if [ "$DISK_SPACE_GB" -lt 10 ]; then
        echo -e "${YELLOW}⚠ Warning: Low disk space (${DISK_SPACE_GB}GB free). Minimum 10GB recommended${NC}"
        echo -n "Continue anyway? (y/n): "
        read confirm
        if [ "$confirm" != "y" ]; then
            exit 1
        fi
    else
        echo -e "${GREEN}✓ Sufficient disk space available (${DISK_SPACE_GB}GB)${NC}"
    fi
}

wait_for_service() {
    local service_name=$1
    local port=$2
    local max_attempts=30
    local attempt=1
    
    echo -e "${YELLOW}Waiting for $service_name to start on port $port...${NC}"
    
    while [ $attempt -le $max_attempts ]; do
        if curl -s "http://localhost:$port" >/dev/null 2>&1 || nc -z localhost $port 2>/dev/null; then
            echo -e "${GREEN}✓ $service_name is responding on port $port${NC}"
            return 0
        fi
        
        echo -n "."
        sleep 2
        attempt=$((attempt + 1))
    done
    
    echo -e "\n${RED}✗ $service_name failed to start within $((max_attempts * 2)) seconds${NC}"
    return 1
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
    # Use simple, reliable password for database
    DB_PASSWORD="skynet2024"
    
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
    
    # Check Node.js version compatibility
    if command -v node &> /dev/null; then
        NODE_VERSION=$(node -v | sed 's/v//' | cut -d. -f1)
        if [ "$NODE_VERSION" -lt 20 ]; then
            echo -e "${YELLOW}Node.js version $NODE_VERSION detected. Upgrading to Node.js 20 LTS...${NC}"
            curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
            sudo apt-get install -y nodejs
        else
            echo -e "${GREEN}✓ Node.js version $NODE_VERSION is compatible${NC}"
        fi
    else
        echo -e "${YELLOW}Installing Node.js 20 LTS...${NC}"
        curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
        sudo apt-get install -y nodejs
    fi
    
    # Verify Node.js installation
    if ! command -v node &> /dev/null; then
        echo -e "${RED}✗ Node.js installation failed${NC}"
        exit 1
    fi
    
    NODE_VERSION=$(node -v)
    NPM_VERSION=$(npm -v)
    echo -e "${GREEN}✓ Node.js ${NODE_VERSION} installed${NC}"
    echo -e "${GREEN}✓ npm ${NPM_VERSION} installed${NC}"
    
    sudo apt-get update
    sudo apt-get install -y postgresql postgresql-contrib nginx git build-essential
    
    if ! command -v pm2 &> /dev/null; then
        sudo npm install -g pm2@latest
    fi
    
    check_status "System dependencies installed"
    
    # Setup PostgreSQL
    echo -e "${YELLOW}Setting up PostgreSQL...${NC}"
    sudo systemctl start postgresql
    sudo systemctl enable postgresql
    
    # Drop and recreate to ensure clean state
    echo -e "${YELLOW}Resetting database for clean deployment...${NC}"
    sudo -u postgres psql << EOF
DROP DATABASE IF EXISTS ${DB_NAME};
DROP USER IF EXISTS ${DB_USER};
CREATE USER ${DB_USER} WITH PASSWORD '${DB_PASS}';
CREATE DATABASE ${DB_NAME} OWNER ${DB_USER};
GRANT ALL PRIVILEGES ON DATABASE ${DB_NAME} TO ${DB_USER};
ALTER USER ${DB_USER} CREATEDB;
\q
EOF
    check_status "PostgreSQL database setup"
    
    # Test database connection
    echo -e "${YELLOW}Testing database connection...${NC}"
    PGPASSWORD="${DB_PASS}" psql -h localhost -U "${DB_USER}" -d "${DB_NAME}" -c "SELECT 1;" > /dev/null 2>&1
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ Database connection successful${NC}"
    else
        echo -e "${RED}✗ Database connection failed${NC}"
        echo -e "${YELLOW}Attempting to fix...${NC}"
        # Try to fix with a simpler password
        SIMPLE_PASS="skynet2024"
        sudo -u postgres psql << EOF
ALTER USER ${DB_USER} WITH PASSWORD '${SIMPLE_PASS}';
\q
EOF
        # Update the .env file with simple password
        sed -i "s/DATABASE_PASSWORD=.*/DATABASE_PASSWORD=${SIMPLE_PASS}/" "$SCRIPT_DIR/$CMS_DIR/.env"
        DB_PASS="${SIMPLE_PASS}"
        echo -e "${GREEN}✓ Database password simplified to: ${SIMPLE_PASS}${NC}"
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
    
    # Install all dependencies (including devDependencies for building)
    echo -e "${YELLOW}Installing CMS dependencies...${NC}"
    if [ -f "package-lock.json" ]; then
        npm ci --no-audit --no-fund || {
            echo -e "${YELLOW}npm ci failed, trying npm install...${NC}"
            rm -f package-lock.json
            npm install --no-audit --no-fund || {
                echo -e "${RED}✗ CMS dependency installation failed${NC}"
                exit 1
            }
        }
    else
        npm install --no-audit --no-fund || {
            echo -e "${RED}✗ CMS dependency installation failed${NC}"
            exit 1
        }
    fi
    
    # Build CMS
    echo -e "${YELLOW}Building CMS...${NC}"
    npm run build || {
        echo -e "${RED}✗ CMS build failed${NC}"
        exit 1
    }
    
    # Optional: Prune devDependencies after build for production optimization
    echo -e "${YELLOW}Optimizing CMS for production...${NC}"
    npm prune --production --no-audit --no-fund
    
    check_status "CMS deployed"
    
    # Deploy Frontend
    echo -e "${YELLOW}Deploying Frontend...${NC}"
    cp -r "$SCRIPT_DIR/$FRONTEND_DIR" "$DEPLOY_DIR/frontend"
    cd "$DEPLOY_DIR/frontend"
    
    # Install all dependencies (including devDependencies for building)
    echo -e "${YELLOW}Installing Frontend dependencies...${NC}"
    if [ -f "package-lock.json" ]; then
        npm ci --no-audit --no-fund || {
            echo -e "${YELLOW}npm ci failed, trying npm install...${NC}"
            rm -f package-lock.json
            npm install --no-audit --no-fund || {
                echo -e "${RED}✗ Frontend dependency installation failed${NC}"
                exit 1
            }
        }
    else
        npm install --no-audit --no-fund || {
            echo -e "${RED}✗ Frontend dependency installation failed${NC}"
            exit 1
        }
    fi
    
    # Build Frontend
    echo -e "${YELLOW}Building Frontend...${NC}"
    npm run build || {
        echo -e "${RED}✗ Frontend build failed${NC}"
        echo -e "${YELLOW}Please check the build logs above for errors${NC}"
        exit 1
    }
    
    # Optional: Prune devDependencies after build for production optimization
    echo -e "${YELLOW}Optimizing Frontend for production...${NC}"
    npm prune --production --no-audit --no-fund
    
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
    
    # Create PM2 ecosystem file with restart limits
    cat > "$DEPLOY_DIR/ecosystem.config.js" << 'PMCONF'
module.exports = {
  apps: [
    {
      name: 'skynet-cms',
      cwd: '/var/www/skynet/cms',
      script: 'npm',
      args: 'start',
      max_restarts: 3,
      min_uptime: '10s',
      env: {
        NODE_ENV: 'production',
        NODE_OPTIONS: '--max-old-space-size=2048'
      }
    },
    {
      name: 'skynet-frontend',
      cwd: '/var/www/skynet/frontend',
      script: 'npm',
      args: 'start',
      max_restarts: 5,
      min_uptime: '10s',
      env: {
        NODE_ENV: 'production'
      }
    }
  ]
}
PMCONF
    
    # Start CMS with ecosystem config
    cd "$DEPLOY_DIR"
    pm2 start ecosystem.config.js --only skynet-cms || {
        echo -e "${RED}✗ Failed to start CMS with PM2${NC}"
        echo -e "${YELLOW}Checking CMS logs...${NC}"
        pm2 logs skynet-cms --lines 20
        exit 1
    }
    
    # Wait for CMS to be ready
    wait_for_service "Strapi CMS" 1337 || {
        echo -e "${RED}✗ CMS health check failed${NC}"
        echo -e "${YELLOW}CMS logs:${NC}"
        pm2 logs skynet-cms --lines 50
        exit 1
    }
    
    # Start Frontend with ecosystem config
    cd "$DEPLOY_DIR"
    pm2 start ecosystem.config.js --only skynet-frontend || {
        echo -e "${RED}✗ Failed to start Frontend with PM2${NC}"
        echo -e "${YELLOW}Checking Frontend logs...${NC}"
        pm2 logs skynet-frontend --lines 20
        exit 1
    }
    
    # Wait for Frontend to be ready
    wait_for_service "Next.js Frontend" 3000 || {
        echo -e "${RED}✗ Frontend health check failed${NC}"
        echo -e "${YELLOW}Frontend logs:${NC}"
        pm2 logs skynet-frontend --lines 50
        exit 1
    }
    
    pm2 save
    pm2 startup systemd -u $USER --hp /home/$USER | grep 'sudo' | bash || true
    check_status "PM2 services started and verified"
    
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
        check_compatibility
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
        check_compatibility
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