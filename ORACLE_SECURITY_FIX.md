# Oracle Cloud Security Lists Configuration - URGENT FIX

## The Problem
Your site is deployed and running but not accessible because Oracle Cloud is blocking incoming HTTP traffic by default.

## Quick Fix (5 minutes)

### Step 1: Login to Oracle Cloud Console
1. Go to: https://cloud.oracle.com
2. Sign in with your Oracle Cloud account

### Step 2: Navigate to Security Lists
1. Click the **☰** menu (top-left)
2. Go to **Networking** → **Virtual Cloud Networks**
3. Click on your VCN (should be named something like `vcn-20250905-xxxx`)
4. In the left sidebar, click **Security Lists**
5. Click on **Default Security List**

### Step 3: Add HTTP Ingress Rule
1. Scroll to **Ingress Rules** section
2. Click **Add Ingress Rules** button
3. Fill in:
   - **Source Type:** CIDR
   - **Source CIDR:** `0.0.0.0/0`
   - **IP Protocol:** TCP
   - **Source Port Range:** (leave empty for All)
   - **Destination Port Range:** `80`
   - **Description:** Allow HTTP traffic
4. Click **Add Ingress Rules**

### Step 4: Add HTTPS Ingress Rule (Optional but Recommended)
1. Click **Add Ingress Rules** again
2. Fill in:
   - **Source Type:** CIDR
   - **Source CIDR:** `0.0.0.0/0`
   - **IP Protocol:** TCP
   - **Source Port Range:** (leave empty for All)
   - **Destination Port Range:** `443`
   - **Description:** Allow HTTPS traffic
3. Click **Add Ingress Rules**

## Verify Rules Are Added
You should now see these rules in your Ingress Rules list:
- TCP traffic on port 80 from 0.0.0.0/0
- TCP traffic on port 443 from 0.0.0.0/0 (if added)
- TCP traffic on port 22 from 0.0.0.0/0 (SSH - should already exist)

## Test Access
After adding the rules, wait 30-60 seconds, then:
1. Open browser and go to: http://152.67.4.226
2. You should see your Skynet India website!

## If Still Not Working

Run this on the server:
```bash
# Make the script executable
chmod +x fix-network-access.sh

# Run the network fix script
./fix-network-access.sh
```

This will:
- Check if services are running locally
- Configure Ubuntu firewall
- Test Nginx configuration
- Show you exactly what's working and what's not

## Common Issues

### Issue: "Connection Refused"
- Security Lists not configured (follow steps above)
- Wait 1-2 minutes after adding rules

### Issue: "Connection Timeout"
- Oracle Security Lists blocking traffic
- Ubuntu firewall blocking (run fix-network-access.sh)

### Issue: "502 Bad Gateway"
- Services crashed - run: `pm2 restart all`
- Database issue - check: `pm2 logs skynet-cms`

## Quick Commands to Run on Server

```bash
# Check if services are running
pm2 list

# Test locally
curl http://localhost

# Check firewall
sudo ufw status

# Restart everything
pm2 restart all
sudo systemctl restart nginx
```

## Your Site URLs (After Fix)
- Main Website: http://152.67.4.226
- CMS Admin: http://152.67.4.226/admin
  - Username: admin@skynet.com
  - Password: Admin123!@#

## Need More Help?
The issue is 99% likely to be Oracle Cloud Security Lists. If you've added the rules above and it's still not working after 5 minutes, run the fix-network-access.sh script on the server for detailed diagnostics.