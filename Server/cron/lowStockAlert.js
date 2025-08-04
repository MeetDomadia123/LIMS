import cron from 'node-cron';
import pool from '../db/index.js';

// Run every day at 9 AM to check for low stock
export const startLowStockAlert = () => {
  cron.schedule('0 9 * * *', async () => {
    try {
      console.log('🔍 Running low stock check...');
      
      const result = await pool.query(`
        SELECT name, quantity, critical_threshold
        FROM components 
        WHERE quantity <= critical_threshold
      `);
      
      if (result.rows.length > 0) {
        console.log(`⚠️  Found ${result.rows.length} components with low stock:`);
        result.rows.forEach(item => {
          console.log(`- ${item.name}: ${item.quantity} remaining (threshold: ${item.critical_threshold})`);
        });
      } else {
        console.log('✅ All components have sufficient stock');
      }
    } catch (error) {
      console.error('❌ Low stock check failed:', error);
    }
  });
};