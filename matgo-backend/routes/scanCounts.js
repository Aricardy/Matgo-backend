import express from 'express';
import { incrementBusScanCount, getBusScanCount } from '../models/BusScanCount.js';
import authenticateToken from '../middleware/auth.js';

const router = express.Router();

// Increment scan count for a user-bus pair
router.post('/scan', authenticateToken, async (req, res) => {
  const userId = req.user?.id;
  const { busId } = req.body;
  if (!userId || !busId) return res.status(400).json({ error: 'Missing userId or busId' });
  try {
    await incrementBusScanCount(userId, busId);
    const scanCount = await getBusScanCount(userId, busId);
    res.json({ scanCount });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update scan count' });
  }
});

// Get scan count for a user-bus pair
router.get('/scan-count', authenticateToken, async (req, res) => {
  const userId = req.user?.id;
  const { busId } = req.query;
  if (!userId || !busId) return res.status(400).json({ error: 'Missing userId or busId' });
  try {
    const scanCount = await getBusScanCount(userId, busId);
    res.json({ scanCount });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch scan count' });
  }
});

export default router;
