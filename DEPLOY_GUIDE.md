# 🚀 Skynet Oracle Cloud Deployment Guide

## 📋 Prerequisites

- **Oracle Cloud Free Tier Server**
  - Ubuntu 20.04/22.04 (ARM64)
  - 24GB RAM, 4 ARM Cores
  - 200GB Storage
  - Public IP Address

- **Local Requirements**
  - Git installed
  - SSH access to server
  - Basic Linux knowledge

## 🆕 What's New (Version 2.0)

This deployment now includes major upgrades for better stability and performance:

### ✅ Updated Dependencies
- **Next.js 15.5+** - Latest stable version with React 19 support
- **React 19.1.0+** - Latest stable with new features and performance improvements
- **Strapi 5.23.2+** - Latest stable with TypeScript support and improved API
- **Node.js 20.x LTS** - Required for all latest dependencies
- **ESLint 9.x** - Updated linting with modern rules

### ✅ Improved Deployment Process
- **Fixed Build Issues** - No more `--production` flag during build phase
- **Better Error Handling** - Comprehensive error messages and logging
- **Health Checks** - Services are verified to be running before proceeding
- **Compatibility Checks** - Validates system requirements before deployment
- **Automatic Retries** - Fallback options for npm installation failures

## 🎯 Quick Start

### 1. Clone Repository
```bash
git clone https://github.com/yourusername/skynet-oracle-optimized.git
cd skynet-oracle-optimized
```

### 2. Make Script Executable
```bash
chmod +x deploy.sh
```

### 3. Run Full Deployment
```bash
./deploy.sh full
```

## 📖 Deployment Modes

The deployment script supports three modes:

### Mode 1: Full Deployment (Default)
```bash
./deploy.sh full [SERVER_IP]
```
- Sets up environment variables
- Deploys the entire application
- Configures all services

### Mode 2: Environment Setup Only
```bash
./deploy.sh env-only [SERVER_IP]
```
- Only generates environment files
- Creates security keys
- Saves credentials

### Mode 3: Deployment Only
```bash
./deploy.sh deploy-only [SERVER_IP]
```
- Requires environment files to exist
- Installs dependencies
- Deploys application

## 🔧 Step-by-Step Manual Deployment

### Step 1: Transfer Files to Server
```bash
# From your local machine
rsync -avz --exclude 'node_modules' --exclude '.git' \
  ./ ubuntu@YOUR_SERVER_IP:/home/ubuntu/skynet/
```

### Step 2: SSH to Server
```bash
ssh ubuntu@YOUR_SERVER_IP
cd /home/ubuntu/skynet
```

### Step 3: Setup Environment
```bash
./deploy.sh env-only
```
This will:
- Generate all security keys
- Create `.env` files
- Save credentials to `credentials.txt`

### Step 4: Deploy Application
```bash
./deploy.sh deploy-only
```
This will:
- Install Node.js 20.x LTS, PostgreSQL, Nginx
- Check system compatibility and requirements
- Setup database with proper credentials
- Install all dependencies (including devDependencies for building)
- Build both frontend and CMS with error handling
- Prune devDependencies after build for optimization
- Configure PM2 process manager with health checks
- Setup Nginx reverse proxy
- Verify all services are running correctly

## 🔐 Post-Deployment Setup

### 1. Create Strapi Admin Account
- Navigate to: `http://YOUR_SERVER_IP/admin`
- Create your admin account
- Save credentials securely

### 2. Generate API Token
1. Login to Strapi Admin
2. Go to Settings → API Tokens
3. Create new token with full access
4. Copy the token

### 3. Update Frontend Configuration
```bash
# Edit frontend environment file
nano /var/www/skynet/frontend/.env.local

# Add your API token:
STRAPI_API_TOKEN=your_generated_token_here

# Save and exit
```

### 4. Restart Frontend
```bash
pm2 restart skynet-frontend
```

## 📊 Environment Variables

