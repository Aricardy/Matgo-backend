
import express from 'express';
import Admin from '../models/Admin.js';
const router = express.Router();

// Simple CRUD endpoints
router.get('/', async (req, res) => {
  const all = await Admin.findAll();
  res.json(all);
});

router.post('/', async (req, res) => {
  const newAdmin = await Admin.create(req.body);
  res.json(newAdmin);
});

export default router;
