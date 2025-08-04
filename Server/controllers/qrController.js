// Server/controllers/qrController.js
import pool from '../db/index.js';
import QRCode from 'qrcode';
import { v4 as uuidv4 } from 'uuid';

// Generate QR code for component
export const generateQRCode = async (req, res) => {
  try {
    const { componentId } = req.params;
    
    // Check if component exists
    const componentResult = await pool.query(
      'SELECT * FROM components WHERE id = $1',
      [componentId]
    );

    if (componentResult.rows.length === 0) {
      return res.status(404).json({ error: 'Component not found' });
    }

    const component = componentResult.rows[0];
    
    // Generate unique QR code if doesn't exist
    let qrCode = component.qr_code;
    if (!qrCode) {
      qrCode = uuidv4();
      await pool.query(
        'UPDATE components SET qr_code = $1 WHERE id = $2',
        [qrCode, componentId]
      );
    }

    // Generate QR code image
    const qrCodeData = JSON.stringify({
      id: component.id,
      name: component.name,
      qr_code: qrCode,
      type: 'component'
    });

    const qrCodeImage = await QRCode.toDataURL(qrCodeData);

    res.json({
      qr_code: qrCode,
      qr_image: qrCodeImage,
      component: component
    });

  } catch (error) {
    console.error('Error generating QR code:', error);
    res.status(500).json({ error: 'Failed to generate QR code' });
  }
};

// Process QR code scan
export const processQRScan = async (req, res) => {
  const client = await pool.connect();
  
  try {
    const { qrCode, transactionType, quantity, location } = req.body;
    const userId = req.user.id;

    // Validate input
    if (!qrCode || !transactionType || !quantity) {
      return res.status(400).json({ 
        error: 'QR code, transaction type, and quantity are required' 
      });
    }

    if (!['in', 'out'].includes(transactionType)) {
      return res.status(400).json({ 
        error: 'Transaction type must be "in" or "out"' 
      });
    }

    // Find component by QR code
    const componentResult = await client.query(
      'SELECT * FROM components WHERE qr_code = $1',
      [qrCode]
    );

    if (componentResult.rows.length === 0) {
      return res.status(404).json({ error: 'Component not found for this QR code' });
    }

    const component = componentResult.rows[0];
    
    await client.query('BEGIN');

    // Calculate new quantity
    const currentQuantity = component.quantity;
    const delta = transactionType === 'in' ? quantity : -quantity;
    const newQuantity = currentQuantity + delta;

    // Prevent negative stock for outward transactions
    if (newQuantity < 0 && transactionType === 'out') {
      await client.query('ROLLBACK');
      return res.status(400).json({ 
        error: `Insufficient stock. Available: ${currentQuantity}, Requested: ${quantity}` 
      });
    }

    // Update component quantity and location
    await client.query(
      `UPDATE components 
       SET quantity = $1, 
           location = COALESCE($2, location),
           last_moved = CURRENT_TIMESTAMP 
       WHERE id = $3`,
      [newQuantity, location, component.id]
    );

    // Record QR transaction
    const transactionResult = await client.query(
      `INSERT INTO qr_transactions (qr_code, component_id, transaction_type, quantity, location, user_id)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, created_at`,
      [qrCode, component.id, transactionType, quantity, location, userId]
    );

    // Also record in inventory_transactions
    await client.query(
      `INSERT INTO inventory_transactions (component_id, transaction_type, quantity, user_id, reason)
       VALUES ($1, $2, $3, $4, $5)`,
      [component.id, transactionType, quantity, userId, `QR Scan - ${transactionType.toUpperCase()}`]
    );

    await client.query('COMMIT');

    res.json({
      message: 'QR transaction completed successfully',
      transaction: {
        id: transactionResult.rows[0].id,
        component: {
          id: component.id,
          name: component.name,
          part_number: component.part_number
        },
        transaction_type: transactionType,
        quantity: quantity,
        previous_quantity: currentQuantity,
        new_quantity: newQuantity,
        location: location || component.location,
        created_at: transactionResult.rows[0].created_at
      }
    });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('QR scan error:', error);
    res.status(500).json({ error: 'Failed to process QR scan' });
  } finally {
    client.release();
  }
};

// Get component info by QR code
export const getComponentByQR = async (req, res) => {
  try {
    const { qrCode } = req.params;
    
    const result = await pool.query(
      `SELECT id, name, part_number, description, quantity, location, 
              critical_threshold, unit_price, manufacturer
       FROM components 
       WHERE qr_code = $1`,
      [qrCode]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Component not found for this QR code' });
    }

    const component = result.rows[0];
    const stockStatus = component.quantity <= component.critical_threshold ? 'critical' : 'normal';

    res.json({
      ...component,
      stock_status: stockStatus
    });

  } catch (error) {
    console.error('Error fetching component by QR:', error);
    res.status(500).json({ error: 'Failed to fetch component information' });
  }
};