"use client";

import { useState, useEffect } from 'react';
import { STORAGE_KEYS, get, set } from '@/lib/storage';
import {
  XPData,
  LevelInfo,
  calculateLevel,
  checkLevelUp,
} from '@/lib/xp-system';

/**
 * Hook for managing XP and level progression
 */
export function useXP() {
  const [xpData, setXpData] = useState<XPData>({ totalXP: 0, level: 1 });
  const [levelInfo, setLevelInfo] = useState<LevelInfo>({
    level: 1,
    currentLevelXP: 0,
    nextLevelXP: 100,
    progress: 0,
    totalXP: 0,
  });
  const [leveledUp, setLeveledUp] = useState(false);
  const [previousLevel, setPreviousLevel] = useState(1);

  // Load XP data on mount
  useEffect(() => {
    const stored = get<XPData>(STORAGE_KEYS.XP);
    if (stored) {
      setXpData(stored);
      setLevelInfo(calculateLevel(stored.totalXP));
    } else {
      // Initialize with 0 XP
      const initial: XPData = { totalXP: 0, level: 1 };
      set(STORAGE_KEYS.XP, initial);
      setXpData(initial);
      setLevelInfo(calculateLevel(0));
    }
  }, []);

  /**
   * Add XP and check for level up
   */
  const addXP = (amount: number, reason?: string): void => {
    const oldXP = xpData.totalXP;
    const newXP = oldXP + amount;

    // Check if leveled up
    const levelCheck = checkLevelUp(oldXP, newXP);
    if (levelCheck.leveledUp) {
      setLeveledUp(true);
      setPreviousLevel(levelCheck.oldLevel);
    }

    // Update XP data
    const newData: XPData = {
      totalXP: newXP,
      level: levelCheck.newLevel,
    };

    set(STORAGE_KEYS.XP, newData);
    setXpData(newData);
    setLevelInfo(calculateLevel(newXP));

    if (reason) {
      console.log(`[XP] +${amount} XP: ${reason}`);
    }
  };

  /**
   * Dismiss the level up notification
   */
  const dismissLevelUp = (): void => {
    setLeveledUp(false);
  };

  return {
    totalXP: xpData.totalXP,
    level: levelInfo.level,
    currentLevelXP: levelInfo.currentLevelXP,
    nextLevelXP: levelInfo.nextLevelXP,
    progress: levelInfo.progress,
    addXP,
    leveledUp,
    previousLevel,
    dismissLevelUp,
  };
}
