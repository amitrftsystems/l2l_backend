import express from 'express';
import { createUser, getUsers, updateUser, deleteUser, resetPassword } from '../controllers/loginController/userController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

router.post('/add-user', createUser);
router.get('/get-users', getUsers);
router.put('/update-users/:id', updateUser);
router.delete('/delete-users/:id', deleteUser);
router.post('/reset-password/:id', resetPassword);

export default router; 