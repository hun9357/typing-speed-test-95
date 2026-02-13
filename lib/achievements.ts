/**
 * Achievement System
 * Defines 30+ achievements and unlock logic
 */

import { TestRecord } from './test-recorder';

export type AchievementCategory =
  | 'speed'
  | 'accuracy'
  | 'endurance'
  | 'streak'
  | 'explorer'
  | 'special';

export type AchievementTier = 'bronze' | 'silver' | 'gold' | 'diamond';

export interface AchievementDef {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: AchievementCategory;
  tier: AchievementTier;
  condition: (ctx: AchievementContext) => boolean;
  xpReward: number;
  hidden?: boolean;
  progress?: (ctx: AchievementContext) => { current: number; target: number } | null;
}

export interface AchievementContext {
  // Speed metrics
  bestWpm: number;

  // Accuracy metrics
  bestAccuracy: number;
  perfectTests: number;

  // Streak data
  currentStreak: number;
  longestStreak: number;

  // Volume metrics
  totalTests: number;

  // Exploration
  modesPlayed: number;
  codeLangsPlayed: number;
  simCategoriesPlayed: number;

  // Battle stats
  battlesPlayed: number;
  battlesWon: number;

  // Special
  dailyChallengesCompleted: number;
  certificatesEarned: number;
  testedAfterMidnight: boolean;
  testedBefore6am: boolean;
  weekendTests: number;
  wpmImproved20: boolean;

  // For progress tracking
  firstTestWpm?: number;
}

export interface UnlockedAchievement {
  achievementId: string;
  unlockedAt: string;
}

/**
 * All 30+ achievement definitions
 */
