import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../db/index.js';

export const login = async (req, res) => {
  const { email, password, username } = req.body;

  try {
    // Support both email and username login
    const loginField = email || username;
    const query = email ? 
      'SELECT * FROM users WHERE email = $1' : 
      'SELECT * FROM users WHERE username = $1';
    
    const result = await pool.query(query, [loginField]);
    const user = result.rows[0];

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    const validPass = await bcrypt.compare(password, user.password);
    if (!validPass) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    // Check if user is approved
    if (user.status !== 'approved') {
      return res.status(401).json({ message: 'Account pending approval' });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({ 
      token, 
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        first_name: user.first_name,
        last_name: user.last_name
      }
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
};
