import express from 'express';
import { getUserLogs, getAllLogs } from '../controllers/utilitesController/logController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();
router.use(authenticateToken);
router.get('/all', getAllLogs);
router.get('/user/:userId', getUserLogs);

export default router; 