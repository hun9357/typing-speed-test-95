"use client";

import { useState, useRef, useEffect } from 'react';
import { useProfile } from '@/hooks/useProfile';
import { useXP } from '@/hooks/useXP';
import { useStreak } from '@/hooks/useStreak';

interface ShareResultCardProps {
  wpm: number;
  accuracy: number;
  onClose: () => void;
}

export default function ShareResultCard({ wpm, accuracy, onClose }: ShareResultCardProps) {
  const [copySuccess, setCopySuccess] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { profile } = useProfile();
  const { level } = useXP();
  const { streakData } = useStreak();

  // Generate canvas image
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = 600;
    canvas.height = 400;

    // Background gradient
    const gradient = ctx.createLinearGradient(0, 0, 600, 400);
    gradient.addColorStop(0, '#1f2937'); // gray-900
    gradient.addColorStop(1, '#581c87'); // purple-900
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 600, 400);

    // Title
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 32px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('⌨️ Typing Speed Test', 300, 60);

    // Avatar circle
    if (profile) {
      ctx.fillStyle = profile.avatar.bgColor;
      ctx.beginPath();
      ctx.arc(150, 150, 40, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 28px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(profile.avatar.initial, 150, 160);

      // Nickname
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 24px sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(profile.nickname, 210, 155);
    }

    // Stats section
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 48px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`${wpm} WPM`, 200, 260);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 48px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`${accuracy.toFixed(1)}%`, 420, 260);

    // Labels
    ctx.fillStyle = '#d1d5db'; // gray-300
    ctx.font = '18px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Speed', 200, 290);
    ctx.fillText('Accuracy', 420, 290);

    // Level and streak
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 20px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`Level ${level}`, 200, 330);
    if (streakData.currentStreak > 0) {
      ctx.fillText(`🔥 ${streakData.currentStreak}-day streak`, 420, 330);
    }

    // Footer
    ctx.fillStyle = '#9ca3af'; // gray-400
    ctx.font = '16px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('typingspeedtest.pro', 300, 370);
  }, [profile, wpm, accuracy, level, streakData.currentStreak]);

  const handleCopyText = async () => {
    const text = `Typing Speed Test ⌨️
━━━━━━━━━━━━━━
⚡ ${wpm} WPM | 🎯 ${accuracy.toFixed(1)}%
${streakData.currentStreak > 0 ? `🔥 ${streakData.currentStreak}-day streak` : ''}
🏆 Level ${level}
━━━━━━━━━━━━━━
typingspeedtest.pro`;

    try {
      await navigator.clipboard.writeText(text);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  const handleDownloadImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    try {
      canvas.toBlob((blob) => {
        if (!blob) return;

        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.download = `typing-speed-${wpm}wpm.png`;
        link.href = url;
        link.click();
        URL.revokeObjectURL(url);

        setDownloadSuccess(true);
        setTimeout(() => setDownloadSuccess(false), 2000);
      });
    } catch (err) {
      console.error('Failed to download image:', err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">📤 Share Your Result</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Canvas Preview */}
        <div className="bg-gray-100 rounded-xl p-4 mb-6">
          <canvas
            ref={canvasRef}
            className="w-full h-auto rounded-lg"
            style={{ maxHeight: '400px' }}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
            onClick={handleCopyText}
            className="flex-1 bg-primary hover:bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
          >
            {copySuccess ? (
              <>
                <span>✓</span>
                <span>Copied!</span>
              </>
            ) : (
              <>
                <span>📋</span>
                <span>Copy Text</span>
              </>
            )}
          </button>
          <button
            onClick={handleDownloadImage}
            className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
          >
            {downloadSuccess ? (
              <>
                <span>✓</span>
                <span>Downloaded!</span>
              </>
            ) : (
              <>
                <span>📥</span>
                <span>Download Image</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
