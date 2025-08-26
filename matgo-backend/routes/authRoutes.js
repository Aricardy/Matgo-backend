import express from 'express';
import { signupUser, loginUser, getProfile, verifyToken, refreshToken, getMe } from '../controllers/authController.js';
import auth from '../middleware/auth.js';
import upload from '../middleware/upload.js';

const router = express.Router();

// Handle user signup
router.post('/signup', upload.fields([
  { name: 'profilePic', maxCount: 1 },
  { name: 'busPic', maxCount: 1 },
  { name: 'license', maxCount: 1 }
]), signupUser);

// Handle user login
router.post('/login', loginUser);
router.get('/profile', auth, getProfile);
router.post('/verify', verifyToken);

// Handle token refresh
router.post('/refresh-token', refreshToken);

// Whoami endpoint - client can call to verify session/cookie
router.get('/me', getMe);

export default router;
