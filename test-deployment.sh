#!/bin/bash

# Test script to verify deployment is working correctly
# Checks all critical endpoints and services

set -e

# Configuration
SERVER_URL="http://152.67.4.226"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}         SKYNET DEPLOYMENT VERIFICATION TEST              ${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${CYAN}Server: ${SERVER_URL}${NC}"
echo -e "${CYAN}Date: $(date)${NC}\n"

# Test results tracking
TOTAL_TESTS=0
PASSED_TESTS=0
FAILED_TESTS=0

# Function to test endpoint
test_endpoint() {
    local NAME="$1"
    local URL="$2"
    local EXPECTED_STATUS="${3:-200}"
    
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    
    echo -n "Testing ${NAME}... "
    
    RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" "${URL}" || echo "000")
    
    if [ "$RESPONSE" = "$EXPECTED_STATUS" ]; then
        echo -e "${GREEN}✓ PASS${NC} (HTTP ${RESPONSE})"
        PASSED_TESTS=$((PASSED_TESTS + 1))
        return 0
    else
        echo -e "${RED}✗ FAIL${NC} (Expected ${EXPECTED_STATUS}, Got ${RESPONSE})"
        FAILED_TESTS=$((FAILED_TESTS + 1))
        return 1
    fi
}

# Function to test API with content check
test_api_content() {
    local NAME="$1"
    local URL="$2"
    
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    
    echo -n "Testing ${NAME} content... "
    
    RESPONSE=$(curl -s "${URL}")
    
    if echo "$RESPONSE" | grep -q '"data"'; then
        DATA_COUNT=$(echo "$RESPONSE" | python3 -c "import sys, json; print(len(json.load(sys.stdin)['data']))" 2>/dev/null || echo "0")
        
        if [ "$DATA_COUNT" -gt "0" ]; then
            echo -e "${GREEN}✓ PASS${NC} (${DATA_COUNT} items found)"
            PASSED_TESTS=$((PASSED_TESTS + 1))
            return 0
        else
            echo -e "${YELLOW}⚠ WARN${NC} (No content - create content in Strapi)"
            PASSED_TESTS=$((PASSED_TESTS + 1))
            return 0
        fi
    else
        echo -e "${RED}✗ FAIL${NC} (Invalid response)"
        FAILED_TESTS=$((FAILED_TESTS + 1))
        return 1
    fi
}

echo -e "${YELLOW}━━━ Frontend Pages ━━━${NC}"
test_endpoint "Homepage" "${SERVER_URL}/"
test_endpoint "Services Page" "${SERVER_URL}/services"
test_endpoint "About Page" "${SERVER_URL}/about"
test_endpoint "Contact Page" "${SERVER_URL}/contact"
test_endpoint "Blog Page" "${SERVER_URL}/blog"
test_endpoint "Tracking Page" "${SERVER_URL}/track"

echo -e "\n${YELLOW}━━━ Strapi Admin ━━━${NC}"
test_endpoint "Strapi Admin" "${SERVER_URL}/admin"
test_endpoint "Strapi Health" "${SERVER_URL}/_health"

echo -e "\n${YELLOW}━━━ Strapi API Endpoints ━━━${NC}"
test_endpoint "Blog Posts API" "${SERVER_URL}/api/blog-posts"
test_endpoint "Services API" "${SERVER_URL}/api/services"
test_endpoint "Office Locations API" "${SERVER_URL}/api/office-locations"
test_endpoint "Global Settings API" "${SERVER_URL}/api/global-settings"
test_endpoint "FAQs API" "${SERVER_URL}/api/faqs"
test_endpoint "Partners API" "${SERVER_URL}/api/partners"
test_endpoint "Testimonials API" "${SERVER_URL}/api/testimonials"

echo -e "\n${YELLOW}━━━ API Content Check ━━━${NC}"
test_api_content "Blog Posts" "${SERVER_URL}/api/blog-posts"
test_api_content "Services" "${SERVER_URL}/api/services"
test_api_content "Office Locations" "${SERVER_URL}/api/office-locations"

echo -e "\n${YELLOW}━━━ Next.js API Routes ━━━${NC}"
test_endpoint "Track API" "${SERVER_URL}/api/track?trackingNumber=TEST123"
test_endpoint "Health API" "${SERVER_URL}/api/health"

echo -e "\n${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}                    TEST RESULTS SUMMARY                  ${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "Total Tests: ${TOTAL_TESTS}"
echo -e "${GREEN}Passed: ${PASSED_TESTS}${NC}"
echo -e "${RED}Failed: ${FAILED_TESTS}${NC}"

if [ $FAILED_TESTS -eq 0 ]; then
    echo -e "\n${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${GREEN}           ✓ ALL TESTS PASSED SUCCESSFULLY!               ${NC}"
    echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    
    echo -e "\n${YELLOW}Recommended Actions:${NC}"
    echo -e "1. Login to Strapi Admin: ${BLUE}${SERVER_URL}/admin${NC}"
    echo -e "   Email: ${CYAN}admin@skynet.com${NC}"
    echo -e "   Password: ${CYAN}SkynetAdmin@2025${NC}"
    echo -e "2. Create and publish content for:"
    echo -e "   - Blog Posts"
    echo -e "   - Services"
    echo -e "   - FAQs"
    echo -e "   - Testimonials"
    echo -e "3. Upload logo and favicon in Global Settings"
else
    echo -e "\n${RED}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${RED}           ✗ SOME TESTS FAILED - REVIEW NEEDED            ${NC}"
    echo -e "${RED}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    
    echo -e "\n${YELLOW}Troubleshooting Steps:${NC}"
    echo -e "1. Check if services are running:"
    echo -e "   ${CYAN}ssh ubuntu@152.67.4.226 'pm2 status'${NC}"
    echo -e "2. Check Nginx configuration:"
    echo -e "   ${CYAN}ssh ubuntu@152.67.4.226 'sudo nginx -t'${NC}"
    echo -e "3. Check logs:"
    echo -e "   ${CYAN}ssh ubuntu@152.67.4.226 'pm2 logs --lines 50'${NC}"
    echo -e "4. Run permission script:"
    echo -e "   ${CYAN}./set-strapi-permissions.sh${NC}"
fi

echo -e "\n${CYAN}Test completed at: $(date)${NC}"