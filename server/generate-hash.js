// Simple script to generate bcrypt password hashes
// Run with: node generate-hash.js

const bcrypt = require('bcryptjs');

async function generateHashes() {
  console.log('\n🔐 Generating password hashes for seed data...\n');
  
  const adminPassword = 'Admin@1234';
  const userPassword = 'User@1234';
  
  const adminHash = await bcrypt.hash(adminPassword, 10);
  const userHash = await bcrypt.hash(userPassword, 10);
  
  console.log('Admin password hash (Admin@1234):');
  console.log(adminHash);
  console.log('\nUser password hash (User@1234):');
  console.log(userHash);
  console.log('\n✅ Copy these hashes to database/seed.sql\n');
}

generateHashes();
