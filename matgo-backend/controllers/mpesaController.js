import { initiateSTKPush } from '../config/mpesa.js';

/**
 * Handle M-Pesa payment initiation
 */
export async function initiatePayment(req, res) {
  try {
    const { phoneNumber, amount, accountReference } = req.body;

    // Validate required fields
    if (!phoneNumber || !amount) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'Phone number and amount are required'
      });
    }

    // Format phone number to international format if needed
    const formattedPhone = phoneNumber.startsWith('+254') 
      ? phoneNumber 
      : phoneNumber.startsWith('0')
        ? `+254${phoneNumber.slice(1)}`
        : `+254${phoneNumber}`;

    // Initiate STK Push
    const response = await initiateSTKPush({
      phoneNumber: formattedPhone,
      amount: parseInt(amount),
      accountReference: accountReference || 'MatGo Payment'
    });

    res.json({
      message: 'Payment initiated successfully',
      data: response
    });
  } catch (error) {
    console.error('Payment initiation failed:', error);
    res.status(500).json({
      error: 'Payment initiation failed',
      message: error.message
    });
  }
}

/**
 * Handle M-Pesa callback
 */
export async function handleCallback(req, res) {
  try {
    const { Body: { stkCallback } } = req.body;
    
    // Log callback for debugging
    console.log('M-Pesa Callback received:', JSON.stringify(stkCallback, null, 2));

    // Check if transaction was successful
    const success = stkCallback.ResultCode === 0;

    if (success) {
      // Extract transaction details
      const { MerchantRequestID, CheckoutRequestID, CallbackMetadata } = stkCallback;
      
      // Process payment details
      const paymentDetails = CallbackMetadata.Item.reduce((acc, item) => {
        acc[item.Name] = item.Value;
        return acc;
      }, {});

      // TODO: Update transaction status in database
      // await updateTransactionStatus(MerchantRequestID, 'completed', paymentDetails);
      
      // Always respond with success to M-Pesa
      res.json({ ResultCode: 0, ResultDesc: 'Success' });
    } else {
      // Log failed transaction
      console.error('M-Pesa transaction failed:', stkCallback.ResultDesc);
      
      // TODO: Update transaction status in database
      // await updateTransactionStatus(stkCallback.MerchantRequestID, 'failed', stkCallback);
      
      // Still respond with success to acknowledge receipt
      res.json({ ResultCode: 0, ResultDesc: 'Success' });
    }
  } catch (error) {
    console.error('M-Pesa callback processing failed:', error);
    
    // Always respond with success to M-Pesa even if we have internal errors
    res.json({ ResultCode: 0, ResultDesc: 'Success' });
  }
}

export default {
  initiatePayment,
  handleCallback
};
