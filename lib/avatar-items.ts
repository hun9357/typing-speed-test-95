/**
 * Avatar Customization Items
 * 15 colors, 5 frames, 8 patterns with unlock conditions
 */

export type UnlockCondition =
  | 'default'
  | { type: 'level'; level: number }
  | { type: 'achievement'; achievementId: string };

export interface AvatarColor {
  id: string;
  hex: string;
  name: string;
  unlockCondition: UnlockCondition;
}

export interface AvatarFrame {
  id: string;
  name: string;
  borderStyle: string;
  unlockCondition: UnlockCondition;
}

export interface AvatarPattern {
  id: string;
  name: string;
  pattern: string; // CSS background-image value
  unlockCondition: UnlockCondition;
}

// ===== Colors (15) =====
export const AVATAR_COLORS: AvatarColor[] = [
  // Default (7 colors, free)
  { id: 'blue', hex: '#3B82F6', name: 'Ocean Blue', unlockCondition: 'default' },
  { id: 'green', hex: '#10B981', name: 'Emerald', unlockCondition: 'default' },
  { id: 'purple', hex: '#8B5CF6', name: 'Royal Purple', unlockCondition: 'default' },
  { id: 'red', hex: '#EF4444', name: 'Crimson', unlockCondition: 'default' },
  { id: 'orange', hex: '#F97316', name: 'Sunset', unlockCondition: 'default' },
  { id: 'pink', hex: '#EC4899', name: 'Rose', unlockCondition: 'default' },
  { id: 'teal', hex: '#14B8A6', name: 'Teal', unlockCondition: 'default' },

  // Locked (8 colors, level/achievement)
  { id: 'gold', hex: '#EAB308', name: 'Gold', unlockCondition: { type: 'level', level: 5 } },
  { id: 'indigo', hex: '#4F46E5', name: 'Indigo', unlockCondition: { type: 'level', level: 10 } },
  { id: 'cyan', hex: '#06B6D4', name: 'Cyan', unlockCondition: { type: 'level', level: 15 } },
  { id: 'lime', hex: '#84CC16', name: 'Lime', unlockCondition: { type: 'level', level: 20 } },
  { id: 'amber', hex: '#D97706', name: 'Amber', unlockCondition: { type: 'achievement', achievementId: 'speed-80' } },
  { id: 'violet', hex: '#7C3AED', name: 'Violet', unlockCondition: { type: 'achievement', achievementId: 'acc-100' } },
  { id: 'slate', hex: '#475569', name: 'Slate', unlockCondition: { type: 'achievement', achievementId: 'streak-14' } },
  { id: 'black', hex: '#1F2937', name: 'Midnight', unlockCondition: { type: 'level', level: 30 } },
];

// ===== Frames (5) =====
export const AVATAR_FRAMES: AvatarFrame[] = [
  {
    id: 'default',
    name: 'Simple',
    borderStyle: 'border-2 border-white/30',
    unlockCondition: 'default',
  },
  {
    id: 'bronze',
    name: 'Bronze',
    borderStyle: 'border-[3px] border-orange-400 shadow-md shadow-orange-400/30',
    unlockCondition: { type: 'level', level: 3 },
  },
  {
    id: 'silver',
    name: 'Silver',
    borderStyle: 'border-[3px] border-gray-300 shadow-md shadow-gray-300/40',
    unlockCondition: { type: 'level', level: 8 },
  },
  {
    id: 'gold',
    name: 'Gold',
    borderStyle: 'border-[3px] border-yellow-400 shadow-lg shadow-yellow-400/40',
    unlockCondition: { type: 'achievement', achievementId: 'tests-100' },
  },
  {
    id: 'diamond',
    name: 'Diamond',
    borderStyle: 'border-[3px] border-purple-400 shadow-lg shadow-purple-400/50 ring-2 ring-purple-300/30',
    unlockCondition: { type: 'achievement', achievementId: 'streak-30' },
  },
];

// ===== Patterns (8) =====
export const AVATAR_PATTERNS: AvatarPattern[] = [
  {
    id: 'solid',
    name: 'Solid',
    pattern: 'none',
    unlockCondition: 'default',
  },
  {
    id: 'dots',
    name: 'Dots',
    pattern: 'radial-gradient(circle, rgba(255,255,255,0.2) 1px, transparent 1px)',
    unlockCondition: 'default',
  },
  {
    id: 'stripes',
    name: 'Stripes',
    pattern: 'repeating-linear-gradient(45deg, transparent, transparent 3px, rgba(255,255,255,0.1) 3px, rgba(255,255,255,0.1) 6px)',
    unlockCondition: { type: 'level', level: 5 },
  },
  {
    id: 'grid',
    name: 'Grid',
    pattern: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
    unlockCondition: { type: 'level', level: 10 },
  },
  {
    id: 'waves',
    name: 'Waves',
    pattern: 'repeating-linear-gradient(0deg, transparent, transparent 4px, rgba(255,255,255,0.08) 4px, rgba(255,255,255,0.08) 8px)',
    unlockCondition: { type: 'level', level: 15 },
  },
  {
    id: 'diamonds',
    name: 'Diamonds',
    pattern: 'repeating-conic-gradient(rgba(255,255,255,0.1) 0% 25%, transparent 0% 50%)',
    unlockCondition: { type: 'achievement', achievementId: 'speed-100' },
  },
  {
    id: 'stars',
    name: 'Stars',
    pattern: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.15) 0%, transparent 50%)',
    unlockCondition: { type: 'achievement', achievementId: 'mode-all' },
  },
  {
    id: 'glow',
    name: 'Glow',
    pattern: 'radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%)',
    unlockCondition: { type: 'achievement', achievementId: 'tests-500' },
  },
];

/**
 * Check if an item is unlocked
 */
export function isItemUnlocked(
  condition: UnlockCondition,
  userLevel: number,
  unlockedAchievements: string[]
): boolean {
  if (condition === 'default') return true;

  if (condition.type === 'level') {
    return userLevel >= condition.level;
  }

  if (condition.type === 'achievement') {
    return unlockedAchievements.includes(condition.achievementId);
  }

  return false;
}

/**
 * Get unlock description for display
 */
export function getUnlockDescription(condition: UnlockCondition): string {
  if (condition === 'default') return 'Unlocked';

  if (condition.type === 'level') {
    return `Unlock at Level ${condition.level}`;
  }

  if (condition.type === 'achievement') {
    // Map common achievement IDs to friendly names
    const achievementNames: Record<string, string> = {
      'speed-80': 'Speed Demon',
      'speed-100': 'Century Club',
      'acc-100': 'Perfection',
      'streak-14': 'Fortnight Force',
      'streak-30': 'Monthly Master',
      'tests-100': 'Centurion',
      'tests-500': 'Legend',
      'mode-all': 'Jack of All Trades',
    };

    const name = achievementNames[condition.achievementId] || condition.achievementId;
    return `Unlock: ${name}`;
  }

  return 'Locked';
}

/**
 * Get color by ID
 */
export function getColorById(id: string): AvatarColor | undefined {
  return AVATAR_COLORS.find(c => c.id === id);
}

/**
 * Get frame by ID
 */
export function getFrameById(id: string): AvatarFrame | undefined {
  return AVATAR_FRAMES.find(f => f.id === id);
}

/**
 * Get pattern by ID
 */
export function getPatternById(id: string): AvatarPattern | undefined {
  return AVATAR_PATTERNS.find(p => p.id === id);
}
