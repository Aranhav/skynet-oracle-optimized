#!/bin/bash

# Test Strapi API endpoints with different query formats

echo "Testing Strapi API Query Formats"
echo "================================="

# Test basic API call
echo -e "\n1. Basic API call (no parameters):"
curl -s "http://152.67.4.226/api/blog-posts" | head -100

# Test with simple populate
echo -e "\n2. Simple populate:"
curl -s "http://152.67.4.226/api/blog-posts?populate=*" | head -100

# Test with pagination
echo -e "\n3. With pagination:"
curl -s "http://152.67.4.226/api/blog-posts?pagination[page]=1&pagination[pageSize]=10" | head -100

# Test complex query (like the one causing 400 error)
echo -e "\n4. Complex query (current format):"
curl -s "http://152.67.4.226/api/blog-posts?populate=featuredImage,author,category&pagination[page]=1&pagination[pageSize]=100&sort=createdAt:desc" | head -100

# Test with populate as array
echo -e "\n5. Populate with array format:"
curl -s "http://152.67.4.226/api/blog-posts?populate[0]=featuredImage&populate[1]=author&populate[2]=category" | head -100

# Test services API
echo -e "\n6. Services API:"
curl -s "http://152.67.4.226/api/services?populate=*" | head -100

# Test office locations with filters
echo -e "\n7. Office locations with filter:"
curl -s "http://152.67.4.226/api/office-locations?filters[isHeadOffice][\$eq]=true" | head -100