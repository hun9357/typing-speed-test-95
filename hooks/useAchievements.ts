"use client";

import { useState, useEffect } from 'react';
import { STORAGE_KEYS, get, set } from '@/lib/storage';
import { getTestRecords } from '@/lib/test-recorder';
import {
  AchievementDef,
  UnlockedAchievement,
  ACHIEVEMENTS,
  buildAchievementContext,
  checkAchievements,
} from '@/lib/achievements';

export interface AchievementWithStatus {
  def: AchievementDef;
  unlocked: boolean;
  unlockedAt?: string;
  progress?: { current: number; target: number } | null;
}

/**
 * Hook for managing achievement state
 */
export function useAchievements() {
  const [unlockedList, setUnlockedList] = useState<UnlockedAchievement[]>([]);
  const [newlyUnlocked, setNewlyUnlocked] = useState<AchievementDef[]>([]);
  const [achievements, setAchievements] = useState<AchievementWithStatus[]>([]);

  // Load unlocked achievements on mount
  useEffect(() => {
    const stored = get<UnlockedAchievement[]>(STORAGE_KEYS.ACHIEVEMENTS);
    if (stored) {
      setUnlockedList(stored);
    } else {
      set(STORAGE_KEYS.ACHIEVEMENTS, []);
      setUnlockedList([]);
    }
  }, []);

  // Build achievement list with status
  useEffect(() => {
    const records = getTestRecords();
    const streakData = get<{ currentStreak: number; longestStreak: number }>(
      STORAGE_KEYS.STREAK
    );
    const context = buildAchievementContext(records, streakData);

    const unlockedIds = new Set(unlockedList.map(u => u.achievementId));

    const statusList: AchievementWithStatus[] = ACHIEVEMENTS.map(def => {
      const unlocked = unlockedIds.has(def.id);
      const unlockedData = unlockedList.find(u => u.achievementId === def.id);
      const progress = def.progress ? def.progress(context) : null;

      return {
        def,
        unlocked,
        unlockedAt: unlockedData?.unlockedAt,
        progress,
      };
    });

    setAchievements(statusList);
  }, [unlockedList]);

  /**
   * Check for new achievements and update
   */
  const checkAndUpdate = (): AchievementDef[] => {
    const records = getTestRecords();
    const streakData = get<{ currentStreak: number; longestStreak: number }>(
      STORAGE_KEYS.STREAK
    );
    const context = buildAchievementContext(records, streakData);

    const alreadyUnlocked = unlockedList.map(u => u.achievementId);
    const newUnlocks = checkAchievements(context, alreadyUnlocked);

    if (newUnlocks.length > 0) {
      const now = new Date().toISOString();
      const newUnlockedData: UnlockedAchievement[] = newUnlocks.map(a => ({
        achievementId: a.id,
        unlockedAt: now,
      }));

      const updated = [...unlockedList, ...newUnlockedData];
      set(STORAGE_KEYS.ACHIEVEMENTS, updated);
      setUnlockedList(updated);
      setNewlyUnlocked(prev => [...prev, ...newUnlocks]);
    }

    return newUnlocks;
  };

  /**
   * Dismiss a newly unlocked achievement from the queue
   */
  const dismissNewAchievement = (achievementId: string): void => {
    setNewlyUnlocked(prev => prev.filter(a => a.id !== achievementId));
  };

  /**
   * Get achievements by category
   */
  const getByCategory = (category: string): AchievementWithStatus[] => {
    if (category === 'all') return achievements;
    return achievements.filter(a => a.def.category === category);
  };

  const unlockedCount = unlockedList.length;
  const totalCount = ACHIEVEMENTS.length;

  return {
    achievements,
    unlockedCount,
    totalCount,
    newlyUnlocked,
    dismissNewAchievement,
    checkAndUpdate,
    getByCategory,
  };
}
