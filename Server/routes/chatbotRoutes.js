// Server/routes/chatbotRoutes.js
import express from 'express';
import { processChatbotQuery } from '../controllers/chatbotController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/query', verifyToken, processChatbotQuery);

export default router;