### Frontend Variables (`skynet-revamp/.env.local`)
```env
# API Configuration
NEXT_PUBLIC_API_URL=http://SERVER_IP:1337
NEXT_PUBLIC_SITE_URL=http://SERVER_IP
NEXT_PUBLIC_STRAPI_URL=http://SERVER_IP:1337
STRAPI_API_URL=http://localhost:1337
STRAPI_API_TOKEN=                         # Add after Strapi setup

# Environment
NEXT_PUBLIC_DEMO_MODE=false
NODE_ENV=production

# Analytics
NEXT_PUBLIC_FB_PIXEL_ID=789190690162066
```

### CMS Variables (`skynet-cms/.env`)
```env
# Server
HOST=0.0.0.0
PORT=1337
NODE_ENV=production

# Security (Auto-generated)
APP_KEYS=key1,key2,key3,key4
ADMIN_JWT_SECRET=random_secret
API_TOKEN_SALT=random_salt
TRANSFER_TOKEN_SALT=random_salt
JWT_SECRET=random_secret

# Database
DATABASE_CLIENT=postgres
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=skynet_db
DATABASE_USERNAME=skynet
DATABASE_PASSWORD=auto_generated

# URLs
URL=http://SERVER_IP:1337
PUBLIC_URL=http://SERVER_IP:1337

# Upload
UPLOAD_PROVIDER=local
UPLOAD_SIZE_LIMIT=250
```

## 🛠 Service Management

### PM2 Commands
```bash
# View status
pm2 status

# View logs
pm2 logs

# Monitor resources
pm2 monit

# Restart services
pm2 restart skynet-frontend
pm2 restart skynet-cms
pm2 restart all

# Stop services
pm2 stop all

# Save PM2 configuration
pm2 save
```

### Nginx Commands
```bash
# Test configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx

# View Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

### PostgreSQL Commands
```bash
# Check status
sudo systemctl status postgresql

# Access database
sudo -u postgres psql -d skynet_db

# Backup database
pg_dump skynet_db > backup.sql

# Restore database
psql skynet_db < backup.sql
```

## 🔍 Troubleshooting

### Port Already in Use
```bash
# Find process using port
sudo lsof -i :3000
sudo lsof -i :1337

# Kill process
kill -9 <PID>
```

### Database Connection Issues
```bash
# Check PostgreSQL status
sudo systemctl status postgresql

# Restart PostgreSQL
sudo systemctl restart postgresql

# Check database exists
sudo -u postgres psql -l

# Test connection
psql -U skynet -d skynet_db -h localhost
```

### PM2 Process Issues
```bash
# Clear PM2 logs
pm2 flush

# Delete all processes
pm2 delete all

# Reinstall PM2
npm uninstall -g pm2
npm install -g pm2@latest
```

### Nginx 502 Bad Gateway
```bash
# Check if services are running
pm2 status

# Check if ports are accessible
curl http://localhost:3000
curl http://localhost:1337

# Restart everything
pm2 restart all
sudo systemctl restart nginx
```

## 📁 Directory Structure
```
/var/www/skynet/
├── frontend/              # Next.js application
│   ├── .env.local        # Frontend environment
│   ├── .next/            # Build output
│   └── node_modules/
├── cms/                  # Strapi CMS
│   ├── .env              # CMS environment
│   ├── build/            # Strapi build
│   ├── public/uploads/   # Local file storage
│   └── node_modules/
└── logs/                 # PM2 logs
```

## 🔄 Updates & Maintenance

### Update Application
```bash
# Pull latest changes
cd /home/ubuntu/skynet
git pull origin main

# Rebuild frontend (with proper dependency installation)
cd /var/www/skynet/frontend
npm ci --no-audit --no-fund  # Install all dependencies including devDependencies
npm run build                # Build the application
npm prune --production       # Remove devDependencies after build
pm2 restart skynet-frontend

