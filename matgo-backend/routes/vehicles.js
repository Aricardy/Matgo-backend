import express from 'express';
import Matatu from '../models/Matatu.js';

const router = express.Router();

// GET /api/vehicles/:identifier - find matatu by identifier
router.get('/:identifier', async (req, res) => {
  try {
    const matatu = await Matatu.findOne({ where: { identifier: req.params.identifier } });
    if (!matatu) {
      return res.status(404).json({ error: 'Matatu not found' });
    }
    res.json(matatu);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
