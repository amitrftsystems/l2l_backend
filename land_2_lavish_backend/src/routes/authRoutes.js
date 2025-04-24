import express from 'express';
import { login } from '../controllers/loginController/authController.js';

const router = express.Router();

// Login route
router.post('/login', login);

export default router; 