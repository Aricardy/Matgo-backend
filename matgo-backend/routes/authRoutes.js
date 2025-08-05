import express from 'express';
import { register, login, getProfile, verifyToken } from '../controllers/authController.js';
import auth from '../middleware/auth.js';
import upload from '../middleware/upload.js';

const router = express.Router();
router.post('/register', register);
router.post('/signup', upload.fields([
  { name: 'profilePic', maxCount: 1 },
  { name: 'busPic', maxCount: 1 },
  { name: 'license', maxCount: 1 }
]), register);  // Use the same register handler
router.post('/login', login);
router.get('/profile', auth, getProfile);
router.post('/verify', verifyToken);

export default router;
