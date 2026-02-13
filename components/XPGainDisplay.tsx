"use client";

import { XPReward } from '@/lib/xp-system';
import XPBar from './XPBar';

interface XPGainDisplayProps {
  reward: XPReward;
  level: number;
  currentLevelXP: number;
  nextLevelXP: number;
  progress: number;
  totalXP: number;
}

export default function XPGainDisplay({
  reward,
  level,
  currentLevelXP,
  nextLevelXP,
  progress,
  totalXP,
}: XPGainDisplayProps) {
  return (
    <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl p-6 border-2 border-purple-200">
      {/* XP Breakdown */}
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-3xl font-black bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            +{reward.totalXP} XP
          </span>
        </div>

        <div className="space-y-1 text-sm">
          <div className="flex items-center gap-2 text-gray-700">
            <span className="text-gray-400">├</span>
            <span>Base: {reward.baseXP} XP</span>
          </div>

          {reward.bonuses.map((bonus, index) => (
            <div key={index} className="flex items-center gap-2 text-gray-700">
              <span className="text-gray-400">
                {index === reward.bonuses.length - 1 ? '└' : '├'}
              </span>
              <span>
                {bonus.reason}: +{bonus.amount} XP
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Progress Bar */}
      <XPBar
        level={level}
        currentLevelXP={currentLevelXP}
        nextLevelXP={nextLevelXP}
        progress={progress}
        totalXP={totalXP}
        compact
        animated
      />
    </div>
  );
}
