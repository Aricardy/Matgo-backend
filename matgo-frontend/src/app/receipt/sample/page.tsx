"use client";

import ReceiptQRCode from "@/components/ReceiptQRCode";
import React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function ReceiptSamplePage() {
  const [matatus, setMatatus] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    fetch("/api/long-distance")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch buses");
        return res.json();
      })
      .then((data) => {
        setMatatus(data.data || []);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  // Get URL parameters for receipt details
  const searchParams = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
  const route = searchParams.get('route');
  const date = searchParams.get('date');
  const time = searchParams.get('time');
  const seats = searchParams.get('seats')?.split(',') || [];
  const price = searchParams.get('price');
  const passengers = searchParams.get('passengers')?.split(',') || [];
  const paymentMethod = searchParams.get('paymentMethod');
  const vehicleInfo = searchParams.get('vehicleInfo');
  const vehicleImage = searchParams.get('vehicleImage');
  const sacco = searchParams.get('sacco');
  const tripType = searchParams.get('tripType');
  const bookingId = searchParams.get('bookingId');

  const handlePayment = async () => {
    try {
      const response = await fetch('/api/mpesa/stkpush', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: price,
          phone: '254712345678', // This should be collected from the user
          bookingId: bookingId,
        }),
      });

      if (!response.ok) {
        throw new Error('Payment initiation failed');
      }

      const data = await response.json();
      console.log('Payment initiated:', data);
      // Show payment instructions or success message
    } catch (error) {
      console.error('Payment error:', error);
      // Show error message to user
    }
  };

  if (loading) return <div className="p-8">Loading buses...</div>;
  if (error) return <div className="p-8 text-red-500">Error: {error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-lg">
        <div className="flex flex-col gap-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800">{vehicleInfo}</h1>
            <p className="text-gray-600">{sacco} - {tripType}</p>
          </div>

          <div className="border-t border-b py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-600">Date:</p>
                <p className="font-semibold">{date}</p>
              </div>
              <div>
                <p className="text-gray-600">Time:</p>
                <p className="font-semibold">{time}</p>
              </div>
            </div>
          </div>

          <div>
            <p className="text-gray-600">Seats:</p>
            <div className="flex gap-2 flex-wrap">
              {seats.map((seat) => (
                <span key={seat} className="px-3 py-1 bg-primary/10 rounded-full text-primary">
                  {seat}
                </span>
              ))}
            </div>
          </div>

          <div>
            <p className="text-gray-600">Passengers:</p>
            <div className="flex gap-2 flex-wrap">
              {passengers.map((passenger) => (
                <span key={passenger} className="px-3 py-1 bg-gray-100 rounded-full">
                  {passenger}
                </span>
              ))}
            </div>
          </div>

          <div className="border-t pt-4">
            <p className="text-gray-600">Total Amount:</p>
            <p className="text-2xl font-bold text-primary">KES {price}</p>
          </div>

          <div className="flex flex-col gap-4">
            <Button 
              onClick={handlePayment}
              className="w-full"
            >
              Pay with {paymentMethod}
            </Button>
            <div className="text-center">
              <p className="text-sm text-gray-500">Booking ID: {bookingId}</p>
            </div>
          </div>

          <div className="mt-4 text-center">
            <ReceiptQRCode value={`BOOKING:${bookingId}`} />
          </div>
        </div>
      </Card>
    </div>
  );
}
