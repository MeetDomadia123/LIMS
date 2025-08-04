import bcrypt from 'bcrypt';
import pool from '../db/index.js';

async function createTestUser() {
  try {
    console.log('🔄 Creating/updating test user...');
    
    // Hash the password
    const hashedPassword = await bcrypt.hash('Admin123!', 10);
    
    // Update the existing user with the correct password and email
    const result = await pool.query(`
      UPDATE users 
      SET 
        email = $1,
        password = $2,
        role = $3,
        first_name = $4,
        last_name = $5,
        status = $6
      WHERE username = $7
      RETURNING id, username, email, role, first_name, last_name, status
    `, [
      'admin@company.com',
      hashedPassword,
      'admin',
      'System',
      'Administrator',
      'approved',
      'admin'
    ]);
    
    if (result.rows.length > 0) {
      console.log('✅ Test user updated:', result.rows[0]);
    } else {
      console.log('❌ User "admin" not found');
    }
    
    // Test login with the updated user
    console.log('\n🧪 Testing login...');
    const loginTest = await fetch('http://localhost:3001/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@company.com',
        password: 'Admin123!'
      })
    });
    
    const loginResult = await loginTest.json();
    console.log('🔑 Login test result:', loginResult);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

createTestUser();