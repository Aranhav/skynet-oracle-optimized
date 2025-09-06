# Strapi Public API Setup Guide

## Quick Setup: Make All APIs Public (No Authentication Required)

### Step 1: Access Strapi Admin Panel
1. Go to: http://152.67.4.226/admin
2. Login with credentials:
   - Email: `admin@skynet.com`
   - Password: `SkynetAdmin@2025`

### Step 2: Configure Public Role Permissions
1. Navigate to: **Settings** (gear icon in sidebar)
2. Under **USERS & PERMISSIONS PLUGIN**, click **Roles**
3. Click on **Public** role

### Step 3: Enable API Access for Each Content Type

You need to enable the following permissions for each content type:

#### Blog Posts (blog-post)
- ✅ find (View list of blog posts)
- ✅ findOne (View single blog post)

#### Services (service)
- ✅ find
- ✅ findOne

#### Office Locations (office-location)
- ✅ find
- ✅ findOne

#### Global Settings (global-setting)
- ✅ find
- ✅ findOne

#### Testimonials (testimonial)
- ✅ find
- ✅ findOne

#### FAQs (faq)
- ✅ find
- ✅ findOne

#### Partners (partner)
- ✅ find
- ✅ findOne

### Step 4: Save Changes
1. Click **Save** button at the top right
2. Wait for "Saved" confirmation

### Step 5: Test API Access

Test that APIs are now publicly accessible:

```bash
# Test blog posts
curl http://152.67.4.226/api/blog-posts

# Test services
curl http://152.67.4.226/api/services

# Test global settings
curl http://152.67.4.226/api/global-settings
```

## Troubleshooting

### If APIs still return 403 Forbidden:
1. Check that you saved the permissions
2. Restart Strapi: `pm2 restart skynet-cms`
3. Clear browser cache

### If APIs return 404 Not Found:
1. Check Nginx is running: `sudo systemctl status nginx`
2. Check Strapi is running: `pm2 status skynet-cms`
3. Run the fix script: `sudo ./fix-strapi-api-routing.sh`

### If APIs return empty data:
1. Make sure content exists in Strapi
2. Check that content is published (not draft)
3. Create sample content in Strapi admin panel

## Creating Sample Content

### Create a Blog Post:
1. Go to **Content Manager** → **Blog Posts**
2. Click **Create new entry**
3. Fill in:
   - Title
   - Slug (URL-friendly version)
   - Content
   - Featured Image (optional)
4. Click **Save** then **Publish**

### Create Services:
1. Go to **Content Manager** → **Services**
2. Create entries for each service
3. Publish them

### Create Global Settings:
1. Go to **Content Manager** → **Global Settings**
2. Add company information
3. Upload logo/favicon
4. Save and publish

## Security Note

Making APIs public means anyone can read your content without authentication. This is fine for:
- Blog posts
- Services information
- Company details
- FAQs

But never make public:
- User data
- Admin functions
- Create/Update/Delete operations
- Sensitive business data
