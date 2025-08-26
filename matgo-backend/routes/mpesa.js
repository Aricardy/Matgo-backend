import express from 'express';
import { initiatePayment, handleCallback } from '../controllers/mpesaController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Initiate M-Pesa payment
router.post('/pay', auth, initiatePayment);

// Handle M-Pesa callback
router.post('/callback', handleCallback);

export default router;
