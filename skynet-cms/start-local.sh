#!/bin/bash

echo "🚀 Starting Strapi on localhost:1337..."
echo ""
echo "📝 Admin Credentials:"
echo "   Email: admin@skynet.local"
echo "   Password: Admin123!"
echo ""
echo "🌐 URLs:"
echo "   Admin Panel: http://localhost:1337/admin"
echo "   API: http://localhost:1337"
echo ""
echo "Press Ctrl+C to stop"
echo "----------------------------------------"

export HOST=localhost
export PORT=1337
npm run develop