import prisma from '../../db/index.js';

export const getAllLogs = async (req, res) => {
  try {
    // Only SUPERADMIN and ADMIN can view all logs
    if (req.user.role !== 'SUPERADMIN' && req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Unauthorized access to logs' });
    }

    const logs = await prisma.log.findMany({
      include: {
        user: {
          select: {
            userId: true,
            name: true,
            role: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.json(logs);
  } catch (error) {
    console.error('Error fetching logs:', error);
    res.status(500).json({ error: 'Failed to fetch logs' });
  }
};

export const getUserLogs = async (req, res) => {
  try {
    const userId = req.params.userId;
    
    // Verify if the requesting user has access to these logs
    if (req.user.id !== userId && req.user.role !== 'SUPERADMIN' && req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Unauthorized access to logs' });
    }

    const logs = await prisma.log.findMany({
      where: {
        userId: userId
      },
      include: {
        user: {
          select: {
            userId: true,
            name: true,
            role: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.json(logs);
  } catch (error) {
    console.error('Error fetching logs:', error);
    res.status(500).json({ error: 'Failed to fetch logs' });
  }
};

export const createLog = async (userId, action, details = null) => {
  try {
    await prisma.log.create({
      data: {
        userId,
        action,
        details
      }
    });
  } catch (error) {
    console.error('Error creating log:', error);
  }
}; 