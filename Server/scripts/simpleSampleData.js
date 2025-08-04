import pool from '../db/index.js';

const sampleComponents = [
  { name: 'Arduino Uno R3', category: 'Microcontroller', quantity: 25, critical_threshold: 5, location: 'Shelf A1', description: 'Arduino development board' },
  { name: 'LED Red 5mm', category: 'LED', quantity: 150, critical_threshold: 20, location: 'Drawer B2', description: 'Red LED 5mm' },
  { name: 'LED Blue 5mm', category: 'LED', quantity: 3, critical_threshold: 20, location: 'Drawer B2', description: 'Blue LED 5mm' },
  { name: 'Resistor 220Ω', category: 'Resistor', quantity: 500, critical_threshold: 50, location: 'Cabinet C1', description: '220 Ohm resistor' },
  { name: 'ESP32', category: 'Microcontroller', quantity: 2, critical_threshold: 3, location: 'Shelf A1', description: 'ESP32 WiFi module' }
];

async function addSimpleData() {
  try {
    console.log('🔄 Adding sample data (simple approach)...');
    
    for (const component of sampleComponents) {
      try {
        // Check if exists first
        const existing = await pool.query('SELECT id FROM components WHERE name = $1', [component.name]);
        
        if (existing.rows.length === 0) {
          await pool.query(`
            INSERT INTO components (name, category, quantity, critical_threshold, location, description) 
            VALUES ($1, $2, $3, $4, $5, $6)
          `, [component.name, component.category, component.quantity, component.critical_threshold, component.location, component.description]);
          
          console.log(`✅ Added: ${component.name}`);
        } else {
          console.log(`ℹ️ Skipped: ${component.name} (already exists)`);
        }
      } catch (error) {
        console.log(`❌ Failed: ${component.name} - ${error.message}`);
      }
    }
    
    // Show final count
    const result = await pool.query('SELECT COUNT(*) as count FROM components');
    console.log(`📊 Total components: ${result.rows[0].count}`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

addSimpleData();