/**
 * Daily Quests Hook
 * Manages quest state, progress tracking, and localStorage persistence
 */

import { useState, useEffect, useCallback } from 'react';
import { STORAGE_KEYS, get, set } from '@/lib/storage';
import {
  Quest,
  DailyQuestData,
  getDailyQuests,
  getTodayDateString,
  updateQuestProgress as updateQuestProgressLib,
  areAllQuestsCompleted,
  BONUS_XP,
} from '@/lib/daily-quests';
import { TestRecord } from '@/lib/test-recorder';
import { useXP } from './useXP';

export function useDailyQuests() {
  const [quests, setQuests] = useState<Quest[]>([]);
  const [allCompleted, setAllCompleted] = useState(false);
  const [bonusClaimed, setBonusClaimed] = useState(false);
  const [newlyCompleted, setNewlyCompleted] = useState<Quest[]>([]);
  const { addXP } = useXP();

  // Load or initialize daily quests
  useEffect(() => {
    const today = getTodayDateString();
    const stored = get<DailyQuestData>(STORAGE_KEYS.QUESTS);

    // Check if we need to generate new quests (new day or first time)
    if (!stored || stored.date !== today) {
      const newQuests = getDailyQuests(today);
      const newData: DailyQuestData = {
        date: today,
        quests: newQuests,
        allCompleted: false,
        bonusClaimed: false,
      };
      set(STORAGE_KEYS.QUESTS, newData);
      setQuests(newQuests);
      setAllCompleted(false);
      setBonusClaimed(false);
    } else {
      setQuests(stored.quests);
      setAllCompleted(stored.allCompleted);
      setBonusClaimed(stored.bonusClaimed);
    }
  }, []);

  // Save to localStorage whenever quests change
  const saveQuests = useCallback(
    (updatedQuests: Quest[], completed: boolean, claimed: boolean) => {
      const today = getTodayDateString();
      const data: DailyQuestData = {
        date: today,
        quests: updatedQuests,
        allCompleted: completed,
        bonusClaimed: claimed,
      };
      set(STORAGE_KEYS.QUESTS, data);
    },
    []
  );

  // Update quest progress after a test
  const updateProgress = useCallback(
    (testResult: TestRecord, previousBestWpm: number) => {
      const updatedQuests = updateQuestProgressLib(quests, testResult, previousBestWpm);

      // Find newly completed quests
      const justCompleted = updatedQuests.filter((quest, index) => {
        return quest.completed && !quests[index].completed;
      });

      // Award XP for newly completed quests
      justCompleted.forEach((quest) => {
        addXP(quest.xpReward, `Quest: ${quest.title}`);
      });

      // Update state
      const allDone = areAllQuestsCompleted(updatedQuests);
      setQuests(updatedQuests);
      setAllCompleted(allDone);
      setNewlyCompleted(justCompleted);
      saveQuests(updatedQuests, allDone, bonusClaimed);
    },
    [quests, bonusClaimed, addXP, saveQuests]
  );

  // Claim bonus XP for completing all quests
  const claimBonus = useCallback(() => {
    if (allCompleted && !bonusClaimed) {
      addXP(BONUS_XP, 'All Quests Completed Bonus');
      setBonusClaimed(true);
      saveQuests(quests, allCompleted, true);
    }
  }, [allCompleted, bonusClaimed, quests, addXP, saveQuests]);

  // Dismiss a completed quest from the notification list
  const dismissCompleted = useCallback((questId: string) => {
    setNewlyCompleted((prev) => prev.filter((q) => q.id !== questId));
  }, []);

  // Get completed count
  const completedCount = quests.filter((q) => q.completed).length;

  return {
    quests,
    allCompleted,
    bonusClaimed,
    completedCount,
    updateProgress,
    claimBonus,
    newlyCompleted,
    dismissCompleted,
  };
}
