/**
 * Daily Quest System
 * Generates 3 quests per day using date-seeded random selection
 * Tracks progress and awards XP
 */

import { TestRecord } from './test-recorder';

export interface Quest {
  id: string;
  title: string;
  description: string;
  icon: string;
  target: number;
  current: number;
  completed: boolean;
  xpReward: number;
  type: 'tests_count' | 'wpm_reach' | 'accuracy_reach' | 'mode_specific' | 'chars_count' | 'no_errors' | 'beat_best';
  mode?: string; // For mode_specific quests
}

export interface DailyQuestData {
  date: string; // YYYY-MM-DD
  quests: Quest[];
  allCompleted: boolean;
  bonusClaimed: boolean;
}

// Quest pool (10 total)
const QUEST_POOL = [
  {
    id: 'q-test-3',
    title: 'Practice Makes Perfect',
    description: 'Complete 3 typing tests',
    icon: '📝',
    target: 3,
    xpReward: 100,
    type: 'tests_count' as const,
  },
  {
    id: 'q-wpm-60',
    title: 'Speed Run',
    description: 'Reach 60+ WPM in any test',
    icon: '⚡',
    target: 60,
    xpReward: 150,
    type: 'wpm_reach' as const,
  },
  {
    id: 'q-acc-97',
    title: 'Precision Strike',
    description: 'Get 97%+ accuracy',
    icon: '🎯',
    target: 97,
    xpReward: 150,
    type: 'accuracy_reach' as const,
  },
  {
    id: 'q-daily',
    title: 'Daily Duty',
    description: 'Complete the Daily Challenge',
    icon: '📅',
    target: 1,
    xpReward: 100,
    type: 'mode_specific' as const,
    mode: 'daily',
  },
  {
    id: 'q-code',
    title: 'Code Warrior',
    description: 'Complete a coding test',
    icon: '💻',
    target: 1,
    xpReward: 120,
    type: 'mode_specific' as const,
    mode: 'code',
  },
  {
    id: 'q-sim',
    title: 'Office Worker',
    description: 'Complete a simulation',
    icon: '🏢',
    target: 1,
    xpReward: 120,
    type: 'mode_specific' as const,
    mode: 'simulation',
  },
  {
    id: 'q-battle',
    title: 'Battle Ready',
    description: 'Complete a battle',
    icon: '⚔️',
    target: 1,
    xpReward: 150,
    type: 'mode_specific' as const,
    mode: 'battle',
  },
  {
    id: 'q-chars-500',
    title: 'Finger Marathon',
    description: 'Type 500+ characters total',
    icon: '🏃',
    target: 500,
    xpReward: 100,
    type: 'chars_count' as const,
  },
  {
    id: 'q-no-errors',
    title: 'Flawless',
    description: 'Complete a test with 0 errors',
    icon: '✨',
    target: 0,
    xpReward: 200,
    type: 'no_errors' as const,
  },
  {
    id: 'q-beat-best',
    title: 'Beat Yourself',
    description: 'Beat your personal best WPM',
    icon: '📈',
    target: 1,
    xpReward: 200,
    type: 'beat_best' as const,
  },
];

/**
 * Get today's date string in YYYY-MM-DD format (local time)
 */
export function getTodayDateString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Seeded random number generator (date-based)
 */
function seededRandom(seed: string): number {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    const char = seed.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  const x = Math.sin(hash) * 10000;
  return x - Math.floor(x);
}

/**
 * Generate daily quests based on date seed
 * Always includes Daily Duty + 2 random quests
 */
export function getDailyQuests(dateString: string): Quest[] {
  // Always include Daily Duty quest
  const dailyDutyQuest = QUEST_POOL.find((q) => q.id === 'q-daily')!;

  // Filter out Daily Duty from pool for random selection
  const otherQuests = QUEST_POOL.filter((q) => q.id !== 'q-daily');

  // Use date as seed to deterministically pick 2 quests
  const seed1 = seededRandom(dateString + '-1');
  const seed2 = seededRandom(dateString + '-2');

  const index1 = Math.floor(seed1 * otherQuests.length);
  let index2 = Math.floor(seed2 * otherQuests.length);

  // Ensure index2 is different from index1
  if (index2 === index1) {
    index2 = (index2 + 1) % otherQuests.length;
  }

  const quest1 = otherQuests[index1];
  const quest2 = otherQuests[index2];

  // Create fresh quest instances
  const quests: Quest[] = [
    {
      ...dailyDutyQuest,
      current: 0,
      completed: false,
    },
    {
      ...quest1,
      current: 0,
      completed: false,
    },
    {
      ...quest2,
      current: 0,
      completed: false,
    },
  ];

  return quests;
}

/**
 * Update quest progress based on test result
 */
export function updateQuestProgress(
  quests: Quest[],
  testResult: TestRecord,
  previousBestWpm: number
): Quest[] {
  return quests.map((quest) => {
    if (quest.completed) return quest;

    const updatedQuest = { ...quest };

    switch (quest.type) {
      case 'tests_count':
        updatedQuest.current = Math.min(quest.current + 1, quest.target);
        break;

      case 'wpm_reach':
        if (testResult.wpm >= quest.target) {
          updatedQuest.current = quest.target;
        }
        break;

      case 'accuracy_reach':
        if (testResult.accuracy >= quest.target) {
          updatedQuest.current = quest.target;
        }
        break;

      case 'mode_specific':
        if (testResult.mode === quest.mode) {
          updatedQuest.current = Math.min(quest.current + 1, quest.target);
        }
        break;

      case 'chars_count':
        updatedQuest.current = Math.min(quest.current + testResult.charsTyped, quest.target);
        break;

      case 'no_errors':
        if (testResult.errors === 0) {
          updatedQuest.current = quest.target; // Special case: target is 0
          updatedQuest.completed = true;
        }
        break;

      case 'beat_best':
        if (previousBestWpm > 0 && testResult.wpm > previousBestWpm) {
          updatedQuest.current = quest.target;
        }
        break;
    }

    // Check if quest is completed
    if (!updatedQuest.completed) {
      if (quest.type === 'no_errors') {
        // Already handled above
      } else if (quest.type === 'wpm_reach' || quest.type === 'accuracy_reach' || quest.type === 'beat_best') {
        updatedQuest.completed = updatedQuest.current >= quest.target;
      } else {
        updatedQuest.completed = updatedQuest.current >= quest.target;
      }
    }

    return updatedQuest;
  });
}

/**
 * Calculate time until midnight (quest reset)
 */
export function getTimeUntilMidnight(): { hours: number; minutes: number } {
  const now = new Date();
  const midnight = new Date(now);
  midnight.setHours(24, 0, 0, 0);

  const diff = midnight.getTime() - now.getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  return { hours, minutes };
}

/**
 * Check if all quests are completed
 */
export function areAllQuestsCompleted(quests: Quest[]): boolean {
  return quests.every((q) => q.completed);
}

/**
 * Get XP bonus for completing all quests
 */
export const BONUS_XP = 200;
