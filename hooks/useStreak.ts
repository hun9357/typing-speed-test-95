"use client";

import { useState, useEffect } from "react";
import { getTodayDateString } from "@/lib/daily-passage";

export interface DailyProgress {
  date: string; // YYYY-MM-DD
  completed: boolean;
  wpm: number;
  accuracy: number;
}

export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastCompletedDate: string;
  history: DailyProgress[];
}

const STORAGE_KEY = "typing-test-streak-data";

const defaultStreakData: StreakData = {
  currentStreak: 0,
  longestStreak: 0,
  lastCompletedDate: "",
  history: [],
};

/**
 * Calculate streak from history
 */
function calculateStreak(history: DailyProgress[]): { current: number; longest: number } {
  if (history.length === 0) return { current: 0, longest: 0 };

  // Sort by date descending
  const sorted = [...history]
    .filter((p) => p.completed)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 0;

  const today = new Date(getTodayDateString());
  today.setHours(0, 0, 0, 0);

  // Calculate current streak (must be consecutive days including today or yesterday)
  for (let i = 0; i < sorted.length; i++) {
    const entryDate = new Date(sorted[i].date);
    entryDate.setHours(0, 0, 0, 0);

    const expectedDate = new Date(today);
    expectedDate.setDate(today.getDate() - i);

    if (entryDate.getTime() === expectedDate.getTime()) {
      currentStreak++;
    } else {
      break;
    }
  }

  // Calculate longest streak
  for (let i = 0; i < sorted.length; i++) {
    const currentDate = new Date(sorted[i].date);
    currentDate.setHours(0, 0, 0, 0);

    if (i === 0) {
      tempStreak = 1;
    } else {
      const prevDate = new Date(sorted[i - 1].date);
      prevDate.setHours(0, 0, 0, 0);

      const daysDiff = (prevDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24);

      if (daysDiff === 1) {
        tempStreak++;
      } else {
        longestStreak = Math.max(longestStreak, tempStreak);
        tempStreak = 1;
      }
    }
  }
  longestStreak = Math.max(longestStreak, tempStreak);

  return { current: currentStreak, longest: longestStreak };
}

export function useStreak() {
  const [streakData, setStreakData] = useState<StreakData>(defaultStreakData);
  const [isLoading, setIsLoading] = useState(true);

  // Load streak data from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as StreakData;
        setStreakData(parsed);
      }
    } catch (error) {
      console.error("Failed to load streak data:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save streak data to localStorage
  const saveStreakData = (data: StreakData) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      setStreakData(data);
    } catch (error) {
      console.error("Failed to save streak data:", error);
    }
  };

  // Get today's progress
  const getTodayProgress = (): DailyProgress | null => {
    const today = getTodayDateString();
    return streakData.history.find((p) => p.date === today) || null;
  };

  // Record today's completion
  const recordCompletion = (wpm: number, accuracy: number) => {
    const today = getTodayDateString();
    const existingIndex = streakData.history.findIndex((p) => p.date === today);

    let newHistory: DailyProgress[];

    if (existingIndex !== -1) {
      // Update existing entry (keep best score)
      newHistory = [...streakData.history];
      const existing = newHistory[existingIndex];
      if (wpm > existing.wpm || (wpm === existing.wpm && accuracy > existing.accuracy)) {
        newHistory[existingIndex] = { date: today, completed: true, wpm, accuracy };
      }
    } else {
      // Add new entry
      newHistory = [...streakData.history, { date: today, completed: true, wpm, accuracy }];
    }

    const { current, longest } = calculateStreak(newHistory);

    const newStreakData: StreakData = {
      currentStreak: current,
      longestStreak: Math.max(longest, streakData.longestStreak),
      lastCompletedDate: today,
      history: newHistory,
    };

    saveStreakData(newStreakData);
  };

  // Get progress for a specific date
  const getProgressForDate = (dateString: string): DailyProgress | null => {
    return streakData.history.find((p) => p.date === dateString) || null;
  };

  return {
    streakData,
    isLoading,
    getTodayProgress,
    recordCompletion,
    getProgressForDate,
  };
}
