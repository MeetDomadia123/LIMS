// Server/routes/registrationRoutes.js
import express from 'express';
import { 
  submitRegistrationRequest, 
  getPendingRequests, 
  approveRegistrationRequest, 
  rejectRegistrationRequest 
} from '../controllers/registrationController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/request', submitRegistrationRequest);
router.get('/pending', verifyToken, getPendingRequests);
router.post('/approve/:requestId', verifyToken, approveRegistrationRequest);
router.post('/reject/:requestId', verifyToken, rejectRegistrationRequest);

export default router;