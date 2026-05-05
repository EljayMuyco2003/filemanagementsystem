#!/usr/bin/env node

/**
 * Generate a secure JWT secret for production
 * Run: node generate-jwt-secret.js
 */

const crypto = require('crypto');

function generateSecret() {
  return crypto.randomBytes(32).toString('base64');
}

console.log('\n🔐 Generated JWT Secret for Production:\n');
console.log('━'.repeat(60));
console.log(generateSecret());
console.log('━'.repeat(60));
console.log('\n📋 Copy this and add to Railway Environment Variables as JWT_SECRET\n');
