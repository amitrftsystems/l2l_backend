import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../../db/index.js';
import { createLog } from '../utilitesController/logController.js';

export const login = async (req, res) => {
  try {
    const { userId, password } = req.body;
    console.log('Login attempt:', { userId });

    const user = await prisma.user.findFirst({
      where: {
        userId,
      },
    });

    if (!user) {
      console.log('User not found:', { userId });
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      console.log('Invalid password for user:', { userId });
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    console.log('Login successful for user:', { userId, role: user.role });
    await createLog(user.id, 'LOGIN', 'User logged in successfully');
    res.json({
      token,
      user: {
        id: user.id,
        userId: user.userId,
        email: user.email,
        role: user.role,
        name: user.name,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error' });
  }
}; 