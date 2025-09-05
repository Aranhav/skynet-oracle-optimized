#!/bin/bash
echo "==================================="
echo "    STRAPI STARTUP DIAGNOSTICS    "
echo "==================================="
echo ""
echo "🔍 Environment Check:"
echo "--------------------"
echo "NODE_ENV: ${NODE_ENV:-not set}"
echo "PORT: ${PORT:-not set}"
echo ""
echo "🔐 Security Keys Check:"
echo "-----------------------"
echo "APP_KEYS exists: $([ -n "$APP_KEYS" ] && echo '✅ YES' || echo '❌ NO')"
echo "ADMIN_JWT_SECRET exists: $([ -n "$ADMIN_JWT_SECRET" ] && echo '✅ YES' || echo '❌ NO')"
echo "API_TOKEN_SALT exists: $([ -n "$API_TOKEN_SALT" ] && echo '✅ YES' || echo '❌ NO')"
echo "TRANSFER_TOKEN_SALT exists: $([ -n "$TRANSFER_TOKEN_SALT" ] && echo '✅ YES' || echo '❌ NO')"
echo "JWT_SECRET exists: $([ -n "$JWT_SECRET" ] && echo '✅ YES' || echo '❌ NO')"
echo ""
echo "🗄️ Database Check:"
echo "------------------"
echo "DATABASE_URL exists: $([ -n "$DATABASE_URL" ] && echo '✅ YES' || echo '❌ NO - THIS IS THE PROBLEM!')"
echo "DATABASE_CLIENT: ${DATABASE_CLIENT:-not set}"
echo "DATABASE_SSL: ${DATABASE_SSL:-not set}"

if [ -n "$DATABASE_URL" ]; then
  echo "DATABASE_URL format check: $(echo $DATABASE_URL | grep -q 'postgres://' && echo '✅ Valid PostgreSQL URL' || echo '⚠️ Invalid format')"
else
  echo ""
  echo "❌❌❌ CRITICAL ERROR ❌❌❌"
  echo "DATABASE_URL is not set!"
  echo ""
  echo "To fix this:"
  echo "1. Go to Railway Dashboard"
  echo "2. Click 'New' → 'Database' → 'PostgreSQL'"
  echo "3. Railway will automatically set DATABASE_URL"
  echo "4. Redeploy this service"
  echo "================================"
fi

echo ""
echo "🚀 Starting Strapi..."
echo "==================================="
echo ""

# Start Strapi
exec npm run start
