# 🚀 QUICK DEPLOYMENT GUIDE

## Automated Deployment (Recommended)

### Option 1: Full Automated Deploy
```bash
# Run from your local machine
./deploy-to-oracle.sh
```
This will:
- Push code to GitHub
- Deploy to Oracle server
- Fix all configurations
- Restart services

### Option 2: Manual Deploy + Auto Permissions

1. **Deploy to server:**
```bash
ssh ubuntu@152.67.4.226
cd ~/skynet-oracle-optimized
git pull
sudo cp -r skynet-revamp/* /var/www/skynet/frontend/
cd /var/www/skynet/frontend
npm install && npm run build
pm2 restart skynet-frontend
```

2. **Auto-configure permissions:**
```bash
# From local machine
./set-strapi-permissions.sh
```

3. **Test deployment:**
```bash
# From local machine
./test-deployment.sh
```

## Manual Steps Required

### 1. Create Content in Strapi
- URL: http://152.67.4.226/admin
- Email: `admin@skynet.com`
- Password: `SkynetAdmin@2025`

### 2. Create Blog Posts
1. Go to Content Manager → Blog Posts
2. Click "+ Create new entry"
3. Fill in:
   - Title
   - Slug
   - Content
   - Excerpt
4. Click Save → Publish

### 3. Test Everything
```bash
# Quick test
curl http://152.67.4.226/api/blog-posts | jq

# Full test
./test-deployment.sh
```

## ✅ Success Checklist

- [ ] Code deployed to server
- [ ] Frontend rebuilt
- [ ] Services running (pm2 status)
- [ ] Permissions configured
- [ ] Content created and published
- [ ] Blog page shows posts: http://152.67.4.226/blog
- [ ] All tests pass

## 🔧 Troubleshooting

### If blog posts don't appear:
```bash
# Check API response
curl http://152.67.4.226/api/blog-posts

# If empty, create content in Strapi
# If 403, run permissions script
./set-strapi-permissions.sh
```

### If services are down:
```bash
ssh ubuntu@152.67.4.226 'pm2 restart all'
```

### Check logs:
```bash
ssh ubuntu@152.67.4.226 'pm2 logs --lines 100'
```

## 📝 Important URLs

- **Website**: http://152.67.4.226
- **Blog**: http://152.67.4.226/blog
- **Strapi Admin**: http://152.67.4.226/admin
- **API Test**: http://152.67.4.226/api/blog-posts

## 🎯 Next Steps

1. Run `./deploy-to-oracle.sh` to deploy everything
2. Create content in Strapi
3. Verify with `./test-deployment.sh`

---
**Everything is automated!** Just run the scripts and follow the prompts. 🚀