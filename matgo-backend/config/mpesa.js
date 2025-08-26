import axios from 'axios';

/**
 * Get Safaricom M-Pesa access token
 * @returns {Promise<string>} Access token
 */
export async function getAccessToken() {
  const consumerKey = process.env.MPESA_CONSUMER_KEY;
  const consumerSecret = process.env.MPESA_CONSUMER_SECRET;
  
  if (!consumerKey || !consumerSecret) {
    throw new Error('Missing M-Pesa API credentials');
  }

  // Create auth buffer and encode to base64
  const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64');

  try {
    const response = await axios.get(process.env.MPESA_TOKEN_URL, {
      headers: {
        'Authorization': `Basic ${auth}`
      }
    });

    return response.data.access_token;
  } catch (error) {
    throw new Error(`Failed to get access token: ${error.message}`);
  }
}

/**
 * Initiate STK Push payment request
 * @param {Object} params Payment parameters 
 * @returns {Promise<Object>} STK Push response
 */
export async function initiateSTKPush(params) {
  const { 
    phoneNumber,
    amount,
    accountReference,
    transactionDesc
  } = params;

  // Validate required env variables
  const requiredEnvVars = [
    'MPESA_PASSKEY',
    'MPESA_SHORTCODE',
    'MPESA_STK_URL'
  ];

  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      throw new Error(`Missing required env variable: ${envVar}`);
    }
  }

  // Generate timestamp
  const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, -3);
  
  // Generate password
  const password = Buffer.from(
    process.env.MPESA_SHORTCODE + 
    process.env.MPESA_PASSKEY + 
    timestamp
  ).toString('base64');

  try {
    const accessToken = await getAccessToken();

    const response = await axios.post(process.env.MPESA_STK_URL, {
      BusinessShortCode: process.env.MPESA_SHORTCODE,
      Password: password,
      Timestamp: timestamp,
      TransactionType: 'CustomerPayBillOnline',
      Amount: amount,
      PartyA: phoneNumber,
      PartyB: process.env.MPESA_SHORTCODE,
      PhoneNumber: phoneNumber,
      CallBackURL: `${process.env.BASE_URL}/api/mpesa/callback`,
      AccountReference: accountReference,
      TransactionDesc: transactionDesc || 'MatGo Payment'
    }, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });

    return response.data;
  } catch (error) {
    throw new Error(`STK Push failed: ${error.message}`);
  }
}

export default {
  getAccessToken,
  initiateSTKPush
};
