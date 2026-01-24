import React from "react";
import { QRCodeSVG } from "qrcode.react";

interface QRCodeProps {
  value: string;
  size: number;
}

export function QRCode({ value, size }: QRCodeProps) {
  return (
    <QRCodeSVG 
      value={value}
      size={size}
      level="H"
      includeMargin={false}
    />
  );
}