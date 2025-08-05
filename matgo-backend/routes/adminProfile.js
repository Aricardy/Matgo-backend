import express from 'express';
const router = express.Router();

// GET admin profile
router.get('/', async (req, res) => {
  // TODO: Replace with real DB logic
  res.json({ profile: null });
});

export default router;
