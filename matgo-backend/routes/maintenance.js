import express from 'express';
const router = express.Router();

// GET all maintenance records
router.get('/', async (req, res) => {
  // TODO: Replace with real DB logic
  res.json({ maintenance: [] });
});

export default router;
