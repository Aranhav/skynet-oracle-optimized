#!/bin/bash

# Automatically set Strapi public permissions via API
# This script logs into Strapi and enables public access for all content types

set -e

# Configuration
STRAPI_URL="http://152.67.4.226"
ADMIN_EMAIL="admin@skynet.com"
ADMIN_PASSWORD="SkynetAdmin@2025"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}         STRAPI PUBLIC PERMISSIONS CONFIGURATOR           ${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

echo -e "\n${YELLOW}Step 1: Authenticating with Strapi...${NC}"

# Login to Strapi and get JWT token
AUTH_RESPONSE=$(curl -s -X POST "${STRAPI_URL}/admin/login" \
  -H "Content-Type: application/json" \
  -d "{
    \"email\": \"${ADMIN_EMAIL}\",
    \"password\": \"${ADMIN_PASSWORD}\"
  }")

# Extract JWT token
JWT_TOKEN=$(echo $AUTH_RESPONSE | python3 -c "import sys, json; print(json.load(sys.stdin)['data']['token'])" 2>/dev/null || echo "")

if [ -z "$JWT_TOKEN" ]; then
  echo -e "${RED}✗ Failed to authenticate with Strapi${NC}"
  echo -e "${YELLOW}Please ensure Strapi is running and credentials are correct${NC}"
  echo -e "URL: ${STRAPI_URL}/admin"
  echo -e "Email: ${ADMIN_EMAIL}"
  echo -e "Password: ${ADMIN_PASSWORD}"
  exit 1
fi

echo -e "${GREEN}✓ Authentication successful${NC}"

echo -e "\n${YELLOW}Step 2: Fetching public role...${NC}"

# Get the public role ID
ROLE_RESPONSE=$(curl -s -X GET "${STRAPI_URL}/admin/users-permissions/roles" \
  -H "Authorization: Bearer ${JWT_TOKEN}")

PUBLIC_ROLE_ID=$(echo $ROLE_RESPONSE | python3 -c "
import sys, json
data = json.load(sys.stdin)
for role in data['roles']:
    if role['type'] == 'public':
        print(role['id'])
        break
" 2>/dev/null || echo "")

if [ -z "$PUBLIC_ROLE_ID" ]; then
  echo -e "${RED}✗ Failed to find public role${NC}"
  exit 1
fi

echo -e "${GREEN}✓ Found public role (ID: ${PUBLIC_ROLE_ID})${NC}"

echo -e "\n${YELLOW}Step 3: Configuring permissions...${NC}"

# Content types to enable
CONTENT_TYPES=(
  "blog-post"
  "service"
  "office-location"
  "global-setting"
  "faq"
  "partner"
  "testimonial"
)

# Build permissions object
PERMISSIONS_JSON='{"permissions": {'

for TYPE in "${CONTENT_TYPES[@]}"; do
  echo -e "  Enabling: ${TYPE}"
  PERMISSIONS_JSON+='"api::'${TYPE}'.'${TYPE}'": {"controllers": {"'${TYPE}'": {"find": {"enabled": true, "policy": ""}, "findOne": {"enabled": true, "policy": ""}}}}, '
done

# Remove trailing comma and close JSON
PERMISSIONS_JSON=${PERMISSIONS_JSON%", "}
PERMISSIONS_JSON+='}}'

# Update public role permissions
UPDATE_RESPONSE=$(curl -s -X PUT "${STRAPI_URL}/admin/users-permissions/roles/${PUBLIC_ROLE_ID}" \
  -H "Authorization: Bearer ${JWT_TOKEN}" \
  -H "Content-Type: application/json" \
  -d "${PERMISSIONS_JSON}")

# Check if update was successful
if echo "$UPDATE_RESPONSE" | grep -q "error"; then
  echo -e "${RED}✗ Failed to update permissions${NC}"
  echo "$UPDATE_RESPONSE" | python3 -m json.tool
  exit 1
fi

echo -e "${GREEN}✓ Permissions updated successfully${NC}"

echo -e "\n${YELLOW}Step 4: Testing API endpoints...${NC}"

# Test each endpoint
for TYPE in "${CONTENT_TYPES[@]}"; do
  TYPE_PLURAL="${TYPE}s"
  
  # Handle special pluralization
  if [ "$TYPE" = "faq" ]; then
    TYPE_PLURAL="faqs"
  elif [ "$TYPE" = "office-location" ]; then
    TYPE_PLURAL="office-locations"
  elif [ "$TYPE" = "global-setting" ]; then
    TYPE_PLURAL="global-settings"
  elif [ "$TYPE" = "blog-post" ]; then
    TYPE_PLURAL="blog-posts"
  fi
  
  RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" "${STRAPI_URL}/api/${TYPE_PLURAL}")
  
  if [ "$RESPONSE" = "200" ]; then
    echo -e "  ${GREEN}✓${NC} /api/${TYPE_PLURAL} - OK"
  else
    echo -e "  ${RED}✗${NC} /api/${TYPE_PLURAL} - HTTP ${RESPONSE}"
  fi
done

echo -e "\n${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}         PERMISSIONS CONFIGURATION COMPLETE!              ${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "\n${YELLOW}Next Steps:${NC}"
echo -e "1. Create content in Strapi Admin: ${BLUE}${STRAPI_URL}/admin${NC}"
echo -e "2. Publish your content (draft content won't show in API)"
echo -e "3. Visit the blog page: ${BLUE}${STRAPI_URL}/blog${NC}"
echo -e "\n${GREEN}API Endpoints are now publicly accessible:${NC}"
echo -e "  ${BLUE}${STRAPI_URL}/api/blog-posts${NC}"
echo -e "  ${BLUE}${STRAPI_URL}/api/services${NC}"
echo -e "  ${BLUE}${STRAPI_URL}/api/office-locations${NC}"
echo -e "  ${BLUE}${STRAPI_URL}/api/global-settings${NC}"