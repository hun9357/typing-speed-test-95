"use client";

import { useEffect, useState } from 'react';

interface XPBarProps {
  level: number;
  currentLevelXP: number;
  nextLevelXP: number;
  progress: number;
  totalXP: number;
  compact?: boolean;
  animated?: boolean;
}

export default function XPBar({
  level,
  currentLevelXP,
  nextLevelXP,
  progress,
  totalXP,
  compact = false,
  animated = true,
}: XPBarProps) {
  const [displayProgress, setDisplayProgress] = useState(0);

  // Animate progress bar
  useEffect(() => {
    if (animated) {
      const timeout = setTimeout(() => {
        setDisplayProgress(progress);
      }, 100);
      return () => clearTimeout(timeout);
    } else {
      setDisplayProgress(progress);
    }
  }, [progress, animated]);

  const xpToNextLevel = nextLevelXP - currentLevelXP;

  if (compact) {
    return (
      <div className="flex items-center gap-3">
        <span className="text-sm font-bold text-gray-700 whitespace-nowrap">
          Lv.{level}
        </span>
        <div className="flex-1 min-w-0">
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary to-purple-500 transition-all duration-500 ease-out"
              style={{ width: `${displayProgress}%` }}
            />
          </div>
        </div>
        <span className="text-xs text-gray-500 whitespace-nowrap">
          {totalXP.toLocaleString()} XP
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-black text-gray-800">Lv.{level}</span>
          <span className="text-sm text-gray-500">
            {currentLevelXP.toLocaleString()} / {nextLevelXP.toLocaleString()} XP
          </span>
        </div>
        <span className="text-sm font-medium text-gray-600">
          {Math.floor(progress)}%
        </span>
      </div>

      <div className="relative h-4 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary to-purple-500 transition-all duration-500 ease-out"
          style={{ width: `${displayProgress}%` }}
        />
      </div>

      <div className="text-xs text-gray-500 text-center">
        {xpToNextLevel.toLocaleString()} XP to Level {level + 1}
      </div>
    </div>
  );
}
