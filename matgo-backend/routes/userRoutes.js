import express from 'express';
import { getFavoriteRoutes, getAllUsers } from '../controllers/userController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.get('/favorites/routes', auth, getFavoriteRoutes);
router.get('/', getAllUsers);

export default router;
