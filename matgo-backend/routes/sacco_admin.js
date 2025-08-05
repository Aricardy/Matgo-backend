
import express from 'express';
import { registerSaccoAdmin, getSaccoAdminProfile, updateSaccoAdminProfile } from '../controllers/saccoAdminController.js';
import upload from '../middleware/upload.js';

const router = express.Router();

// Get all saccos (for admin dashboard)
router.get('/', async (req, res) => {
  try {
    // For now, return empty array - can be implemented later with actual sacco data
    res.json([]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Register new sacco admin
router.post('/register', upload.fields([
  { name: 'avatar', maxCount: 1 },
  { name: 'workIdImage', maxCount: 1 },
  { name: 'nationalIdImage', maxCount: 1 }
]), registerSaccoAdmin);

// Get sacco admin profile
router.get('/profile/:id', getSaccoAdminProfile);

// Update sacco admin profile
router.put('/profile/:id', upload.single('avatar'), updateSaccoAdminProfile);

// Apply to become a system admin
router.post('/apply-admin', async (req, res) => {
  try {
    // Just a placeholder action, save intent in DB or notify superadmin
    res.json({ message: 'Your application to become a system admin has been received!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
