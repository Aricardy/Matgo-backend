
import express from 'express';
import Trip from '../models/Trip.js';
const router = express.Router();

router.get('/', async (req, res) => {
  const data = await Trip.findAll();
  res.json(data);
});

router.post('/', async (req, res) => {
  try {
    const record = await Trip.create(req.body);
    res.status(201).json(record);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
