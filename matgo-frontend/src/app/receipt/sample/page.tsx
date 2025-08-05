"use client";

import ReceiptQRCode from "@/components/ReceiptQRCode";
import React from "react";

function MatatusList() {
  const [matatus, setMatatus] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    fetch("/api/matatus")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch matatus");
        return res.json();
      })
      .then((data) => {
        setMatatus(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading matatus...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="mt-10 max-w-2xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Matatus List (from /api/matatus)</h2>
      <ul className="space-y-4">
        {matatus.map((matatu: any) => (
          <li key={matatu.id} className="border p-4 rounded-lg shadow flex items-center justify-between">
            <div className="font-semibold">{matatu.plateNumber} - {matatu.model}</div>
            <ReceiptQRCode value={matatu.plateNumber} />
            <button className="ml-4 px-4 py-2 bg-primary text-white rounded">Pay</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function ReceiptSamplePageWithMatatus() {
  return <MatatusList />;
}