# Rebuild CMS (with proper dependency installation)
cd /var/www/skynet/cms
npm ci --no-audit --no-fund  # Install all dependencies
npm run build                # Build Strapi
npm prune --production       # Remove devDependencies after build
pm2 restart skynet-cms
```

### ⚠️ Important Build Notes
- **Always install all dependencies** (including devDependencies) before building
- **Never use `--production` flag** during the build phase
- **Prune devDependencies** after building for production optimization
- **Use `npm ci`** for faster, reliable installs from package-lock.json

### Backup Data
```bash
# Backup database
pg_dump skynet_db > ~/backups/db_$(date +%Y%m%d).sql

# Backup uploads
tar -czf ~/backups/uploads_$(date +%Y%m%d).tar.gz /var/www/skynet/cms/public/uploads

# Backup environment files
cp /var/www/skynet/frontend/.env.local ~/backups/
cp /var/www/skynet/cms/.env ~/backups/
```

## 🔒 Security Recommendations

1. **Firewall Configuration**
   ```bash
   sudo ufw allow 22/tcp    # SSH
   sudo ufw allow 80/tcp    # HTTP
   sudo ufw allow 443/tcp   # HTTPS
   sudo ufw enable
   ```

2. **SSL Certificate (Optional)**
   ```bash
   # Install Certbot
   sudo apt install certbot python3-certbot-nginx
   
   # Get certificate
   sudo certbot --nginx -d yourdomain.com
   ```

3. **Regular Updates**
   ```bash
   sudo apt update && sudo apt upgrade -y
   ```

4. **Secure Environment Files**
   ```bash
   chmod 600 /var/www/skynet/frontend/.env.local
   chmod 600 /var/www/skynet/cms/.env
   ```

## 📊 Performance Optimization

### PM2 Cluster Mode
```javascript
// ecosystem.config.js
module.exports = {
  apps: [{
    name: 'skynet-frontend',
    script: 'npm',
    args: 'start',
    instances: 2,  // Use 2 CPU cores
    exec_mode: 'cluster'
  }]
}
```

### Nginx Caching
```nginx
location ~* \.(jpg|jpeg|png|gif|ico|css|js)$ {
    expires 30d;
    add_header Cache-Control "public, immutable";
}
```

## 🆘 Support

### Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| Cannot connect to database | Check PostgreSQL is running and credentials match |
| Frontend not loading | Verify STRAPI_API_TOKEN is set correctly |
| Uploads not working | Check permissions on `/var/www/skynet/cms/public/uploads` |
| High memory usage | Restart PM2 processes: `pm2 restart all` |
| Nginx 404 errors | Verify proxy_pass URLs in nginx config |

### Logs Location
- PM2 logs: `~/.pm2/logs/`
- Nginx logs: `/var/log/nginx/`
- PostgreSQL logs: `/var/log/postgresql/`

## 📝 Quick Reference

### URLs
- **Frontend**: `http://YOUR_SERVER_IP`
- **CMS Admin**: `http://YOUR_SERVER_IP/admin`
- **API**: `http://YOUR_SERVER_IP/api`

### Default Ports
- **Frontend**: 3000
- **CMS**: 1337
- **PostgreSQL**: 5432
- **Nginx**: 80

### Key Files
- Deployment script: `deploy.sh`
- Frontend env: `skynet-revamp/.env.local`
- CMS env: `skynet-cms/.env`
- Credentials: `credentials.txt` (delete after saving)

## ✅ Deployment Checklist

- [ ] Server has 24GB RAM and 4 CPU cores
- [ ] Ubuntu 20.04/22.04 installed
- [ ] SSH access configured
- [ ] Repository cloned
- [ ] Environment variables generated
- [ ] PostgreSQL database created
- [ ] Applications built successfully
- [ ] PM2 processes running
- [ ] Nginx configured
- [ ] Firewall rules set
- [ ] Strapi admin created
- [ ] API token generated
- [ ] Frontend connected to CMS
- [ ] Site accessible via browser
- [ ] Credentials saved securely
- [ ] credentials.txt deleted