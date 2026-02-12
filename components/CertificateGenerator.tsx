"use client";

import { useRef, useEffect, useState } from "react";
import { generateCertificateId, formatCertificateDate } from "@/lib/certificate";

interface CertificateGeneratorProps {
  wpm: number;
  accuracy: number;
  userName: string;
}

export default function CertificateGenerator({ wpm, accuracy, userName }: CertificateGeneratorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [certificateId] = useState(() => generateCertificateId());
  const [certificateDate] = useState(() => formatCertificateDate());

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size (high resolution for print quality)
    canvas.width = 1200;
    canvas.height = 850;

    // Background gradient (subtle blue-white)
    const bgGradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    bgGradient.addColorStop(0, "#F0F9FF"); // light blue
    bgGradient.addColorStop(1, "#FFFFFF"); // white
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Outer border (gold accent)
    ctx.strokeStyle = "#F59E0B";
    ctx.lineWidth = 8;
    ctx.strokeRect(20, 20, canvas.width - 40, canvas.height - 40);

    // Inner border (teal accent)
    ctx.strokeStyle = "#14B8A6";
    ctx.lineWidth = 4;
    ctx.strokeRect(35, 35, canvas.width - 70, canvas.height - 70);

    // Helper function for centered text
    const drawCenteredText = (text: string, y: number, font: string, color: string) => {
      ctx.font = font;
      ctx.fillStyle = color;
      ctx.textAlign = "center";
      ctx.fillText(text, canvas.width / 2, y);
    };

    // Title
    drawCenteredText("⌨️ TYPING SPEED CERTIFICATE", 120, "bold 48px system-ui", "#1F2937");

    // Decorative line under title
    ctx.strokeStyle = "#3B82F6";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(350, 145);
    ctx.lineTo(850, 145);
    ctx.stroke();

    // Body text
    drawCenteredText("This is to certify that", 220, "24px system-ui", "#4B5563");

    // User name (or "Anonymous Typist" if empty)
    const displayName = userName.trim() || "Anonymous Typist";
    drawCenteredText(displayName, 290, "bold 56px system-ui", "#1F2937");

    // Name underline
    ctx.strokeStyle = "#9CA3AF";
    ctx.lineWidth = 2;
    ctx.beginPath();
    const nameWidth = ctx.measureText(displayName).width;
    ctx.moveTo(canvas.width / 2 - nameWidth / 2, 305);
    ctx.lineTo(canvas.width / 2 + nameWidth / 2, 305);
    ctx.stroke();

    // Achievement text
    drawCenteredText("has demonstrated exceptional typing", 380, "24px system-ui", "#4B5563");
    drawCenteredText("proficiency with a speed of", 420, "24px system-ui", "#4B5563");

    // WPM (highlight)
    drawCenteredText(`${Math.round(wpm)} WPM`, 510, "bold 72px system-ui", "#3B82F6");

    // Accuracy
    drawCenteredText(
      `with ${accuracy.toFixed(1)}% accuracy`,
      575,
      "bold 32px system-ui",
      "#10B981"
    );

    // Footer section
    // Date (left aligned)
    ctx.font = "20px system-ui";
    ctx.fillStyle = "#6B7280";
    ctx.textAlign = "left";
    ctx.fillText(`Date: ${certificateDate}`, 80, 750);

    // Certificate ID (right aligned)
    ctx.textAlign = "right";
    ctx.fillText(`ID: ${certificateId}`, canvas.width - 80, 750);

    // Website/Logo
    ctx.font = "bold 24px system-ui";
    ctx.fillStyle = "#3B82F6";
    ctx.textAlign = "center";
    ctx.fillText("TypingSpeedTest.pro", canvas.width / 2, 790);
  }, [wpm, accuracy, userName, certificateId, certificateDate]);

  const downloadCertificate = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Convert canvas to blob and download
    canvas.toBlob((blob) => {
      if (!blob) return;

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `typing-certificate-${certificateId}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, "image/png");
  };

  return (
    <div className="space-y-6">
      {/* Certificate Preview */}
      <div className="bg-white rounded-lg shadow-xl p-4 overflow-hidden">
        <canvas
          ref={canvasRef}
          className="w-full h-auto border border-gray-200 rounded"
          style={{ maxWidth: "100%" }}
        />
      </div>

      {/* Download Button */}
      <button
        onClick={downloadCertificate}
        className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-4 px-8 rounded-lg transition-all duration-200 transform hover:scale-102 shadow-lg hover:shadow-xl"
      >
        📥 Download Certificate (PNG)
      </button>

      {/* Certificate Details */}
      <div className="text-center text-sm text-gray-500 space-y-1">
        <p>Certificate ID: <span className="font-mono font-semibold text-gray-700">{certificateId}</span></p>
        <p className="text-xs">This certificate can be shared on your resume or LinkedIn profile</p>
      </div>
    </div>
  );
}