export const ACHIEVEMENTS: AchievementDef[] = [
  // ===== Speed (5) =====
  {
    id: 'speed-30',
    name: 'Getting Started',
    description: 'Reach 30 WPM in any test',
    icon: '⌨️',
    category: 'speed',
    tier: 'bronze',
    xpReward: 50,
    condition: (ctx) => ctx.bestWpm >= 30,
    progress: (ctx) => ({ current: Math.min(ctx.bestWpm, 30), target: 30 }),
  },
  {
    id: 'speed-50',
    name: 'Steady Hands',
    description: 'Reach 50 WPM in any test',
    icon: '🏃',
    category: 'speed',
    tier: 'bronze',
    xpReward: 100,
    condition: (ctx) => ctx.bestWpm >= 50,
    progress: (ctx) => ({ current: Math.min(ctx.bestWpm, 50), target: 50 }),
  },
  {
    id: 'speed-80',
    name: 'Speed Demon',
    description: 'Reach 80 WPM in any test',
    icon: '⚡',
    category: 'speed',
    tier: 'silver',
    xpReward: 200,
    condition: (ctx) => ctx.bestWpm >= 80,
    progress: (ctx) => ({ current: Math.min(ctx.bestWpm, 80), target: 80 }),
  },
  {
    id: 'speed-100',
    name: 'Century Club',
    description: 'Reach 100 WPM in any test',
    icon: '💯',
    category: 'speed',
    tier: 'gold',
    xpReward: 500,
    condition: (ctx) => ctx.bestWpm >= 100,
    progress: (ctx) => ({ current: Math.min(ctx.bestWpm, 100), target: 100 }),
  },
  {
    id: 'speed-120',
    name: 'Lightning Fingers',
    description: 'Reach 120 WPM in any test',
    icon: '🌩️',
    category: 'speed',
    tier: 'diamond',
    xpReward: 1000,
    condition: (ctx) => ctx.bestWpm >= 120,
    progress: (ctx) => ({ current: Math.min(ctx.bestWpm, 120), target: 120 }),
  },

  // ===== Accuracy (4) =====
  {
    id: 'acc-95',
    name: 'Sharp Shooter',
    description: 'Achieve 95%+ accuracy in any test',
    icon: '🎯',
    category: 'accuracy',
    tier: 'bronze',
    xpReward: 100,
    condition: (ctx) => ctx.bestAccuracy >= 95,
  },
  {
    id: 'acc-98',
    name: 'Precision Master',
    description: 'Achieve 98%+ accuracy in any test',
    icon: '🔬',
    category: 'accuracy',
    tier: 'silver',
    xpReward: 200,
    condition: (ctx) => ctx.bestAccuracy >= 98,
  },
  {
    id: 'acc-100',
    name: 'Perfection',
    description: 'Achieve 100% accuracy in any test',
    icon: '💎',
    category: 'accuracy',
    tier: 'gold',
    xpReward: 500,
    condition: (ctx) => ctx.bestAccuracy === 100,
  },
  {
    id: 'perfect-5',
    name: 'Flawless Five',
    description: 'Complete 5 tests with 100% accuracy',
    icon: '✨',
    category: 'accuracy',
    tier: 'diamond',
    xpReward: 1000,
    condition: (ctx) => ctx.perfectTests >= 5,
    progress: (ctx) => ({ current: Math.min(ctx.perfectTests, 5), target: 5 }),
  },

  // ===== Streak (4) =====
  {
    id: 'streak-3',
    name: 'Hat Trick',
    description: 'Maintain a 3-day streak',
    icon: '🔥',
    category: 'streak',
    tier: 'bronze',
    xpReward: 100,
    condition: (ctx) => ctx.longestStreak >= 3,
    progress: (ctx) => ({ current: Math.min(ctx.currentStreak, 3), target: 3 }),
  },
  {
    id: 'streak-7',
    name: 'Week Warrior',
    description: 'Maintain a 7-day streak',
    icon: '⚔️',
    category: 'streak',
    tier: 'silver',
    xpReward: 300,
    condition: (ctx) => ctx.longestStreak >= 7,
    progress: (ctx) => ({ current: Math.min(ctx.currentStreak, 7), target: 7 }),
  },
  {
    id: 'streak-14',
    name: 'Fortnight Force',
    description: 'Maintain a 14-day streak',
    icon: '🛡️',
    category: 'streak',
    tier: 'gold',
    xpReward: 500,
    condition: (ctx) => ctx.longestStreak >= 14,
    progress: (ctx) => ({ current: Math.min(ctx.currentStreak, 14), target: 14 }),
  },
  {
    id: 'streak-30',
    name: 'Monthly Master',
    description: 'Maintain a 30-day streak',
    icon: '👑',
    category: 'streak',
    tier: 'diamond',
    xpReward: 1000,
    condition: (ctx) => ctx.longestStreak >= 30,
    progress: (ctx) => ({ current: Math.min(ctx.currentStreak, 30), target: 30 }),
  },

  // ===== Endurance (4) =====
  {
    id: 'tests-10',
    name: 'Warm Up',
    description: 'Complete 10 typing tests',
    icon: '🏋️',
    category: 'endurance',
    tier: 'bronze',
    xpReward: 50,
    condition: (ctx) => ctx.totalTests >= 10,
    progress: (ctx) => ({ current: Math.min(ctx.totalTests, 10), target: 10 }),
  },
  {
    id: 'tests-50',
    name: 'Dedicated',
    description: 'Complete 50 typing tests',
    icon: '📚',
    category: 'endurance',
    tier: 'silver',
    xpReward: 200,
    condition: (ctx) => ctx.totalTests >= 50,
    progress: (ctx) => ({ current: Math.min(ctx.totalTests, 50), target: 50 }),
  },
  {
    id: 'tests-100',
    name: 'Centurion',
    description: 'Complete 100 typing tests',
    icon: '🏛️',
    category: 'endurance',
    tier: 'gold',
    xpReward: 500,
    condition: (ctx) => ctx.totalTests >= 100,
    progress: (ctx) => ({ current: Math.min(ctx.totalTests, 100), target: 100 }),
  },
  {
    id: 'tests-500',
    name: 'Legend',
    description: 'Complete 500 typing tests',
    icon: '🌟',
    category: 'endurance',
    tier: 'diamond',
    xpReward: 2000,
    condition: (ctx) => ctx.totalTests >= 500,
    progress: (ctx) => ({ current: Math.min(ctx.totalTests, 500), target: 500 }),
  },

  // ===== Explorer (5) =====
  {
    id: 'mode-all',
    name: 'Jack of All Trades',
    description: 'Try all 4 test modes (Standard, Code, Simulation, Daily)',
    icon: '🃏',
    category: 'explorer',
    tier: 'silver',
    xpReward: 300,
    condition: (ctx) => ctx.modesPlayed >= 4,
    progress: (ctx) => ({ current: ctx.modesPlayed, target: 4 }),
  },
  {
    id: 'code-all',
    name: 'Polyglot',
    description: 'Complete code tests in 4 different languages',
    icon: '💻',
    category: 'explorer',
    tier: 'gold',
    xpReward: 500,
    condition: (ctx) => ctx.codeLangsPlayed >= 4,
    progress: (ctx) => ({ current: ctx.codeLangsPlayed, target: 4 }),
  },
  {
    id: 'sim-all',
    name: 'Office Hero',
    description: 'Complete all 4 simulation categories',
    icon: '🏢',
    category: 'explorer',
    tier: 'gold',
    xpReward: 500,
    condition: (ctx) => ctx.simCategoriesPlayed >= 4,
    progress: (ctx) => ({ current: ctx.simCategoriesPlayed, target: 4 }),
  },
  {
    id: 'first-battle',
    name: 'Challenger',
    description: 'Complete your first battle',
    icon: '⚔️',
    category: 'explorer',
    tier: 'bronze',
    xpReward: 100,
    condition: (ctx) => ctx.battlesPlayed >= 1,
  },
  {
    id: 'battle-10',
    name: 'Gladiator',
    description: 'Win 10 battles',
    icon: '🏆',
    category: 'explorer',
    tier: 'gold',
    xpReward: 500,
    condition: (ctx) => ctx.battlesWon >= 10,
    progress: (ctx) => ({ current: Math.min(ctx.battlesWon, 10), target: 10 }),
  },

  // ===== Special (8) =====
  {
    id: 'daily-first',
    name: 'Daily Devotee',
    description: 'Complete your first daily challenge',
    icon: '📅',
    category: 'special',
    tier: 'bronze',
    xpReward: 50,
    condition: (ctx) => ctx.dailyChallengesCompleted >= 1,
  },
  {
    id: 'certified',
    name: 'Certified',
    description: 'Earn your first typing certificate',
    icon: '📜',
    category: 'special',
    tier: 'silver',
    xpReward: 200,
    condition: (ctx) => ctx.certificatesEarned >= 1,
  },
  {
    id: 'night-owl',
    name: 'Night Owl',
    description: 'Complete a test after midnight',
    icon: '🦉',
    category: 'special',
    tier: 'bronze',
    xpReward: 100,
    condition: (ctx) => ctx.testedAfterMidnight,
  },
  {
    id: 'early-bird',
    name: 'Early Bird',
    description: 'Complete a test before 6 AM',
    icon: '🐦',
    category: 'special',
    tier: 'bronze',
    xpReward: 100,
    condition: (ctx) => ctx.testedBefore6am,
  },
  {
    id: 'weekend',
    name: 'Weekend Warrior',
    description: 'Complete 5 tests on weekends',
    icon: '🎉',
    category: 'special',
    tier: 'bronze',
    xpReward: 100,
    condition: (ctx) => ctx.weekendTests >= 5,
    progress: (ctx) => ({ current: Math.min(ctx.weekendTests, 5), target: 5 }),
  },
  {
    id: 'improvement',
    name: 'Growth Mindset',
    description: 'Improve your speed by 20+ WPM from your first test',
    icon: '📈',
    category: 'special',
    tier: 'silver',
    xpReward: 300,
    condition: (ctx) => ctx.wpmImproved20,
  },
  {
    id: 'complete',
    name: 'The Complete Package',
    description: 'Achieve 80+ WPM and 98%+ accuracy in a single test',
    icon: '🎖️',
    category: 'special',
    tier: 'gold',
    xpReward: 500,
    hidden: true,
    condition: (ctx) => ctx.bestWpm >= 80 && ctx.bestAccuracy >= 98,
  },
  {
    id: 'marathon',
    name: 'Marathon Runner',
    description: 'Complete 10 tests in a single day',
    icon: '🏃‍♂️',
    category: 'special',
    tier: 'silver',
    xpReward: 300,
    hidden: true,
    condition: () => false, // Will be checked separately with daily test count
  },
];

