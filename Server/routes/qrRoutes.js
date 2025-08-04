// Server/routes/qrRoutes.js
import express from 'express';
import { generateQRCode, processQRScan, getComponentByQR } from '../controllers/qrController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/components/:componentId/qr', verifyToken, generateQRCode);
router.post('/scan', verifyToken, processQRScan);
router.get('/component/:qrCode', verifyToken, getComponentByQR);

export default router;