#!/bin/bash

set -e

echo "========================================="
echo "   FIXING NETWORK ACCESS FOR SKYNET"
echo "========================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 1. Test services locally
echo -e "${YELLOW}Step 1: Testing services locally...${NC}"
echo "Testing Frontend (port 3000)..."
if curl -s -o /dev/null -w "%{http_code}" http://localhost:3000 | grep -q "200\|301\|302"; then
    echo -e "${GREEN}✓ Frontend is running on port 3000${NC}"
else
    echo -e "${RED}✗ Frontend is NOT accessible on port 3000${NC}"
fi

echo "Testing CMS (port 1337)..."
if curl -s -o /dev/null -w "%{http_code}" http://localhost:1337/admin | grep -q "200\|301\|302"; then
    echo -e "${GREEN}✓ CMS is running on port 1337${NC}"
else
    echo -e "${RED}✗ CMS is NOT accessible on port 1337${NC}"
fi

echo "Testing Nginx (port 80)..."
if curl -s -o /dev/null -w "%{http_code}" http://localhost:80 | grep -q "200\|301\|302\|502"; then
    echo -e "${GREEN}✓ Nginx is running on port 80${NC}"
else
    echo -e "${RED}✗ Nginx is NOT accessible on port 80${NC}"
    echo "Checking Nginx status..."
    sudo systemctl status nginx --no-pager || true
fi

# 2. Check and configure Ubuntu firewall
echo -e "\n${YELLOW}Step 2: Checking Ubuntu firewall...${NC}"

# Check if ufw is installed and active
if command -v ufw &> /dev/null; then
    UFW_STATUS=$(sudo ufw status | grep -c "Status: active" || true)
    if [ "$UFW_STATUS" -eq 1 ]; then
        echo "UFW is active. Configuring rules..."
        sudo ufw allow 80/tcp
        sudo ufw allow 443/tcp
        sudo ufw allow 22/tcp
        sudo ufw --force enable
        sudo ufw status numbered
    else
        echo "UFW is inactive. Enabling with proper rules..."
        sudo ufw allow 80/tcp
        sudo ufw allow 443/tcp
        sudo ufw allow 22/tcp
        sudo ufw --force enable
        sudo ufw status numbered
    fi
else
    echo "UFW not installed. Checking iptables..."
fi

# 3. Check iptables rules
echo -e "\n${YELLOW}Step 3: Checking iptables rules...${NC}"
echo "Current iptables rules:"
sudo iptables -L -n -v | head -20

# Add iptables rules if needed
echo "Adding iptables rules for web traffic..."
sudo iptables -I INPUT -p tcp --dport 80 -j ACCEPT
sudo iptables -I INPUT -p tcp --dport 443 -j ACCEPT
sudo iptables -I INPUT -p tcp --dport 22 -j ACCEPT

# Save iptables rules
if command -v netfilter-persistent &> /dev/null; then
    sudo netfilter-persistent save
elif command -v iptables-save &> /dev/null; then
    sudo iptables-save > /etc/iptables/rules.v4 2>/dev/null || sudo iptables-save > /tmp/iptables.rules
fi

# 4. Restart Nginx to ensure it's running
echo -e "\n${YELLOW}Step 4: Ensuring Nginx is running...${NC}"
sudo systemctl restart nginx
sudo systemctl status nginx --no-pager | head -10

# 5. Check listening ports
echo -e "\n${YELLOW}Step 5: Checking listening ports...${NC}"
sudo netstat -tlnp | grep -E ':80|:443|:3000|:1337' || sudo ss -tlnp | grep -E ':80|:443|:3000|:1337'

# 6. Test from localhost with curl
echo -e "\n${YELLOW}Step 6: Testing HTTP responses...${NC}"
echo "Testing main site through Nginx..."
curl -I http://localhost/ 2>/dev/null | head -5 || echo "Failed to connect to localhost:80"

# 7. Oracle Cloud specific checks
echo -e "\n${YELLOW}Step 7: Oracle Cloud Configuration${NC}"
echo -e "${RED}IMPORTANT: You need to configure Oracle Cloud Security Lists!${NC}"
echo ""
echo "Please follow these steps in Oracle Cloud Console:"
echo "1. Go to: https://cloud.oracle.com"
echo "2. Navigate to: Networking > Virtual Cloud Networks"
echo "3. Click on your VCN (Virtual Cloud Network)"
echo "4. Click on 'Security Lists' in the left menu"
echo "5. Click on the Default Security List"
echo "6. Under 'Ingress Rules', click 'Add Ingress Rules'"
echo "7. Add the following rules:"
echo ""
echo "   Rule 1 - HTTP:"
echo "   - Source Type: CIDR"
echo "   - Source CIDR: 0.0.0.0/0"
echo "   - IP Protocol: TCP"
echo "   - Source Port Range: All"
echo "   - Destination Port Range: 80"
echo ""
echo "   Rule 2 - HTTPS (optional but recommended):"
echo "   - Source Type: CIDR"
echo "   - Source CIDR: 0.0.0.0/0"
echo "   - IP Protocol: TCP"
echo "   - Source Port Range: All"
echo "   - Destination Port Range: 443"
echo ""
echo "8. Click 'Add Ingress Rules' to save"
echo ""
echo -e "${YELLOW}Alternative: Using Oracle CLI (if configured):${NC}"
echo "Run these commands (replace COMPARTMENT_ID and VCN_ID with your values):"
echo ""
cat << 'EOF'
# Get your compartment ID
oci iam compartment list --all

# Get your VCN ID
oci network vcn list --compartment-id <COMPARTMENT_ID>

# Get Security List ID
oci network security-list list --compartment-id <COMPARTMENT_ID> --vcn-id <VCN_ID>

# Add ingress rule for HTTP (replace SECURITY_LIST_ID)
oci network security-list update --security-list-id <SECURITY_LIST_ID> \
  --ingress-security-rules '[
    {
      "source": "0.0.0.0/0",
      "protocol": "6",
      "tcpOptions": {
        "destinationPortRange": {
          "min": 80,
          "max": 80
        }
      }
    }
  ]' --force
EOF

echo ""
echo -e "${GREEN}=========================================${NC}"
echo -e "${GREEN}   LOCAL FIXES COMPLETED${NC}"
echo -e "${GREEN}=========================================${NC}"
echo ""
echo -e "${YELLOW}Next Steps:${NC}"
echo "1. Configure Oracle Cloud Security Lists (see instructions above)"
echo "2. Wait 1-2 minutes for changes to propagate"
echo "3. Test access: http://152.67.4.226"
echo ""
echo -e "${YELLOW}Quick Test Commands:${NC}"
echo "  From your local machine:"
echo "    curl -I http://152.67.4.226"
echo "    telnet 152.67.4.226 80"
echo ""
echo "If still not working, check:"
echo "  1. PM2 status: pm2 list"
echo "  2. Nginx error logs: sudo tail -f /var/log/nginx/error.log"
echo "  3. Network route: ip route show"