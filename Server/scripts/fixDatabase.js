import pool from '../db/index.js';

async function fixDatabase() {
  try {
    console.log('🔧 Fixing database schema...');
    
    // Add missing columns to components table
    await pool.query(`
      ALTER TABLE components 
      ADD COLUMN IF NOT EXISTS category VARCHAR(100),
      ADD COLUMN IF NOT EXISTS part_number VARCHAR(100),
      ADD COLUMN IF NOT EXISTS manufacturer VARCHAR(100),
      ADD COLUMN IF NOT EXISTS unit_price DECIMAL(10,2),
      ADD COLUMN IF NOT EXISTS last_moved TIMESTAMP,
      ADD COLUMN IF NOT EXISTS qr_code VARCHAR(255) UNIQUE
    `);
    
    console.log('✅ Database schema fixed!');
    
    // Test with a simple component
    const testResult = await pool.query(`
      INSERT INTO components (name, category, quantity, critical_threshold, location, description) 
      VALUES ('Test Component', 'Test Category', 10, 5, 'Test Location', 'Test Description')
      ON CONFLICT (name) DO NOTHING
      RETURNING id, name
    `);
    
    if (testResult.rows.length > 0) {
      console.log('✅ Test component added successfully');
    } else {
      console.log('ℹ️ Test component already exists');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error fixing database:', error);
    process.exit(1);
  }
}

fixDatabase();