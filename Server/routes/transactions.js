import express from 'express';
import pool from '../db/index.js'; // Fixed: use pool instead of db
import { verifyToken } from '../middleware/authMiddleware.js'; // Fixed: correct import

const router = express.Router();

router.post('/', verifyToken, async (req, res) => {
  const client = await pool.connect();
  
  try {
    const { component_id, transaction_type, quantity, reason, reference_number } = req.body;
    const user_id = req.user.id;

    // Validate transaction type (updated to use new types)
    if (!['in', 'out', 'adjustment'].includes(transaction_type)) {
      return res.status(400).json({ 
        error: 'Invalid transaction type. Must be "in", "out", or "adjustment"' 
      });
    }

    // Validate quantity
    if (!quantity || quantity <= 0) {
      return res.status(400).json({ error: 'Quantity must be a positive number' });
    }

    // Calculate delta based on transaction type
    let delta;
    switch (transaction_type) {
      case 'in':
        delta = quantity;
        break;
      case 'out':
        delta = -quantity;
        break;
      case 'adjustment':
        // For adjustments, quantity represents the new total
        const currentResult = await client.query(
          'SELECT quantity FROM components WHERE id = $1',
          [component_id]
        );
        
        if (currentResult.rows.length === 0) {
          return res.status(404).json({ error: 'Component not found' });
        }
        
        delta = quantity - currentResult.rows[0].quantity;
        break;
      default:
        return res.status(400).json({ error: 'Invalid transaction type' });
    }

    // Start transaction
    await client.query('BEGIN');

    // Check if component exists and get current quantity
    const componentResult = await client.query(
      'SELECT id, name, quantity FROM components WHERE id = $1',
      [component_id]
    );

    if (componentResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Component not found' });
    }

    const currentQuantity = componentResult.rows[0].quantity;
    const newQuantity = currentQuantity + delta;

    // Prevent negative stock (except for adjustments)
    if (newQuantity < 0 && transaction_type !== 'adjustment') {
      await client.query('ROLLBACK');
      return res.status(400).json({ 
        error: `Insufficient stock. Available: ${currentQuantity}, Requested: ${Math.abs(delta)}` 
      });
    }

    // Insert transaction log
    const transactionResult = await client.query(
      `INSERT INTO inventory_transactions (component_id, transaction_type, quantity, user_id, reason, reference_number)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, created_at`,
      [component_id, transaction_type, Math.abs(quantity), user_id, reason, reference_number]
    );

    // Update component stock and last_moved
    await client.query(
      `UPDATE components
       SET quantity = $1,
           last_moved = CURRENT_TIMESTAMP,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $2`,
      [newQuantity, component_id]
    );

    await client.query('COMMIT');
    
    res.status(201).json({ 
      message: 'Transaction completed successfully',
      transaction: {
        id: transactionResult.rows[0].id,
        component_id,
        transaction_type,
        quantity: Math.abs(quantity),
        delta,
        previous_quantity: currentQuantity,
        new_quantity: newQuantity,
        user_id,
        reason,
        reference_number,
        created_at: transactionResult.rows[0].created_at
      }
    });

  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Transaction error:', err);
    res.status(500).json({ error: 'Failed to process transaction' });
  } finally {
    client.release();
  }
});

// Get transaction history
router.get('/', verifyToken, async (req, res) => {
  try {
    const { component_id, limit = 50, offset = 0 } = req.query;
    
    let query = `
      SELECT 
        t.id,
        t.component_id,
        t.transaction_type,
        t.quantity,
        t.reason,
        t.reference_number,
        t.created_at,
        c.name as component_name,
        u.username,
        CONCAT(u.first_name, ' ', u.last_name) AS user_name
      FROM inventory_transactions t
      JOIN components c ON t.component_id = c.id
      LEFT JOIN users u ON t.user_id = u.id
    `;
    
    const params = [];
    
    if (component_id) {
      query += ' WHERE t.component_id = $1';
      params.push(component_id);
    }
    
    query += ' ORDER BY t.created_at DESC LIMIT $' + (params.length + 1) + ' OFFSET $' + (params.length + 2);
    params.push(limit, offset);

    const result = await pool.query(query, params);
    
    res.json({
      transactions: result.rows,
      pagination: {
        limit: parseInt(limit),
        offset: parseInt(offset),
        total: result.rows.length
      }
    });

  } catch (err) {
    console.error('Get transactions error:', err);
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
});

// Get transaction by ID
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query(`
      SELECT 
        t.*,
        c.name as component_name,
        u.username,
        CONCAT(u.first_name, ' ', u.last_name) AS user_name
      FROM inventory_transactions t
      JOIN components c ON t.component_id = c.id
      LEFT JOIN users u ON t.user_id = u.id
      WHERE t.id = $1
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    res.json(result.rows[0]);

  } catch (err) {
    console.error('Get transaction error:', err);
    res.status(500).json({ error: 'Failed to fetch transaction' });
  }
});

export default router;
