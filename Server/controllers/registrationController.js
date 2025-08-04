// Server/controllers/registrationController.js
import bcrypt from 'bcryptjs';
import pool from '../db/index.js';

// Submit registration request
export const submitRegistrationRequest = async (req, res) => {
  try {
    const { username, email, password, first_name, last_name, requested_role, reason } = req.body;

    // Validate required fields
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Username, email, and password are required' });
    }

    // Check if username or email already exists
    const existingUser = await pool.query(
      'SELECT id FROM users WHERE username = $1 OR email = $2',
      [username, email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(409).json({ error: 'Username or email already exists' });
    }

    // Check if request already exists
    const existingRequest = await pool.query(
      'SELECT id FROM user_requests WHERE username = $1 OR email = $2',
      [username, email]
    );

    if (existingRequest.rows.length > 0) {
      return res.status(409).json({ error: 'Registration request already submitted' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Insert registration request
    const result = await pool.query(
      `INSERT INTO user_requests (username, email, password, first_name, last_name, requested_role, reason)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id, username, email, first_name, last_name, requested_role, created_at`,
      [username, email, hashedPassword, first_name, last_name, requested_role || 'user', reason]
    );

    res.status(201).json({
      message: 'Registration request submitted successfully. Please wait for admin approval.',
      request: result.rows[0]
    });

  } catch (error) {
    console.error('Registration request error:', error);
    res.status(500).json({ error: 'Failed to submit registration request' });
  }
};

// Get pending registration requests (Admin only)
export const getPendingRequests = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied. Admin only.' });
    }

    const result = await pool.query(
      `SELECT id, username, email, first_name, last_name, requested_role, reason, created_at
       FROM user_requests 
       WHERE status = 'pending'
       ORDER BY created_at ASC`
    );

    res.json(result.rows);

  } catch (error) {
    console.error('Error fetching pending requests:', error);
    res.status(500).json({ error: 'Failed to fetch pending requests' });
  }
};

// Approve registration request
export const approveRegistrationRequest = async (req, res) => {
  const client = await pool.connect();
  
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied. Admin only.' });
    }

    const { requestId } = req.params;
    const { assignedRole } = req.body; // Admin can assign different role

    // Get the request
    const requestResult = await client.query(
      'SELECT * FROM user_requests WHERE id = $1 AND status = $\'pending\'',
      [requestId]
    );

    if (requestResult.rows.length === 0) {
      return res.status(404).json({ error: 'Pending request not found' });
    }

    const request = requestResult.rows[0];

    await client.query('BEGIN');

    // Create the user account
    const userResult = await client.query(
      `INSERT INTO users (username, email, password, first_name, last_name, role, status, approved_by, approved_at)
       VALUES ($1, $2, $3, $4, $5, $6, 'approved', $7, CURRENT_TIMESTAMP)
       RETURNING id, username, email, first_name, last_name, role, created_at`,
      [
        request.username,
        request.email,
        request.password,
        request.first_name,
        request.last_name,
        assignedRole || request.requested_role,
        req.user.id
      ]
    );

    // Update request status
    await client.query(
      `UPDATE user_requests 
       SET status = 'approved', approved_by = $1, approved_at = CURRENT_TIMESTAMP
       WHERE id = $2`,
      [req.user.id, requestId]
    );

    await client.query('COMMIT');

    res.json({
      message: 'Registration request approved successfully',
      user: userResult.rows[0]
    });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error approving request:', error);
    res.status(500).json({ error: 'Failed to approve registration request' });
  } finally {
    client.release();
  }
};

// Reject registration request
export const rejectRegistrationRequest = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied. Admin only.' });
    }

    const { requestId } = req.params;
    const { rejectionReason } = req.body;

    const result = await pool.query(
      `UPDATE user_requests 
       SET status = 'rejected', 
           rejection_reason = $1, 
           approved_by = $2, 
           approved_at = CURRENT_TIMESTAMP
       WHERE id = $3 AND status = 'pending'
       RETURNING username, email`,
      [rejectionReason, req.user.id, requestId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Pending request not found' });
    }

    res.json({
      message: 'Registration request rejected successfully',
      rejected_user: result.rows[0]
    });

  } catch (error) {
    console.error('Error rejecting request:', error);
    res.status(500).json({ error: 'Failed to reject registration request' });
  }
};