import express from 'express';
const router = express.Router();

// GET all reports
router.get('/', async (req, res) => {
  // TODO: Replace with real DB logic
  res.json({ reports: [] });
});

export default router;
