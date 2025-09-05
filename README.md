# Skynet Oracle Optimized Deployment

Optimized version of Skynet India website for Oracle Cloud Free Tier deployment (24GB RAM, 4 ARM cores, 200GB storage).

## 🚀 Features

- **Optimized for ARM**: Configured specifically for Oracle's ARM architecture
- **Local Storage**: Uses Oracle's 200GB storage instead of Cloudinary
- **High Performance**: Utilizes 24GB RAM effectively
- **PM2 Clustering**: Multi-core support for better performance
- **Zero Cost**: Runs entirely on Oracle's free tier

## 📁 Project Structure

```
skynet-oracle-optimized/
├── skynet-revamp/       # Next.js frontend
├── skynet-cms/          # Strapi CMS
├── oracle-deploy.sh     # One-click deployment script
├── ecosystem.config.js  # PM2 configuration
├── .env.example        # Environment template
└── README.md           # This file
```

## 🛠️ Quick Deployment

### Prerequisites

- Oracle Cloud Free Tier Ubuntu instance (ARM)
- SSH access to your Oracle server
- Domain name (optional)

### Step 1: Clone Repository

```bash
git clone https://github.com/yourusername/skynet-oracle-optimized.git
cd skynet-oracle-optimized
```

### Step 2: Copy to Oracle Server

```bash
scp -r * ubuntu@your-oracle-ip:~/
```

### Step 3: SSH and Deploy

```bash
ssh ubuntu@your-oracle-ip
chmod +x oracle-deploy.sh
./oracle-deploy.sh
```

## 🔧 Manual Setup

### 1. Install Dependencies

```bash
sudo apt update
sudo apt install -y nodejs npm postgresql nginx
npm install -g pm2
```

### 2. Setup Database

```bash
sudo -u postgres createdb skynet_db
sudo -u postgres createuser skynet -P
```

### 3. Configure Environment

Copy `.env.example` to appropriate locations and update values.

### 4. Build Applications

```bash
# CMS
cd skynet-cms
npm install
npm run build

# Frontend
cd ../skynet-revamp
npm install
npm run build
```

### 5. Start with PM2

```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

## 📊 Resource Usage

- **RAM**: ~3GB (21GB free for scaling)
- **CPU**: 2 cores for frontend, 1 for CMS, 1 spare
- **Storage**: ~2GB for app, 198GB available for uploads

## 🌐 Access Points

- Frontend: `http://your-server-ip`
- CMS Admin: `http://your-server-ip/admin`
- API: `http://your-server-ip/api`

## 🔒 Security

1. Configure firewall:
```bash
sudo iptables -I INPUT -p tcp --dport 80 -j ACCEPT
sudo iptables -I INPUT -p tcp --dport 443 -j ACCEPT
```

2. Setup SSL (optional):
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

## 📈 Monitoring

```bash
# View processes
pm2 status

# View logs
pm2 logs

# Monitor resources
pm2 monit
```

## 🔄 Updates

```bash
git pull
npm install
npm run build
pm2 reload all
```

## 📝 License

MIT

## 🤝 Support

For issues, please open a GitHub issue or contact support.