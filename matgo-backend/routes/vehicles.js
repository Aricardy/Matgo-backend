
import express from 'express';
import Matatu from '../models/Matatu.js';
import { Op } from 'sequelize';

const router = express.Router();

// GET /api/vehicles - get all matatus
router.get('/', async (req, res) => {
  try {
    const matatus = await Matatu.findAll();
    res.json({ data: matatus });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/vehicles/:identifier - find matatu by identifier
router.get('/:identifier', async (req, res) => {
  try {
    const identifier = req.params.identifier;
    // Case-insensitive search for identifier (MySQL)
    const matatu = await Matatu.findOne({
      where: sequelize.where(
        sequelize.fn('lower', sequelize.col('identifier')),
        {
          [Op.like]: identifier.toLowerCase()
        }
      )
    });
    if (!matatu) {
      return res.status(404).json({ error: 'Matatu not found' });
    }
    res.json(matatu);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
