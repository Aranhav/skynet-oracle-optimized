# Skynet India - Oracle Cloud Deployment

Complete deployment solution for Skynet India with Next.js frontend and Strapi CMS.

## 🚀 One-Command Deploy

```bash
./deploy-to-oracle.sh
```

This single command handles everything:
- Pushes code to GitHub
- Deploys to Oracle server
- Configures Nginx routing
- Restarts all services
- Tests API endpoints

## 📋 Post-Deployment Setup

After deployment, configure Strapi:

1. **Login to Admin Panel**
   - URL: http://152.67.4.226/admin
   - Email: `admin@skynet.com`
   - Password: `SkynetAdmin@2025`

2. **Set Public Permissions**
   - Go to Settings → Users & Permissions → Roles → Public
   - Enable 'find' and 'findOne' for all content types
   - Click Save

3. **Create Content**
   - Add blog posts
   - Create services
   - Upload logo/favicon

## 🔧 Tech Stack

- **Frontend**: Next.js 15.5.2, React 19, TailwindCSS
- **CMS**: Strapi 5.23.3
- **Database**: PostgreSQL 14
- **Server**: Oracle Cloud (24GB RAM, 4 ARM Cores)
- **Process Manager**: PM2
- **Reverse Proxy**: Nginx

## 📁 Project Structure

```
skynet-oracle-docker/
├── skynet-revamp/          # Next.js frontend
├── skynet-cms/             # Strapi CMS
└── deploy-to-oracle.sh     # Complete deployment script
```

## 🌐 Live URLs

- **Website**: http://152.67.4.226
- **Blog**: http://152.67.4.226/blog
- **Admin**: http://152.67.4.226/admin
- **API Test**: http://152.67.4.226/api/blog-posts

## ⚡ Quick Commands

```bash
# Deploy everything
./deploy-to-oracle.sh

# Check services on server
ssh ubuntu@152.67.4.226 'pm2 status'

# View logs
ssh ubuntu@152.67.4.226 'pm2 logs --lines 50'

# Restart services
ssh ubuntu@152.67.4.226 'pm2 restart all'
```

## 🔧 Troubleshooting

If blog posts don't appear:
1. Check API: `curl http://152.67.4.226/api/blog-posts`
2. If empty → Create content in Strapi
3. If 403 → Set public permissions in Strapi admin
4. If 404 → Run deployment script again

## 📝 License

© 2025 Skynet Express India Private Limited