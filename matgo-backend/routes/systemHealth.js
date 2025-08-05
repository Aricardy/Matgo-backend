import express from 'express';
const router = express.Router();

// GET system health
router.get('/', async (req, res) => {
  // TODO: Replace with real DB logic
  res.json({ health: [] });
});

export default router;
