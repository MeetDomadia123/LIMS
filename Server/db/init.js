import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pool from './index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const initializeDatabase = async () => {
  try {
    console.log('🔄 Initializing database...');
    
    // Check if tables exist
    const tablesCheck = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN ('users', 'components', 'inventory_transactions')
    `);
    
    console.log(`📊 Found ${tablesCheck.rows.length} tables`);
    
    // Create missing tables if needed
    if (tablesCheck.rows.length < 3) {
      console.log('⚠️  Creating missing tables...');
      
      // Add missing columns to users table
      await pool.query(`
        ALTER TABLE users ADD COLUMN IF NOT EXISTS email VARCHAR(100) UNIQUE;
        ALTER TABLE users ADD COLUMN IF NOT EXISTS first_name VARCHAR(50);
        ALTER TABLE users ADD COLUMN IF NOT EXISTS last_name VARCHAR(50);
        ALTER TABLE users ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
      `);

      // Create inventory_transactions table
      await pool.query(`
        CREATE TABLE IF NOT EXISTS inventory_transactions (
          id SERIAL PRIMARY KEY,
          component_id INTEGER REFERENCES components(id) ON DELETE CASCADE,
          transaction_type VARCHAR(20) CHECK (transaction_type IN ('in', 'out', 'adjustment')),
          quantity INTEGER NOT NULL,
          reference_number VARCHAR(100),
          reason TEXT,
          user_id INTEGER REFERENCES users(id),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);

      // Update admin user
      await pool.query(`
        UPDATE users SET 
          email = 'admin@lims.com',
          first_name = 'System',
          last_name = 'Administrator'
        WHERE username = 'admin' AND email IS NULL;
      `);
    }
    
    console.log('✅ Database schema initialized successfully');
    
  } catch (error) {
    console.error('❌ Database initialization failed:', error.message);
    // Don't throw error - let server start anyway
  }
};

// If running this file directly
if (import.meta.url === `file://${process.argv[1]}`) {
  initializeDatabase()
    .then(() => {
      console.log('Database initialization complete');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Database initialization failed:', error);
      process.exit(1);
    });
}