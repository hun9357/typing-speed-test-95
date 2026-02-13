"use client";

import { useState, useEffect } from 'react';
import { STORAGE_KEYS, get, set } from '@/lib/storage';
import {
  AVATAR_COLORS,
  AVATAR_FRAMES,
  AVATAR_PATTERNS,
  isItemUnlocked,
} from '@/lib/avatar-items';

export interface AvatarInventory {
  unlockedColors: string[];
  unlockedFrames: string[];
  unlockedPatterns: string[];
}

/**
 * Hook for managing avatar inventory (unlocked items)
 */
export function useAvatarInventory(
  userLevel: number,
  unlockedAchievements: string[]
) {
  const [inventory, setInventory] = useState<AvatarInventory>({
    unlockedColors: [],
    unlockedFrames: [],
    unlockedPatterns: [],
  });
  const [newlyUnlocked, setNewlyUnlocked] = useState<string[]>([]);

  /**
   * Refresh inventory based on current level and achievements
   */
  const refreshInventory = () => {
    const currentInventory = get<AvatarInventory>(STORAGE_KEYS.AVATAR_INVENTORY) || {
      unlockedColors: [],
      unlockedFrames: [],
      unlockedPatterns: [],
    };

    const newUnlockedColors: string[] = [];
    const newUnlockedFrames: string[] = [];
    const newUnlockedPatterns: string[] = [];
    const newItems: string[] = [];

    // Check colors
    AVATAR_COLORS.forEach(color => {
      if (isItemUnlocked(color.unlockCondition, userLevel, unlockedAchievements)) {
        if (!currentInventory.unlockedColors.includes(color.id)) {
          newItems.push(color.id);
        }
        newUnlockedColors.push(color.id);
      }
    });

    // Check frames
    AVATAR_FRAMES.forEach(frame => {
      if (isItemUnlocked(frame.unlockCondition, userLevel, unlockedAchievements)) {
        if (!currentInventory.unlockedFrames.includes(frame.id)) {
          newItems.push(frame.id);
        }
        newUnlockedFrames.push(frame.id);
      }
    });

    // Check patterns
    AVATAR_PATTERNS.forEach(pattern => {
      if (isItemUnlocked(pattern.unlockCondition, userLevel, unlockedAchievements)) {
        if (!currentInventory.unlockedPatterns.includes(pattern.id)) {
          newItems.push(pattern.id);
        }
        newUnlockedPatterns.push(pattern.id);
      }
    });

    const updatedInventory: AvatarInventory = {
      unlockedColors: newUnlockedColors,
      unlockedFrames: newUnlockedFrames,
      unlockedPatterns: newUnlockedPatterns,
    };

    set(STORAGE_KEYS.AVATAR_INVENTORY, updatedInventory);
    setInventory(updatedInventory);
    setNewlyUnlocked(newItems);
  };

  // Load inventory on mount
  useEffect(() => {
    refreshInventory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userLevel, unlockedAchievements.length]);

  const isColorUnlocked = (colorId: string): boolean => {
    return inventory.unlockedColors.includes(colorId);
  };

  const isFrameUnlocked = (frameId: string): boolean => {
    return inventory.unlockedFrames.includes(frameId);
  };

  const isPatternUnlocked = (patternId: string): boolean => {
    return inventory.unlockedPatterns.includes(patternId);
  };

  return {
    inventory,
    isColorUnlocked,
    isFrameUnlocked,
    isPatternUnlocked,
    refreshInventory,
    newlyUnlocked,
  };
}
