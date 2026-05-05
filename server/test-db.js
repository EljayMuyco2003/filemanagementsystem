const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function testConnection() {
  try {
    console.log('🔍 Testing database connection...');
    console.log('Connection string:', process.env.DATABASE_URL.replace(/:[^:@]+@/, ':****@'));
    
    const client = await pool.connect();
    console.log('✅ Connected to database!');
    
    // Test query
    const result = await client.query('SELECT NOW()');
    console.log('✅ Query successful:', result.rows[0]);
    
    // Check if users table exists
    const tables = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    console.log('\n📋 Tables in database:');
    tables.rows.forEach(row => console.log('  -', row.table_name));
    
    // Check users
    const users = await client.query('SELECT id, email, role FROM users');
    console.log('\n👥 Users in database:');
    users.rows.forEach(user => console.log('  -', user.email, `(${user.role})`));
    
    client.release();
    process.exit(0);
  } catch (error) {
    console.error('❌ Database error:', error.message);
    process.exit(1);
  }
}

testConnection();
