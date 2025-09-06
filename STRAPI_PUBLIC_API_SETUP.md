# Strapi Public API Configuration Guide

## Overview
This guide configures Strapi to allow public read access to content without requiring API tokens.

## Step 1: Access Strapi Admin Panel

1. Open: http://152.67.4.226/admin
2. Login with:
   - Email: admin@skynet.com
   - Password: Admin123!@#

## Step 2: Configure Public Permissions

### Navigate to Settings
1. Click **Settings** in the left sidebar
2. Under **USERS & PERMISSIONS PLUGIN**, click **Roles**
3. Click on **Public** role

### Enable Read Permissions for Content Types

Enable the following permissions for PUBLIC role:

#### 1. Services
- ✅ find (Get all services)
- ✅ findOne (Get single service)

#### 2. Blogs
- ✅ find (Get all blogs)
- ✅ findOne (Get single blog)

#### 3. Careers
- ✅ find (Get all careers)
- ✅ findOne (Get single career)

#### 4. Office Locations
- ✅ find (Get all locations)
- ✅ findOne (Get single location)

#### 5. Partners
- ✅ find (Get all partners)
- ✅ findOne (Get single partner)

#### 6. Testimonials
- ✅ find (Get all testimonials)
- ✅ findOne (Get single testimonial)

#### 7. FAQs
- ✅ find (Get all FAQs)
- ✅ findOne (Get single FAQ)

#### 8. Global Settings
- ✅ find (Get global settings)

#### 9. Rates
- ✅ find (Get all rates)
- ✅ findOne (Get single rate)

#### 10. Service Categories
- ✅ find (Get all categories)
- ✅ findOne (Get single category)

#### 11. Upload Plugin
- ✅ find (View uploaded files)

### DO NOT Enable for Public
- ❌ Admin functions
- ❌ Create operations
- ❌ Update operations
- ❌ Delete operations
- ❌ User management

## Step 3: Save Configuration

1. Click **Save** button at the top right
2. Wait for "Saved" confirmation

## Step 4: Test Public Access

Test the API without authentication:

```bash
# Test services endpoint
curl http://152.67.4.226/api/services

# Test blogs endpoint
curl http://152.67.4.226/api/blogs

# Test office locations
curl http://152.67.4.226/api/office-locations

# Test global settings
curl http://152.67.4.226/api/global-settings
```

## Step 5: Frontend Configuration

The frontend is already configured to work without API tokens. No changes needed.

## Security Notes

1. **Public = Read Only**: Only enable read operations for public role
2. **Admin Protection**: Never enable admin operations for public
3. **Sensitive Data**: Don't expose user data or internal configurations
4. **Rate Limiting**: Consider adding rate limiting in production

## Troubleshooting

### Issue: API returns 403 Forbidden
- Check that permissions are saved in Strapi
- Verify the endpoint name matches the content type
- Clear browser cache

### Issue: API returns 404 Not Found
- Check that content type exists in Strapi
- Verify the API route is correct
- Ensure Strapi is running: `pm2 status`

### Issue: No data returned
- Create sample content in Strapi admin
- Check that content is published (not draft)
- Verify populate parameters in API calls

## Quick Permission Setup Script

Run this on Ubuntu server after creating admin:

```bash
# Check if Strapi is accessible
curl -I http://localhost:1337/api/services

# If returns 403, permissions need to be configured in admin panel
# If returns 200 or 404, permissions are already public
```

## Content Type API Endpoints

Once configured, these endpoints will be publicly accessible:

- **Services**: `/api/services`
- **Blogs**: `/api/blogs`  
- **Careers**: `/api/careers`
- **Office Locations**: `/api/office-locations`
- **Partners**: `/api/partners`
- **Testimonials**: `/api/testimonials`
- **FAQs**: `/api/faqs`
- **Global Settings**: `/api/global-settings`
- **Rates**: `/api/rates`
- **Service Categories**: `/api/service-categories`

## Next Steps

1. Create content in Strapi admin panel
2. Test API endpoints
3. Verify frontend displays content
4. Configure caching if needed