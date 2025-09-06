# 🚀 ORACLE SERVER DEPLOYMENT COMMANDS

## Step 1: Connect to Server
```bash
ssh ubuntu@152.67.4.226
```

## Step 2: Pull Latest Code with All Fixes
```bash
cd ~/skynet-oracle-optimized
git pull origin main
```

## Step 3: Update Frontend Files
```bash
# Copy all frontend files with fixes
sudo cp -r skynet-revamp/* /var/www/skynet/frontend/

# Navigate to frontend directory
cd /var/www/skynet/frontend

# Install dependencies (in case any new ones were added)
npm install

# Build frontend with all fixes
npm run build

# Restart frontend service
pm2 restart skynet-frontend
```

## Step 4: Fix Nginx Configuration for API Routing
```bash
# Create and run the Nginx fix
cat > /tmp/fix-nginx.sh << 'EOF'
#!/bin/bash

# Backup current config
sudo cp /etc/nginx/sites-available/skynet /etc/nginx/sites-available/skynet.backup.$(date +%s)

# Update Nginx configuration
sudo tee /etc/nginx/sites-available/skynet > /dev/null << 'NGINX'
server {
    listen 80;
    listen [::]:80;
    server_name 152.67.4.226;
    client_max_body_size 100M;

    # CRITICAL: Route Next.js specific APIs to port 3000
    location ~ ^/api/(track|health|mock) {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # CRITICAL: Route all other /api/* to Strapi on port 1337
    location /api/ {
        rewrite ^/api/(.*)$ /api/$1 break;
        proxy_pass http://localhost:1337;
        proxy_http_version 1.1;
        proxy_set_header X-Forwarded-Host $host;
        proxy_set_header X-Forwarded-Server $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header Host $http_host;
        proxy_set_header Connection "";
        proxy_pass_request_headers on;
    }

    # Strapi Admin Panel
    location /admin {
        proxy_pass http://localhost:1337/admin;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Strapi uploads and assets
    location /uploads {
        proxy_pass http://localhost:1337/uploads;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Strapi health check
    location /_health {
        proxy_pass http://localhost:1337/_health;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
    }

    # Socket.io for Strapi
    location /socket.io/ {
        proxy_pass http://localhost:1337;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Main Next.js app (everything else)
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
    }
}
NGINX

# Test and reload Nginx
sudo nginx -t && sudo systemctl reload nginx
echo "✓ Nginx configuration updated successfully"
EOF

# Run the fix
bash /tmp/fix-nginx.sh
```

## Step 5: Restart All Services
```bash
# Restart both services
pm2 restart skynet-cms
pm2 restart skynet-frontend

# Check status
pm2 status

# Save PM2 configuration
pm2 save
```

## Step 6: Test API Endpoints
```bash
# Test Strapi API endpoints
echo "Testing Blog Posts API:"
curl -s http://localhost:1337/api/blog-posts | head -50

echo -e "\nTesting via Nginx proxy:"
curl -s http://152.67.4.226/api/blog-posts | head -50

echo -e "\nTesting Services API:"
curl -s http://152.67.4.226/api/services | head -50

echo -e "\nTesting Office Locations API:"
curl -s http://152.67.4.226/api/office-locations | head -50
```

## Step 7: Set Strapi Public Permissions (CRITICAL!)

### Option A: Via Strapi Admin UI
1. Open browser: http://152.67.4.226/admin
2. Login:
   - Email: `admin@skynet.com`
   - Password: `SkynetAdmin@2025`
3. Go to: Settings → Users & Permissions Plugin → Roles → Public
4. Enable `find` and `findOne` for ALL content types:
   - Blog-post
   - Service
   - Office-location
   - Global-setting
   - Faq
   - Partner
   - Testimonial
5. Click Save

### Option B: Via Database (if UI doesn't work)
```bash
# Connect to PostgreSQL
PGPASSWORD=skynet2024 psql -U skynet -d skynet_cms

-- Check current permissions
SELECT * FROM up_permissions WHERE role = 1;

-- Exit PostgreSQL
\q
```

## Step 8: Create Sample Content
```bash
# Create a test blog post via API (optional)
curl -X POST http://localhost:1337/api/blog-posts \
  -H "Content-Type: application/json" \
  -d '{
    "data": {
      "title": "Welcome to Skynet India",
      "slug": "welcome-to-skynet-india",
      "content": "This is our first blog post.",
      "excerpt": "Welcome to our new website",
      "publishedAt": "'$(date -u +"%Y-%m-%dT%H:%M:%S.%3NZ")'"
    }
  }'
```

## Step 9: Verify Everything Works
```bash
# Check all services are running
pm2 list

# Check Nginx is working
sudo nginx -t
sudo systemctl status nginx

# Test the blog page loads
curl -I http://152.67.4.226/blog

# Check API returns data
curl http://152.67.4.226/api/blog-posts | python3 -m json.tool | head -30

# Check logs if there are issues
pm2 logs skynet-cms --lines 50
pm2 logs skynet-frontend --lines 50
```

## Step 10: Monitor Logs (if needed)
```bash
# Watch real-time logs
pm2 logs

# Or specific service
pm2 logs skynet-cms --lines 100
pm2 logs skynet-frontend --lines 100
```

---

## 🚨 QUICK FIX COMMANDS (if things break)

### If APIs return 404:
```bash
# Fix Nginx routing
sudo bash ~/skynet-oracle-optimized/fix-strapi-api-routing.sh
sudo systemctl reload nginx
```

### If APIs return 403:
```bash
# Permissions issue - login to Strapi admin and set public permissions
echo "Go to: http://152.67.4.226/admin"
echo "Settings → Users & Permissions → Roles → Public"
echo "Enable find and findOne for all content types"
```

### If frontend shows errors:
```bash
cd /var/www/skynet/frontend
npm run build
pm2 restart skynet-frontend
```

### If Strapi won't start:
```bash
cd /var/www/skynet/cms
npm rebuild
pm2 restart skynet-cms
pm2 logs skynet-cms --lines 100
```

### Complete restart:
```bash
pm2 restart all
sudo systemctl reload nginx
```

---

## ✅ SUCCESS CHECKLIST
After running all commands, verify:

- [ ] `pm2 status` shows both apps online
- [ ] http://152.67.4.226 loads homepage
- [ ] http://152.67.4.226/admin loads Strapi admin
- [ ] http://152.67.4.226/api/blog-posts returns JSON (not 404)
- [ ] http://152.67.4.226/blog loads without errors
- [ ] No 400 or 404 errors in browser console

---

## 📝 ADMIN CREDENTIALS
**Strapi Admin Panel:** http://152.67.4.226/admin
- Email: `admin@skynet.com`
- Password: `SkynetAdmin@2025`

**PostgreSQL Database:**
- Database: `skynet_cms`
- User: `skynet`
- Password: `skynet2024`