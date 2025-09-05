# 📚 Oracle Cloud Free Tier Deployment Guide for Skynet Application

## 📖 Table of Contents
1. [Oracle Cloud Instance Creation](#oracle-cloud-instance-creation)
2. [Initial Server Setup](#initial-server-setup)
3. [Application Deployment Steps](#application-deployment-steps)
4. [Post-deployment Configuration](#post-deployment-configuration)
5. [Troubleshooting Oracle Cloud Issues](#troubleshooting-oracle-cloud-issues)

---

## 🚀 Oracle Cloud Instance Creation

### Prerequisites
- Oracle Cloud Free Tier account
- Credit card for verification (no charges for Free Tier)
- Basic understanding of cloud infrastructure

### Step 1: Create Compute Instance

#### 1.1 Access Oracle Cloud Console
1. Login to [Oracle Cloud Console](https://cloud.oracle.com)
2. Navigate to **Compute** → **Instances**
3. Click **Create Instance**

#### 1.2 Instance Configuration
```
Name: skynet-production
Image: Canonical Ubuntu 22.04 LTS
Architecture: ARM (Ampere A1)
Shape: VM.Standard.A1.Flex
  - OCPUs: 4 (Maximum for Free Tier)
  - Memory: 24 GB (Maximum for Free Tier)
```

**⚠️ Critical ARM Configuration Note:**
- Always select **Ampere A1** processor architecture
- ARM instances offer better price-performance ratio
- Free Tier provides up to 4 OCPUs and 24GB RAM for ARM

#### 1.3 Network Configuration
```
Virtual Cloud Network: Create new VCN
Subnet: Create new public subnet
Public IP: Assign a public IPv4 address
```

**Networking Details:**
- VCN CIDR: `10.0.0.0/16`
- Subnet CIDR: `10.0.0.0/24`
- Internet Gateway: Auto-created
- Route Table: Default with 0.0.0.0/0 → Internet Gateway

#### 1.4 SSH Key Setup
**Option 1: Generate new SSH key pair**
```bash
# On your local machine
ssh-keygen -t rsa -b 4096 -f ~/.ssh/oracle_cloud_key
```

**Option 2: Use existing SSH key**
- Upload your existing public key (`~/.ssh/id_rsa.pub`)

#### 1.5 Storage Configuration
```
Boot Volume Size: 200 GB (Maximum for Free Tier)
Volume Performance: Balanced (10 VPUs)
```

**Storage Optimization:**
- Use the full 200GB for application data and logs
- Boot volume is automatically encrypted
- Consider adding block storage later if needed

### Step 2: Security List Configuration

#### 2.1 Access Security Lists
1. Go to **Networking** → **Virtual Cloud Networks**
2. Click on your VCN → **Security Lists**
3. Click on **Default Security List**

#### 2.2 Configure Ingress Rules
Add the following ingress rules:

| Type | Port | Source CIDR | Description |
|------|------|-------------|-------------|
| SSH | 22 | 0.0.0.0/0 | SSH Access |
| HTTP | 80 | 0.0.0.0/0 | Web Traffic |
| HTTPS | 443 | 0.0.0.0/0 | Secure Web Traffic |
| Custom | 3000 | 0.0.0.0/0 | Frontend (Dev Only) |
| Custom | 1337 | 0.0.0.0/0 | CMS API (Dev Only) |

**Security Best Practices:**
- Restrict SSH access to your IP address only
- Remove development ports (3000, 1337) in production
- Use HTTPS with SSL certificates

#### 2.3 Egress Rules
Default egress rule allows all outbound traffic:
```
Destination: 0.0.0.0/0
All Protocols
```

---

## 🔧 Initial Server Setup

### Step 1: Connect to Instance

#### 1.1 SSH Connection
```bash
# Wait 2-3 minutes after instance creation
ssh -i ~/.ssh/oracle_cloud_key ubuntu@YOUR_PUBLIC_IP

# If using default key
ssh ubuntu@YOUR_PUBLIC_IP
```

#### 1.2 Initial System Update
```bash
sudo apt update && sudo apt upgrade -y
sudo reboot
```

### Step 2: Security Hardening

#### 2.1 Configure UFW Firewall
```bash
# Install and configure UFW
sudo ufw allow 22/tcp comment 'SSH'
sudo ufw allow 80/tcp comment 'HTTP'
sudo ufw allow 443/tcp comment 'HTTPS'

# Enable firewall
sudo ufw --force enable

# Check status
sudo ufw status verbose
```

#### 2.2 Fail2Ban Installation
```bash
# Install fail2ban for SSH protection
sudo apt install fail2ban -y

# Create custom configuration
sudo tee /etc/fail2ban/jail.local << EOF
[sshd]
enabled = true
port = 22
filter = sshd
logpath = /var/log/auth.log
maxretry = 3
bantime = 3600
findtime = 600
EOF

sudo systemctl enable fail2ban
sudo systemctl start fail2ban
```

#### 2.3 Disable Root Login
```bash
# Edit SSH configuration
sudo nano /etc/ssh/sshd_config

# Ensure these settings:
PermitRootLogin no
PasswordAuthentication no
PubkeyAuthentication yes

# Restart SSH
sudo systemctl restart ssh
```

### Step 3: User Management

#### 3.1 Create Application User (Optional)
```bash
# Create dedicated user for application
sudo useradd -m -s /bin/bash skynet
sudo usermod -aG sudo skynet

# Set up SSH keys for new user
sudo mkdir -p /home/skynet/.ssh
sudo cp ~/.ssh/authorized_keys /home/skynet/.ssh/
sudo chown -R skynet:skynet /home/skynet/.ssh
sudo chmod 700 /home/skynet/.ssh
sudo chmod 600 /home/skynet/.ssh/authorized_keys
```

### Step 4: System Optimization for ARM

#### 4.1 Memory and Swap Configuration
```bash
# Check current memory
free -h

# Create swap file (8GB recommended)
sudo fallocate -l 8G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile

# Make swap permanent
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab

# Optimize swappiness
echo 'vm.swappiness=10' | sudo tee -a /etc/sysctl.conf
```

#### 4.2 ARM-Specific Optimizations
```bash
# Install ARM optimized packages
sudo apt install -y build-essential python3-dev

# Set CPU governor for performance
echo 'performance' | sudo tee /sys/devices/system/cpu/cpu*/cpufreq/scaling_governor

# Make CPU governor setting permanent
sudo tee /etc/systemd/system/cpu-performance.service << EOF
[Unit]
Description=Set CPU Performance Governor
After=multi-user.target

[Service]
Type=oneshot
ExecStart=/bin/bash -c 'echo performance > /sys/devices/system/cpu/cpu*/cpufreq/scaling_governor'
RemainAfterExit=yes

[Install]
WantedBy=multi-user.target
EOF

sudo systemctl enable cpu-performance.service
```

#### 4.3 File System Optimization
```bash
# Optimize file system for SSD
sudo tune2fs -o discard /dev/sda1

# Add noatime mount option for better performance
sudo cp /etc/fstab /etc/fstab.backup
sudo sed -i 's/errors=remount-ro/errors=remount-ro,noatime/' /etc/fstab
```

---

## 🚀 Application Deployment Steps

### Step 1: Pre-deployment Checks

#### 1.1 System Requirements Verification
```bash
# Check architecture (should be aarch64)
uname -m

# Check available memory (should be ~24GB)
free -g

# Check available disk space (should be ~200GB)
df -h

# Check for required commands
which git curl wget
```

#### 1.2 Download Application
```bash
# Clone the repository
cd /home/ubuntu
git clone https://github.com/Aranhav/skynet-oracle-optimized.git skynet
cd skynet

# Make deployment script executable
chmod +x deploy.sh
```

### Step 2: Environment Preparation

#### 2.1 Generate Environment Configuration
```bash
# Run environment setup only
./deploy.sh env-only
```

This will create:
- `skynet-revamp/.env.local` - Frontend configuration
- `skynet-cms/.env` - CMS configuration  
- `credentials.txt` - Database and access credentials

#### 2.2 Review Generated Configuration
```bash
# Check generated environment files
cat skynet-revamp/.env.local
cat skynet-cms/.env

# IMPORTANT: Save credentials securely
cat credentials.txt
```

**⚠️ Security Note:** Delete `credentials.txt` after saving the information securely.

### Step 3: Database Setup

#### 3.1 PostgreSQL Installation & Configuration
```bash
# Install PostgreSQL (done automatically by deploy script)
sudo apt update
sudo apt install -y postgresql postgresql-contrib

# Start and enable PostgreSQL
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

#### 3.2 Database Creation
```bash
# Database is created automatically by deploy.sh
# Manual creation (if needed):
sudo -u postgres createdb skynet_db
sudo -u postgres createuser skynet
sudo -u postgres psql -c "ALTER USER skynet WITH PASSWORD 'your_password';"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE skynet_db TO skynet;"
```

### Step 4: Application Deployment

#### 4.1 Full Deployment
```bash
# Run complete deployment
./deploy.sh deploy-only

# Or run everything at once
./deploy.sh full
```

#### 4.2 Manual Deployment Steps (Advanced)
If you prefer manual control:

**Install Node.js 20 LTS:**
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
node --version  # Should be 20.x
```

**Install PM2:**
```bash
sudo npm install -g pm2@latest
```

**Deploy CMS:**
```bash
sudo mkdir -p /var/www/skynet
sudo chown -R $USER:$USER /var/www/skynet

# Copy CMS files
cp -r skynet-cms /var/www/skynet/cms
cd /var/www/skynet/cms

# Install dependencies and build
npm ci --no-audit --no-fund
npm run build
npm prune --production
```

**Deploy Frontend:**
```bash
# Copy frontend files
cp -r skynet-revamp /var/www/skynet/frontend
cd /var/www/skynet/frontend

# Install dependencies and build
npm ci --no-audit --no-fund
npm run build
npm prune --production
```

### Step 5: Service Configuration

#### 5.1 PM2 Process Management
```bash
# Start CMS
cd /var/www/skynet/cms
pm2 start npm --name "skynet-cms" -- start

# Start Frontend
cd /var/www/skynet/frontend  
pm2 start npm --name "skynet-frontend" -- start

# Save PM2 configuration
pm2 save
pm2 startup systemd -u $USER --hp /home/$USER
```

#### 5.2 Nginx Reverse Proxy
```bash
# Install Nginx
sudo apt install nginx -y

# Create site configuration
sudo tee /etc/nginx/sites-available/skynet << 'EOF'
server {
    listen 80;
    server_name YOUR_DOMAIN_OR_IP;
    client_max_body_size 250M;

    # Frontend
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

    # CMS Admin & API
    location ~ ^/(admin|api|content-manager|content-type-builder|upload|users-permissions|_health) {
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

    # Static uploads
    location /uploads {
        proxy_pass http://localhost:1337/uploads;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
}
EOF

# Enable site and restart Nginx
sudo ln -sf /etc/nginx/sites-available/skynet /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl restart nginx
```

---

## ⚙️ Post-deployment Configuration

### Step 1: SSL Setup with Let's Encrypt

#### 1.1 Install Certbot
```bash
sudo apt install certbot python3-certbot-nginx -y
```

#### 1.2 Obtain SSL Certificate
```bash
# Replace with your actual domain
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# For IP-only setup (testing)
# Note: Let's Encrypt doesn't issue certificates for IP addresses
```

#### 1.3 Auto-renewal Setup
```bash
# Test renewal
sudo certbot renew --dry-run

# Certbot auto-renewal is set up automatically
sudo systemctl status snap.certbot.renew.timer
```

### Step 2: Monitoring Setup

#### 2.1 PM2 Monitoring
```bash
# Install PM2 monitoring dashboard
pm2 install pm2-server-monit

# View real-time monitoring
pm2 monit

# Check process status
pm2 status

# View logs
pm2 logs
pm2 logs skynet-frontend --lines 100
pm2 logs skynet-cms --lines 100
```

#### 2.2 System Monitoring with htop
```bash
# Install htop for system monitoring
sudo apt install htop -y

# Run htop
htop
```

#### 2.3 Nginx Access Logs
```bash
# Monitor access logs
sudo tail -f /var/log/nginx/access.log

# Monitor error logs
sudo tail -f /var/log/nginx/error.log
```

#### 2.4 PostgreSQL Monitoring
```bash
# Check database connections
sudo -u postgres psql -c "SELECT datname,usename,client_addr,state FROM pg_stat_activity;"

# Check database size
sudo -u postgres psql -c "SELECT pg_database_size('skynet_db');"
```

### Step 3: Backup Strategy

#### 3.1 Database Backup
```bash
# Create backup directory
mkdir -p ~/backups

# Daily database backup script
sudo tee /usr/local/bin/backup-database.sh << 'EOF'
#!/bin/bash
BACKUP_DIR="/home/ubuntu/backups"
DATE=$(date +%Y%m%d_%H%M%S)
DB_NAME="skynet_db"

# Create database backup
pg_dump -U skynet -h localhost $DB_NAME > $BACKUP_DIR/db_backup_$DATE.sql

# Keep only last 7 days of backups
find $BACKUP_DIR -name "db_backup_*.sql" -mtime +7 -delete

echo "Database backup completed: db_backup_$DATE.sql"
EOF

sudo chmod +x /usr/local/bin/backup-database.sh
```

#### 3.2 File Uploads Backup
```bash
# Upload files backup script
sudo tee /usr/local/bin/backup-uploads.sh << 'EOF'
#!/bin/bash
BACKUP_DIR="/home/ubuntu/backups"
DATE=$(date +%Y%m%d_%H%M%S)
UPLOAD_DIR="/var/www/skynet/cms/public/uploads"

# Create uploads backup
if [ -d "$UPLOAD_DIR" ]; then
    tar -czf $BACKUP_DIR/uploads_backup_$DATE.tar.gz -C /var/www/skynet/cms/public uploads
    echo "Uploads backup completed: uploads_backup_$DATE.tar.gz"
else
    echo "Upload directory not found: $UPLOAD_DIR"
fi

# Keep only last 7 days of backups
find $BACKUP_DIR -name "uploads_backup_*.tar.gz" -mtime +7 -delete
EOF

sudo chmod +x /usr/local/bin/backup-uploads.sh
```

#### 3.3 Automated Backup with Cron
```bash
# Add cron jobs for automatic backups
crontab -e

# Add these lines:
# Database backup every day at 2 AM
0 2 * * * /usr/local/bin/backup-database.sh >> /home/ubuntu/backups/backup.log 2>&1

# Uploads backup every day at 2:30 AM  
30 2 * * * /usr/local/bin/backup-uploads.sh >> /home/ubuntu/backups/backup.log 2>&1

# Weekly system update (Sunday 3 AM)
0 3 * * 0 sudo apt update && sudo apt upgrade -y >> /home/ubuntu/backups/update.log 2>&1
```

### Step 4: Performance Optimization

#### 4.1 PM2 Cluster Configuration
```bash
# Create PM2 ecosystem file for clustering
tee /var/www/skynet/ecosystem.config.js << 'EOF'
module.exports = {
  apps: [
    {
      name: 'skynet-frontend',
      cwd: '/var/www/skynet/frontend',
      script: 'npm',
      args: 'start',
      instances: 2, // Use 2 CPU cores
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      max_memory_restart: '2G',
      node_args: '--max-old-space-size=2048'
    },
    {
      name: 'skynet-cms',
      cwd: '/var/www/skynet/cms',
      script: 'npm',
      args: 'start',
      instances: 1, // Strapi doesn't support clustering
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
        PORT: 1337
      },
      max_memory_restart: '3G',
      node_args: '--max-old-space-size=3072'
    }
  ]
};
EOF

# Apply ecosystem configuration
cd /var/www/skynet
pm2 stop all
pm2 delete all
pm2 start ecosystem.config.js
pm2 save
```

#### 4.2 Nginx Performance Tuning
```bash
# Optimize Nginx configuration
sudo tee -a /etc/nginx/nginx.conf << 'EOF'

# Performance optimizations
worker_processes auto;
worker_rlimit_nofile 65535;

events {
    worker_connections 4096;
    use epoll;
    multi_accept on;
}

http {
    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1000;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
    
    # File caching
    open_file_cache max=200000 inactive=20s;
    open_file_cache_valid 30s;
    open_file_cache_min_uses 2;
    open_file_cache_errors on;
    
    # Connection optimization  
    keepalive_timeout 30;
    keepalive_requests 100000;
    reset_timedout_connection on;
    client_body_timeout 10;
    send_timeout 2;
    
    # Buffer optimization
    client_max_body_size 250m;
    client_body_buffer_size 128k;
    large_client_header_buffers 4 256k;
}
EOF

# Test and restart Nginx
sudo nginx -t
sudo systemctl restart nginx
```

#### 4.3 PostgreSQL Performance Tuning
```bash
# Optimize PostgreSQL for ARM and available RAM
sudo tee -a /etc/postgresql/14/main/postgresql.conf << 'EOF'

# ARM/Oracle Cloud optimizations for 24GB RAM
shared_buffers = 6GB                    # 25% of RAM
effective_cache_size = 18GB             # 75% of RAM  
work_mem = 64MB                         # For complex queries
maintenance_work_mem = 2GB              # For maintenance operations
checkpoint_completion_target = 0.9      # Spread out checkpoints
wal_buffers = 64MB                      # WAL buffer size
random_page_cost = 1.1                  # SSD optimization
effective_io_concurrency = 200          # SSD concurrency

# Connection settings
max_connections = 200                    # Reasonable limit
EOF

# Restart PostgreSQL
sudo systemctl restart postgresql
```

---

## 🔧 Troubleshooting Oracle Cloud Issues

### Common Oracle Cloud Problems

#### 1. Instance Won't Start
**Problem:** Instance stuck in "Provisioning" or "Starting" state

**Solutions:**
```bash
# Check instance limits
# Oracle Free Tier limits: 2 VMs, 4 OCPUs total, 24GB RAM total

# Verify in Oracle Console:
# 1. Compute > Instances > Check resource usage
# 2. Governance > Limits and Quotas

# Try different availability domain
# 1. Terminate problematic instance
# 2. Create new instance in different AD
# 3. Some ADs may be at capacity
```

#### 2. SSH Connection Refused
**Problem:** Cannot connect via SSH

**Solutions:**
```bash
# Check security list rules
# Ensure port 22 is open for 0.0.0.0/0 or your IP

# Verify SSH key
ssh -i ~/.ssh/your-key -v ubuntu@YOUR_IP

# Check instance public IP
# Instance may have different IP than expected

# Oracle Cloud Shell alternative
# Use Cloud Shell from Oracle Console if SSH fails
```

#### 3. Network Connectivity Issues
**Problem:** Services not accessible from internet

**Solutions:**
```bash
# Check Security Lists (Instance Level)
# Networking > Virtual Cloud Networks > Your VCN > Security Lists

# Check Network Security Groups (if used)
# More specific than Security Lists

# Check Ubuntu firewall
sudo ufw status
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Check if services are running
sudo netstat -tlnp | grep :80
sudo netstat -tlnp | grep :443
```

#### 4. Instance Terminated Unexpectedly
**Problem:** Instance stops or gets terminated

**Solutions:**
```bash
# Check for resource violations
# Oracle may terminate instances that exceed free tier limits

# Verify in Oracle Console:
# 1. Audit logs for termination reasons
# 2. Check for policy violations

# Monitor resource usage:
htop
free -h
df -h

# Set up monitoring alerts
# Oracle Console > Monitoring > Alarms
```

#### 5. Storage Issues
**Problem:** Running out of disk space or performance issues

**Solutions:**
```bash
# Check disk usage
df -h
du -sh /var/* | sort -hr

# Clean up unnecessary files
sudo apt autoremove -y
sudo apt autoclean
docker system prune -af  # if using Docker

# Expand boot volume (if needed)
# Oracle Console > Compute > Block Storage > Boot Volumes
# Can expand up to 200GB for free tier
```

#### 6. ARM Architecture Compatibility
**Problem:** Software not working on ARM

**Solutions:**
```bash
# Check architecture
uname -m  # Should show aarch64

# Use ARM-compatible versions
# Node.js: Use official ARM64 binaries
# Docker: Use ARM64 base images
# Native packages: Most Ubuntu packages support ARM64

# For x86-only software
# Consider using emulation (performance impact)
# Or find ARM alternatives
```

### Monitoring and Diagnostics

#### System Health Check Script
```bash
# Create comprehensive health check
sudo tee /usr/local/bin/health-check.sh << 'EOF'
#!/bin/bash

echo "=== ORACLE CLOUD HEALTH CHECK ==="
echo "Date: $(date)"
echo

echo "=== SYSTEM INFO ==="
echo "Architecture: $(uname -m)"
echo "OS: $(cat /etc/os-release | grep PRETTY_NAME)"
echo "Uptime: $(uptime -p)"
echo

echo "=== RESOURCES ==="
echo "Memory Usage:"
free -h
echo
echo "Disk Usage:"
df -h /
echo
echo "CPU Usage:"
top -bn1 | grep "Cpu(s)"
echo

echo "=== SERVICES ==="
echo "PM2 Status:"
pm2 status --no-color
echo
echo "Nginx Status:"
sudo systemctl is-active nginx
echo
echo "PostgreSQL Status:"
sudo systemctl is-active postgresql
echo

echo "=== NETWORK ==="
echo "Public IP: $(curl -s ifconfig.me)"
echo "Listening Ports:"
sudo netstat -tlnp | grep -E ":80|:443|:22|:3000|:1337"
echo

echo "=== FIREWALL ==="
sudo ufw status numbered
EOF

sudo chmod +x /usr/local/bin/health-check.sh

# Run health check
/usr/local/bin/health-check.sh
```

#### Performance Monitoring
```bash
# Install monitoring tools
sudo apt install -y htop iotop nethogs

# Monitor CPU usage
htop

# Monitor I/O usage
sudo iotop

# Monitor network usage
sudo nethogs

# Check system logs
sudo journalctl -f
sudo journalctl -u nginx -f
sudo journalctl -u postgresql -f
```

### Oracle Cloud Support Resources

#### 1. Documentation
- [Oracle Cloud Infrastructure Documentation](https://docs.oracle.com/en-us/iaas/)
- [Always Free Resources](https://docs.oracle.com/en-us/iaas/Content/FreeTier/freetier.htm)
- [Compute Service Guide](https://docs.oracle.com/en-us/iaas/Content/Compute/Concepts/computeoverview.htm)

#### 2. Community Support
- Oracle Cloud Community Forums
- Oracle Cloud Reddit Community
- Stack Overflow (oracle-cloud tag)

#### 3. Monitoring and Alerts
```bash
# Set up Oracle Cloud monitoring
# 1. Go to Oracle Console > Observability & Management > Monitoring
# 2. Create custom metrics for:
#    - CPU utilization
#    - Memory usage
#    - Disk usage
#    - Network traffic
# 3. Set up alarm rules for thresholds
# 4. Configure notifications (email/SMS)
```

---

## 📝 Deployment Checklist

### Pre-deployment
- [ ] Oracle Cloud account created and verified
- [ ] Free Tier limits understood (4 OCPUs, 24GB RAM, 200GB storage)
- [ ] SSH key pair generated
- [ ] Domain name configured (optional)

### Instance Creation
- [ ] ARM-based Compute Instance created (VM.Standard.A1.Flex)
- [ ] 4 OCPUs and 24GB RAM allocated
- [ ] Ubuntu 22.04 LTS selected
- [ ] 200GB boot volume configured
- [ ] Security Lists configured (ports 22, 80, 443)
- [ ] Public IP assigned

### Security Setup
- [ ] SSH access tested
- [ ] UFW firewall configured
- [ ] Fail2Ban installed
- [ ] Root login disabled
- [ ] System updated and rebooted

### Application Deployment  
- [ ] Repository cloned
- [ ] Environment variables configured
- [ ] PostgreSQL database created
- [ ] Node.js 20 LTS installed
- [ ] PM2 installed globally
- [ ] CMS built and deployed
- [ ] Frontend built and deployed
- [ ] Nginx configured and tested

### Post-deployment
- [ ] SSL certificate installed (if using domain)
- [ ] Strapi admin account created
- [ ] API token generated and configured
- [ ] PM2 processes running and saved
- [ ] Monitoring tools installed
- [ ] Backup scripts configured
- [ ] Performance optimizations applied

### Testing
- [ ] Frontend accessible at public IP
- [ ] CMS admin accessible at `/admin`
- [ ] API endpoints responding
- [ ] File uploads working
- [ ] SSL certificate valid (if configured)
- [ ] Performance acceptable under load

---

## 🎯 Summary

This guide provides comprehensive instructions for deploying the Skynet application on Oracle Cloud Free Tier. Key highlights:

- **Free Tier Optimization**: Maximizes use of 4 OCPUs, 24GB RAM, and 200GB storage
- **ARM Architecture**: Optimized for Ampere A1 processors
- **Security Hardening**: Implements firewall, fail2ban, and secure SSH
- **Performance Tuning**: PM2 clustering, Nginx optimization, PostgreSQL tuning
- **Monitoring**: Health checks, backup automation, and performance monitoring
- **Troubleshooting**: Common Oracle Cloud issues and solutions

The deployment script automates most processes, but this guide provides the manual steps for better understanding and customization.

For support, refer to the application's documentation or Oracle Cloud support resources.