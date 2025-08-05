import express from 'express';
import Matatu from '../models/Matatu.js';
const router = express.Router();

// Get all featured matatus
router.get('/', async (req, res) => {
  const featured = await Matatu.findAll({ where: { isFeatured: true } });
  res.json(featured);
});

// Add a featured matatu
router.post('/', async (req, res) => {
  const matatu = await Matatu.create({ ...req.body, isFeatured: true });
  res.json(matatu);
});

// Update a featured matatu
router.put('/:id', async (req, res) => {
  const matatu = await Matatu.findByPk(req.params.id);
  if (!matatu) return res.status(404).json({ error: 'Not found' });
  await matatu.update({ ...req.body, isFeatured: true });
  res.json(matatu);
});

// Remove a featured matatu
router.delete('/:id', async (req, res) => {
  const matatu = await Matatu.findByPk(req.params.id);
  if (!matatu) return res.status(404).json({ error: 'Not found' });
  await matatu.update({ isFeatured: false });
  res.json({ success: true });
});

export default router;
