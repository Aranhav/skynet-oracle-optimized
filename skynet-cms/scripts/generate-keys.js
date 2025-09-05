#!/usr/bin/env node

/**
 * Generate secure keys for Strapi configuration
 * Run: node scripts/generate-keys.js
 */

const crypto = require('crypto');

console.log('🔐 Generating secure keys for Strapi...\n');

// Generate APP_KEYS
console.log('APP_KEYS (copy all 4, comma-separated):');
const appKeys = [];
for(let i = 0; i < 4; i++) {
  const key = crypto.randomBytes(16).toString('base64');
  appKeys.push(key);
  console.log(`  ${i + 1}. ${key}`);
}
console.log('\nAPP_KEYS=' + appKeys.join(','));

// Generate salts and secrets
console.log('\n\nSECRETS AND SALTS:');

const adminJwtSecret = crypto.randomBytes(32).toString('base64');
console.log(`\nADMIN_JWT_SECRET=${adminJwtSecret}`);

const apiTokenSalt = crypto.randomBytes(32).toString('base64');
console.log(`API_TOKEN_SALT=${apiTokenSalt}`);

const transferTokenSalt = crypto.randomBytes(32).toString('base64');
console.log(`TRANSFER_TOKEN_SALT=${transferTokenSalt}`);

const jwtSecret = crypto.randomBytes(32).toString('base64');
console.log(`JWT_SECRET=${jwtSecret}`);

console.log('\n✅ Keys generated successfully!');
console.log('📝 Copy these to your Railway environment variables.');
console.log('⚠️  Keep these keys secure and never commit them to git!');