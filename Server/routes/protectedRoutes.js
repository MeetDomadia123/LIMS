import express from 'express';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/protected', verifyToken, (req, res) => {
  res.json({
    message: 'You have accessed a protected route!',
    user: req.user, // Contains { id, role }
  });
});

export default router;
