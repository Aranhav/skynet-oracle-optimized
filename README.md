# Skynet Oracle Cloud Deployment

Optimized deployment for Oracle Cloud Free Tier (24GB RAM, 4 ARM Cores, 200GB Storage).

## 🚀 Quick Start

```bash
# Clone repository
git clone https://github.com/yourusername/skynet-oracle-optimized.git
cd skynet-oracle-optimized

# Run deployment
chmod +x deploy.sh
./deploy.sh full
```

## 📋 Features

- **Native ARM Deployment** - Optimized for Oracle's ARM architecture
- **Local Storage** - No external dependencies (Cloudinary removed)
- **Production Ready** - PM2 clustering, Nginx proxy, PostgreSQL
- **Resource Efficient** - Uses only 3-4GB RAM of 24GB available
- **Single Script** - One command deployment with `deploy.sh`

## 🔧 Deployment Modes

```bash
# Full deployment (environment + application)
./deploy.sh full

# Environment setup only
./deploy.sh env-only

# Application deployment only (requires env files)
./deploy.sh deploy-only
```

## 📁 Project Structure

```
skynet-oracle-optimized/
├── skynet-revamp/       # Next.js frontend
├── skynet-cms/          # Strapi CMS
├── deploy.sh            # All-in-one deployment script
├── DEPLOY_GUIDE.md      # Comprehensive deployment guide
└── README.md            # This file
```

## 📊 Resource Usage

| Resource | Usage | Available |
|----------|-------|-----------|
| **RAM** | 3-4GB | 24GB |
| **CPU** | 2 cores | 4 cores |
| **Storage** | ~150MB + uploads | 200GB |

## 🔗 Access URLs

After deployment:
- **Frontend**: `http://YOUR_SERVER_IP`
- **CMS Admin**: `http://YOUR_SERVER_IP/admin`
- **API**: `http://YOUR_SERVER_IP/api`

## 📖 Documentation

See [DEPLOY_GUIDE.md](./DEPLOY_GUIDE.md) for:
- Detailed installation steps
- Environment configuration
- Troubleshooting guide
- Security recommendations
- Maintenance procedures

## ⚡ Quick Commands

```bash
# View status
pm2 status

# View logs
pm2 logs

# Restart services
pm2 restart all

# Monitor resources
pm2 monit
```

## 🆘 Support

For detailed troubleshooting and configuration options, refer to the [Deployment Guide](./DEPLOY_GUIDE.md).