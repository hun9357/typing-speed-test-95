"use client";

import { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';

interface LevelUpModalProps {
  oldLevel: number;
  newLevel: number;
  totalXP: number;
  nextLevelXP: number;
  onClose: () => void;
}

export default function LevelUpModal({
  oldLevel,
  newLevel,
  totalXP,
  nextLevelXP,
  onClose,
}: LevelUpModalProps) {
  const [displayLevel, setDisplayLevel] = useState(oldLevel);

  useEffect(() => {
    // Fire confetti
    confetti({
      particleCount: 150,
      spread: 100,
      origin: { y: 0.5 },
      colors: ['#FFD700', '#FFA500', '#FF6347', '#FF69B4'],
    });

    // Animate level counter
    const duration = 1000;
    const steps = newLevel - oldLevel;
    const stepDuration = duration / steps;

    let current = oldLevel;
    const interval = setInterval(() => {
      current++;
      setDisplayLevel(current);
      if (current >= newLevel) {
        clearInterval(interval);
      }
    }, stepDuration);

    return () => clearInterval(interval);
  }, [oldLevel, newLevel]);

  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-gradient-to-br from-yellow-50 via-white to-purple-50 rounded-3xl shadow-2xl p-8 max-w-md w-full border-2 border-yellow-300 animate-fadeIn"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Decorative Lines */}
        <div className="text-center mb-6">
          <div className="text-yellow-600 text-xl mb-2">
            ═══════════════════════
          </div>
          <h2 className="text-3xl font-black bg-gradient-to-r from-yellow-600 to-purple-600 bg-clip-text text-transparent">
            ⬆️ LEVEL UP! ⬆️
          </h2>
          <div className="text-yellow-600 text-xl mt-2">
            ═══════════════════════
          </div>
        </div>

        {/* Level Display */}
        <div className="flex items-center justify-center gap-6 my-8">
          <div className="text-6xl font-black text-gray-400 animate-pulse">
            {oldLevel}
          </div>
          <div className="text-4xl text-yellow-600 animate-bounce">→</div>
          <div className="text-7xl font-black bg-gradient-to-r from-yellow-600 to-purple-600 bg-clip-text text-transparent animate-scale">
            {displayLevel}
          </div>
        </div>

        {/* Stats */}
        <div className="bg-white/60 rounded-xl p-4 mb-6 space-y-2 border border-gray-200">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Total XP</span>
            <span className="font-bold text-gray-800">
              {totalXP.toLocaleString()}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Next Level</span>
            <span className="font-bold text-gray-800">
              {nextLevelXP.toLocaleString()} XP
            </span>
          </div>
        </div>

        {/* Button */}
        <button
          onClick={onClose}
          className="w-full bg-gradient-to-r from-yellow-500 to-purple-500 hover:from-yellow-600 hover:to-purple-600 text-white font-bold rounded-xl px-8 py-3 transition-all"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
