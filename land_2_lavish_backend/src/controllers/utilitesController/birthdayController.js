import express from 'express';
import prisma from '../../db/index.js';

const router = express.Router();

export const getBirthdayUsers = async (req, res) => {
    try {
      let users;
      users = await prisma.user.findMany({
        where: {
          role: {
            not: 'SUPERADMIN'
          }
        },
        select: {
          id: true,
          userId: true,
          email: true,
          name: true,
          role: true,
          addharCard: true,
          dob: true,
          mobile: true,
          createdAt: true,
        },
      });
      
      res.json(users);
    } catch (error) {
      console.error('Get users error:', error);
      res.status(500).json({ error: 'Server error' });
    }
  };