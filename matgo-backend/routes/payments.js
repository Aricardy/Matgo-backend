import express from 'express';
import { initiatePayment, handleCallback } from '../controllers/mpesaController.js';

const router = express.Router();

// Route for initiating payments
router.post('/', initiatePayment);

// M-Pesa callback URL
router.post('/mpesa/callback', handleCallback);

export default router;
