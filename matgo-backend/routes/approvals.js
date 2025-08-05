import express from 'express';
const router = express.Router();

// GET all approvals
router.get('/', async (req, res) => {
  // TODO: Replace with real DB logic
  res.json({ approvals: [] });
});

export default router;
