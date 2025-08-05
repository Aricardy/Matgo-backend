import express from 'express';
const router = express.Router();

// GET all audit logs
router.get('/', async (req, res) => {
  // TODO: Replace with real DB logic
  res.json({ logs: [] });
});

export default router;
