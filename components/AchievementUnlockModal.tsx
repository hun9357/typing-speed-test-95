"use client";

import { useEffect, useState } from 'react';
import { AchievementDef, AchievementTier } from '@/lib/achievements';
import confetti from 'canvas-confetti';

interface AchievementUnlockModalProps {
  achievement: AchievementDef;
  onClose: () => void;
}

const TIER_STYLES: Record<
  AchievementTier,
  { bg: string; border: string; text: string }
> = {
  bronze: {
    bg: 'bg-gradient-to-br from-orange-100 to-amber-50',
    border: 'border-orange-300',
    text: 'text-orange-700',
  },
  silver: {
    bg: 'bg-gradient-to-br from-gray-100 to-slate-50',
    border: 'border-gray-300',
    text: 'text-gray-700',
  },
  gold: {
    bg: 'bg-gradient-to-br from-yellow-100 to-amber-50',
    border: 'border-yellow-400',
    text: 'text-yellow-700',
  },
  diamond: {
    bg: 'bg-gradient-to-br from-purple-100 to-blue-50',
    border: 'border-purple-400',
    text: 'text-purple-700',
  },
};

export default function AchievementUnlockModal({
  achievement,
  onClose,
}: AchievementUnlockModalProps) {
  const [bounce, setBounce] = useState(true);
  const tierStyle = TIER_STYLES[achievement.tier];

  useEffect(() => {
    // Fire confetti for gold/diamond tiers
    if (achievement.tier === 'gold' || achievement.tier === 'diamond') {
      const colors = achievement.tier === 'gold'
        ? ['#FFD700', '#FFA500', '#FF8C00']
        : ['#9333EA', '#3B82F6', '#EC4899'];

      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors,
      });
    }

    // Stop bounce animation after 1 second
    const timeout = setTimeout(() => setBounce(false), 1000);
    return () => clearTimeout(timeout);
  }, [achievement.tier]);

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl shadow-2xl p-8 max-w-sm w-full animate-fadeIn"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Title */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-black text-gray-800 mb-1">
            ✨ Achievement Unlocked! ✨
          </h2>
        </div>

        {/* Icon & Name */}
        <div
          className={`${tierStyle.bg} border-2 ${tierStyle.border} rounded-2xl p-8 mb-4`}
        >
          <div className={`text-6xl text-center mb-3 ${bounce ? 'animate-bounce' : ''}`}>
            {achievement.icon}
          </div>
          <div className="text-center">
            <h3 className="text-xl font-bold text-gray-800 mb-1">
              {achievement.name}
            </h3>
            <p className={`text-xs uppercase tracking-wider font-bold ${tierStyle.text}`}>
              {achievement.tier}
            </p>
          </div>
        </div>

        {/* Description */}
        <p className="text-center text-gray-600 mb-4">
          {achievement.description}
        </p>

        {/* XP Reward */}
        <div className="bg-gradient-to-r from-primary to-purple-500 rounded-xl p-3 mb-6 text-center">
          <div className="text-white font-bold">
            +{achievement.xpReward} XP
          </div>
        </div>

        {/* Button */}
        <button
          onClick={onClose}
          className="w-full bg-primary hover:bg-primary-dark text-white font-bold rounded-xl px-8 py-3 transition-colors"
        >
          Awesome!
        </button>
      </div>
    </div>
  );
}
