import pool from '../db/index.js';

async function createComponentsTable() {
  try {
    console.log('🔄 Creating components table...');
    
    await pool.query(`
      CREATE TABLE components (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL UNIQUE,
        category TEXT NOT NULL,
        quantity INTEGER NOT NULL,
        critical_threshold INTEGER NOT NULL,
        location TEXT NOT NULL,
        description TEXT
      );
    `);
    
    console.log('✅ Components table created successfully!');
  } catch (error) {
    console.error('❌ Error creating components table:', error);
    process.exit(1);
  }
}

async function addUniqueConstraint() {
  try {
    console.log('🔄 Adding unique constraint to name column...');
    
    // Add unique constraint to existing table
    await pool.query(`
      ALTER TABLE components 
      ADD CONSTRAINT components_name_unique UNIQUE (name)
    `);
    
    console.log('✅ Unique constraint added successfully!');
  } catch (error) {
    if (error.code === '23505' || error.message.includes('already exists')) {
      console.log('ℹ️ Unique constraint already exists');
    } else {
      console.error('❌ Error adding unique constraint:', error);
    }
  }
}

const sampleComponents = [
  { name: 'Arduino Uno R3', category: 'Microcontroller', quantity: 25, critical_threshold: 5, location: 'Shelf A1', description: 'Arduino development board' },
  { name: 'LED Red 5mm', category: 'LED', quantity: 150, critical_threshold: 20, location: 'Drawer B2', description: 'Red LED 5mm' },
  { name: 'LED Blue 5mm', category: 'LED', quantity: 3, critical_threshold: 20, location: 'Drawer B2', description: 'Blue LED 5mm' },
  { name: 'Resistor 220Ω', category: 'Resistor', quantity: 500, critical_threshold: 50, location: 'Cabinet C1', description: '220 Ohm resistor' },
  { name: 'Resistor 1kΩ', category: 'Resistor', quantity: 8, critical_threshold: 50, location: 'Cabinet C1', description: '1k Ohm resistor' },
  { name: 'Breadboard', category: 'Prototyping', quantity: 12, critical_threshold: 5, location: 'Shelf A2', description: 'Half-size breadboard' },
  { name: 'ESP32', category: 'Microcontroller', quantity: 2, critical_threshold: 3, location: 'Shelf A1', description: 'ESP32 WiFi module' },
  { name: 'Jumper Wires', category: 'Wiring', quantity: 100, critical_threshold: 20, location: 'Drawer D1', description: 'Male-to-male jumper wires' }
];

async function addSampleData() {
  try {
    console.log('🔄 Adding sample data...');
    
    for (const component of sampleComponents) {
      try {
        await pool.query(`
          INSERT INTO components (name, category, quantity, critical_threshold, location, description) 
          VALUES ($1, $2, $3, $4, $5, $6) 
          ON CONFLICT (name) DO NOTHING
        `, [component.name, component.category, component.quantity, component.critical_threshold, component.location, component.description]);
        
        console.log(`✅ Added: ${component.name}`);
      } catch (error) {
        console.log(`ℹ️ Skipped: ${component.name} (already exists)`);
      }
    }
    
    console.log('✅ Sample data process completed!');
    
    // Show final count
    const result = await pool.query('SELECT COUNT(*) as count FROM components');
    console.log(`📊 Total components in database: ${result.rows[0].count}`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error adding sample data:', error);
    process.exit(1);
  }
}

async function main() {
  await createComponentsTable();
  await addUniqueConstraint();
  await addSampleData();
}

main();