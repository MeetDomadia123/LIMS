import express from 'express';
import bcrypt from 'bcryptjs';
import pool from '../db/index.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

// Get all users (Admin only)
router.get('/users', verifyToken, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied. Admin only.' });
    }

    const result = await pool.query(`
      SELECT id, username, email, role, first_name, last_name, created_at 
      FROM users ORDER BY created_at DESC
    `);
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Create new user (Admin only)
router.post('/users', verifyToken, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied. Admin only.' });
    }

    const { username, email, password, role, first_name, last_name } = req.body;

    // Validate required fields
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Username, email, and password are required' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const result = await pool.query(`
      INSERT INTO users (username, email, password, role, first_name, last_name)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id, username, email, role, first_name, last_name, created_at
    `, [username, email, hashedPassword, role || 'user', first_name, last_name]);

    res.status(201).json({
      message: 'User created successfully',
      user: result.rows[0]
    });

  } catch (error) {
    console.error(error);
    if (error.code === '23505') {
      return res.status(409).json({ error: 'Username or email already exists' });
    }
    res.status(500).json({ error: 'Failed to create user' });
  }
});

export default router;