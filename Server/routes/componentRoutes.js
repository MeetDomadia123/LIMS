import express from 'express';
import { addComponent, getComponents, updateComponent } from '../controllers/componentController.js';
import { verifyToken } from '../middleware/authMiddleware.js';
import pool from '../db/index.js';

const router = express.Router();

router.post('/components', verifyToken, addComponent);
router.get('/components', verifyToken, getComponents);
router.put('/components/:id', verifyToken, updateComponent);

// Delete component
router.delete('/components/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if component exists
    const componentCheck = await pool.query('SELECT id FROM components WHERE id = $1', [id]);
    if (componentCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Component not found' });
    }

    // Delete component (this will cascade delete transactions due to foreign key)
    await pool.query('DELETE FROM components WHERE id = $1', [id]);
    
    res.json({ message: 'Component deleted successfully' });
  } catch (error) {
    console.error('Error deleting component:', error);
    res.status(500).json({ error: 'Failed to delete component' });
  }
});

// Get component transaction history
router.get('/components/:id/history', verifyToken, async (req, res) => {
  const componentId = req.params.id;

  try {
    // First check if component exists
    const componentCheck = await pool.query('SELECT name, part_number FROM components WHERE id = $1', [componentId]);
    if (componentCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Component not found' });
    }

    // Get transaction history
    const result = await pool.query(`
      SELECT 
        t.id,
        t.transaction_type, 
        t.quantity, 
        COALESCE(CONCAT(u.first_name, ' ', u.last_name), u.username) AS user_name,
        u.username,
        t.reason, 
        t.reference_number,
        t.created_at
      FROM inventory_transactions t
      LEFT JOIN users u ON t.user_id = u.id
      WHERE t.component_id = $1
      ORDER BY t.created_at DESC
    `, [componentId]);

    res.status(200).json({
      component: {
        id: componentId,
        name: componentCheck.rows[0].name,
        part_number: componentCheck.rows[0].part_number
      },
      transactions: result.rows
    });
  } catch (error) {
    console.error('Error fetching component history:', error);
    res.status(500).json({ error: 'Failed to fetch component history' });
  }
});

// Get component details
router.get('/components/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query(`
      SELECT * FROM components WHERE id = $1
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Component not found' });
    }

    const component = result.rows[0];
    
    // Check stock status
    const stockStatus = component.quantity <= component.critical_threshold ? 'critical' : 'normal';

    res.json({
      ...component,
      stock_status: stockStatus
    });

  } catch (error) {
    console.error('Error fetching component details:', error);
    res.status(500).json({ error: 'Failed to fetch component details' });
  }
});

export default router;