/**
 * Build achievement context from test records and streak data
 */
export function buildAchievementContext(
  records: TestRecord[],
  streakData: { currentStreak: number; longestStreak: number } | null
): AchievementContext {
  const bestWpm = records.length > 0 ? Math.max(...records.map(r => r.wpm)) : 0;
  const bestAccuracy = records.length > 0 ? Math.max(...records.map(r => r.accuracy)) : 0;
  const perfectTests = records.filter(r => r.accuracy === 100).length;

  const currentStreak = streakData?.currentStreak ?? 0;
  const longestStreak = streakData?.longestStreak ?? 0;

  const totalTests = records.length;

  // Count unique modes
  const uniqueModes = new Set(records.map(r => r.mode));
  const modesPlayed = uniqueModes.size;

  // Count unique code languages
  const codeLangs = new Set(
    records
      .filter(r => r.mode === 'code' && r.subMode)
      .map(r => r.subMode!)
  );
  const codeLangsPlayed = codeLangs.size;

  // Count unique simulation categories
  const simCategories = new Set(
    records
      .filter(r => r.mode === 'simulation' && r.subMode)
      .map(r => r.subMode!)
  );
  const simCategoriesPlayed = simCategories.size;

  // Battle stats
  const battlesPlayed = records.filter(r => r.mode === 'battle').length;
  const battlesWon = 0; // TODO: Track battle wins separately

  // Daily challenges
  const dailyChallengesCompleted = records.filter(r => r.mode === 'daily').length;

  // Certificates (TODO: integrate with certificate system)
  const certificatesEarned = 0;

  // Time-based achievements
  const testedAfterMidnight = records.some(r => {
    const hour = new Date(r.timestamp).getHours();
    return hour >= 0 && hour < 6;
  });

  const testedBefore6am = testedAfterMidnight;

  const weekendTests = records.filter(r => {
    const day = new Date(r.timestamp).getDay();
    return day === 0 || day === 6;
  }).length;

  // Improvement tracking
  const firstTestWpm = records.length > 0 ? records[0].wpm : 0;
  const wpmImproved20 = firstTestWpm > 0 && (bestWpm - firstTestWpm) >= 20;

  return {
    bestWpm,
    bestAccuracy,
    perfectTests,
    currentStreak,
    longestStreak,
    totalTests,
    modesPlayed,
    codeLangsPlayed,
    simCategoriesPlayed,
    battlesPlayed,
    battlesWon,
    dailyChallengesCompleted,
    certificatesEarned,
    testedAfterMidnight,
    testedBefore6am,
    weekendTests,
    wpmImproved20,
    firstTestWpm,
  };
}

/**
 * Check which achievements are newly unlocked
 */
export function checkAchievements(
  context: AchievementContext,
  alreadyUnlocked: string[]
): AchievementDef[] {
  const unlocked = new Set(alreadyUnlocked);
  const newlyUnlocked: AchievementDef[] = [];

  for (const achievement of ACHIEVEMENTS) {
    if (!unlocked.has(achievement.id) && achievement.condition(context)) {
      newlyUnlocked.push(achievement);
    }
  }

  return newlyUnlocked;
}

/**
 * Get achievement by ID
 */
export function getAchievement(id: string): AchievementDef | undefined {
  return ACHIEVEMENTS.find(a => a.id === id);
}

/**
 * Get XP reward for an achievement
 */
export function getAchievementXP(achievementId: string): number {
  const achievement = getAchievement(achievementId);
  return achievement?.xpReward ?? 0;
}
