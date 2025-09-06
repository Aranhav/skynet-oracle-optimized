# Complete Deployment Fix Guide

## Issues Fixed
1. ✅ **Strapi API 404 errors** - Fixed Nginx routing
2. ✅ **400 Bad Request errors** - Simplified query parameters 
3. ✅ **Blog posts not visible** - Fixed API calls and permissions

## Deploy to Oracle Server

### Step 1: SSH to Server
```bash
ssh ubuntu@152.67.4.226
```

### Step 2: Pull Latest Code
```bash
cd ~/skynet-oracle-optimized
git pull
```

### Step 3: Update Frontend
```bash
# Copy updated frontend files
sudo cp -r skynet-revamp/* /var/www/skynet/frontend/

# Navigate to frontend directory
cd /var/www/skynet/frontend

# Install dependencies if needed
npm install

# Build frontend with fixes
npm run build

# Restart frontend
pm2 restart skynet-frontend
```

### Step 4: Fix Nginx Configuration (if not already done)
```bash
# Run the fix script
chmod +x ~/skynet-oracle-optimized/fix-strapi-api-routing.sh
sudo ~/skynet-oracle-optimized/fix-strapi-api-routing.sh
```

### Step 5: Set Strapi Public Permissions (CRITICAL!)

1. **Login to Strapi Admin**
   - URL: http://152.67.4.226/admin
   - Email: `admin@skynet.com`
   - Password: `SkynetAdmin@2025`

2. **Configure Public Permissions**
   - Go to: **Settings** (gear icon in sidebar)
   - Click: **Users & Permissions Plugin** → **Roles**
   - Click: **Public** role
   
3. **Enable API Access for Each Content Type**
   
   For each of these, check ✅ **find** and ✅ **findOne**:
   
   - **Blog-post**
     - ✅ find
     - ✅ findOne
   
   - **Service**
     - ✅ find
     - ✅ findOne
   
   - **Office-location**
     - ✅ find
     - ✅ findOne
   
   - **Global-setting**
     - ✅ find
     - ✅ findOne
   
   - **Faq**
     - ✅ find
     - ✅ findOne
   
   - **Partner**
     - ✅ find
     - ✅ findOne
   
   - **Testimonial**
     - ✅ find
     - ✅ findOne

4. **Save Changes**
   - Click the **Save** button (top right)
   - Wait for "Saved" confirmation

### Step 6: Create Content in Strapi

1. **Create a Blog Post**
   - Go to: **Content Manager** → **Blog Posts**
   - Click: **+ Create new entry**
   - Fill in:
     - **Title**: "Welcome to Skynet India Blog"
     - **Slug**: "welcome-to-skynet-india-blog"
     - **Content**: Your blog content
     - **Excerpt**: Brief description
     - **Featured Image**: Upload an image (optional)
   - Click **Save**
   - Click **Publish**

2. **Create Services**
   - Go to: **Content Manager** → **Services**
   - Create entries for:
     - Air Freight
     - Road Transport
     - E-commerce Solutions
     - International Mail
   - Publish each service

3. **Create Global Settings**
   - Go to: **Content Manager** → **Global Settings**
   - Fill in company details
   - Save and Publish

### Step 7: Test Everything

```bash
# Test Strapi API endpoints
echo "Testing blog posts API:"
curl http://152.67.4.226/api/blog-posts | python3 -m json.tool | head -50

echo "Testing services API:"
curl http://152.67.4.226/api/services | python3 -m json.tool | head -50

# Check PM2 status
pm2 status

# Check logs if needed
pm2 logs skynet-cms --lines 20
pm2 logs skynet-frontend --lines 20
```

### Step 8: Verify in Browser

1. **Check Blog Page**: http://152.67.4.226/blog
   - Should show blog posts you created
   
2. **Check Services**: http://152.67.4.226/services
   - Should show services

3. **Check Tracking**: http://152.67.4.226/track
   - Should work with test tracking numbers

## Troubleshooting

### If APIs return empty data `{"data":[]}`
- Content doesn't exist in Strapi
- Content is not published (still draft)
- Create and publish content in Strapi admin

### If APIs return 403 Forbidden
- Public permissions not set correctly
- Go back to Step 5 and ensure all permissions are checked

### If APIs return 404 Not Found
- Nginx not routing correctly
- Run: `sudo ~/skynet-oracle-optimized/fix-strapi-api-routing.sh`

### If APIs return 400 Bad Request
- Already fixed in code, pull latest changes
- Rebuild frontend: `npm run build && pm2 restart skynet-frontend`

### If Strapi Admin shows 502 Bad Gateway
```bash
# Restart Strapi
pm2 restart skynet-cms

# Check logs
pm2 logs skynet-cms --lines 50
```

## Quick Commands

```bash
# View all logs
pm2 logs

# Restart everything
pm2 restart all

# Check status
pm2 status

# Test API
curl http://152.67.4.226/api/blog-posts

# Check database
PGPASSWORD=skynet2024 psql -U skynet -d skynet_cms -c '\dt'
```

## Important Notes

1. **Facebook Pixel Error** in console is just ad blocker - ignore it
2. **Always set public permissions** after Strapi restart
3. **Create content** - APIs return empty without content
4. **Publish content** - Draft content won't show in API

## Success Checklist

- [ ] Code pulled from GitHub
- [ ] Frontend rebuilt
- [ ] Services restarted
- [ ] Public permissions set
- [ ] Content created and published
- [ ] Blog page shows posts
- [ ] Services page shows services
- [ ] No 400/404 errors in console