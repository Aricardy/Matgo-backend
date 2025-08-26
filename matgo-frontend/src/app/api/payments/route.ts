// /api/payments.ts
import { NextResponse } from 'next/server';

/**
 * Initiate payment with M-Pesa
 */
export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { 
      vehicleId,
      vehicleName,
      route,
      totalFare,
      seatCount,
      sacco,
      paymentMethod,
      phoneNumber 
    } = data;

    // Only process M-Pesa payments
    if (paymentMethod !== 'mpesa') {
      return NextResponse.json({ error: 'Unsupported payment method' }, { status: 400 });
    }

    // Validate required fields
    if (!paymentMethod) {
      return NextResponse.json({ error: 'Payment method is required' }, { status: 400 });
    }

    // Format the phone number if needed (ensure it starts with 254)
    const formattedPhone = phoneNumber.startsWith('254') 
      ? phoneNumber
      : phoneNumber.startsWith('0')
        ? `254${phoneNumber.slice(1)}`
        : `254${phoneNumber}`;

    // Call backend M-Pesa API
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/mpesa/pay`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${req.headers.get('Authorization')?.split(' ')[1] || ''}`,
      },
      body: JSON.stringify({
        phoneNumber: formattedPhone,
        amount: totalFare,
        accountReference: vehicleId,
        transactionDesc: `Fare payment for ${vehicleName} - ${route} (${seatCount} seat${seatCount > 1 ? 's' : ''})`
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Payment failed');
    }

    const result = await response.json();
    return NextResponse.json(result);

  } catch (error: any) {
    console.error('Payment error:', error);
    return NextResponse.json(
      { error: 'Payment failed', details: error.message },
      { status: 500 }
    );
  }
}
