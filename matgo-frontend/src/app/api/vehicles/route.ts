"use server";

import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  try {
    const token = req.headers.get('Authorization');

    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' }, 
        { status: 401 }
      );
    }


  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/matatus`, {
      headers: {
        'Authorization': token,
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Vehicle fetch failed: ${response.statusText}`);
    }

    const data = await response.json();
    return NextResponse.json(data);

  } catch (error: any) {
    console.error('Vehicle API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch vehicles', details: error.message },
      { status: 500 }
    );
  }
}
