/**
 * XP and Leveling System
 * Manages experience points, level progression, and test rewards
 */

export interface XPData {
  totalXP: number;
  level: number;
}

export interface LevelInfo {
  level: number;
  currentLevelXP: number; // XP earned in current level
  nextLevelXP: number; // XP needed to reach next level
  progress: number; // Progress percentage (0-100)
  totalXP: number;
}

export interface XPBonus {
  reason: string;
  amount: number;
}

export interface XPReward {
  baseXP: number;
  bonuses: XPBonus[];
  totalXP: number;
}

/**
 * Calculate XP required for a specific level
 * Formula: level^1.5 * 100
 */
export function xpForLevel(level: number): number {
  return Math.floor(Math.pow(level, 1.5) * 100);
}

/**
 * Calculate cumulative XP needed to reach a level
 */
export function cumulativeXPForLevel(level: number): number {
  let total = 0;
  for (let i = 1; i < level; i++) {
    total += xpForLevel(i);
  }
  return total;
}

/**
 * Calculate current level and progress from total XP
 */
export function calculateLevel(totalXP: number): LevelInfo {
  let level = 1;
  let cumulativeXP = 0;

  // Find current level
  while (cumulativeXP + xpForLevel(level) <= totalXP) {
    cumulativeXP += xpForLevel(level);
    level++;
  }

  const currentLevelXP = totalXP - cumulativeXP;
  const nextLevelXP = xpForLevel(level);
  const progress = (currentLevelXP / nextLevelXP) * 100;

  return {
    level,
    currentLevelXP,
    nextLevelXP,
    progress: Math.min(progress, 100),
    totalXP,
  };
}

/**
 * Calculate XP earned from completing a test
 */
export function calculateTestXP(
  wpm: number,
  accuracy: number,
  mode: string,
  streakDays: number
): XPReward {
  const bonuses: XPBonus[] = [];
  const baseXP = 50;

  // WPM bonus: 0.5 XP per WPM
  const wpmBonus = Math.floor(wpm * 0.5);
  if (wpmBonus > 0) {
    bonuses.push({
      reason: `Speed Bonus (${wpm} WPM)`,
      amount: wpmBonus,
    });
  }

  // Accuracy bonuses
  if (accuracy >= 95) {
    bonuses.push({
      reason: 'High Accuracy (95%+)',
      amount: 50,
    });
  }
  if (accuracy >= 98) {
    bonuses.push({
      reason: 'Exceptional Accuracy (98%+)',
      amount: 50,
    });
  }
  if (accuracy === 100) {
    bonuses.push({
      reason: 'Perfect Accuracy (100%)',
      amount: 100,
    });
  }

  // Daily mode 2x multiplier
  const subtotal = baseXP + bonuses.reduce((sum, b) => sum + b.amount, 0);
  if (mode === 'daily') {
    const dailyBonus = subtotal;
    bonuses.push({
      reason: 'Daily Challenge 2x',
      amount: dailyBonus,
    });
  }

  // Streak bonus (up to 10 days, 10% per day)
  const effectiveStreak = Math.min(streakDays, 10);
  if (effectiveStreak > 0) {
    const preStreakTotal = baseXP + bonuses.reduce((sum, b) => sum + b.amount, 0);
    const streakBonus = Math.floor(preStreakTotal * (effectiveStreak * 0.1));
    if (streakBonus > 0) {
      bonuses.push({
        reason: `${effectiveStreak}-Day Streak`,
        amount: streakBonus,
      });
    }
  }

  const totalXP = baseXP + bonuses.reduce((sum, b) => sum + b.amount, 0);

  return {
    baseXP,
    bonuses,
    totalXP,
  };
}

/**
 * Check if leveling up from oldXP to newXP
 */
export function checkLevelUp(oldXP: number, newXP: number): {
  leveledUp: boolean;
  oldLevel: number;
  newLevel: number;
} {
  const oldLevel = calculateLevel(oldXP).level;
  const newLevel = calculateLevel(newXP).level;

  return {
    leveledUp: newLevel > oldLevel,
    oldLevel,
    newLevel,
  };
}
