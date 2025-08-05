// QRCode.tsx
import React from "react";
import { QRCodeCanvas } from "qrcode.react";

export default function ReceiptQRCode({ value }: { value: string }) {
  return (
    <div style={{ textAlign: "center", margin: "1rem 0" }}>
      <QRCodeCanvas value={value} size={128} level="H" includeMargin={true} />
    </div>
  );
}
