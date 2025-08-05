
import express from 'express';
import Matatu from '../models/Matatu.js';
const router = express.Router();

router.get('/', async (req, res) => {
  const data = await Matatu.findAll();
  res.json(data);
});

router.post('/', async (req, res) => {
  try {
    const record = await Matatu.create(req.body);
    res.status(201).json(record);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
