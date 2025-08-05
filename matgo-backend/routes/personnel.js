import express from 'express';
const router = express.Router();

// GET all personnel
router.get('/', async (req, res) => {
  // TODO: Replace with real DB logic
  res.json({ personnel: [] });
});

export default router;
