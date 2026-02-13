/**
 * React hook for battle statistics
 */

import { useState, useEffect } from "react";
import {
  getBattleStats,
  getBattleHistory,
  saveBattleRecord,
  type BattleStats,
  type BattleRecord,
} from "@/lib/battle-stats";

export function useBattleStats() {
  const [stats, setStats] = useState<BattleStats | null>(null);
  const [history, setHistory] = useState<BattleRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load stats on mount
  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = () => {
    setIsLoading(true);
    try {
      const battleStats = getBattleStats();
      const battleHistory = getBattleHistory(20); // Get last 20
      setStats(battleStats);
      setHistory(battleHistory);
    } catch (error) {
      console.error("Failed to load battle stats:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveBattle = (record: Omit<BattleRecord, "id" | "timestamp">) => {
    try {
      saveBattleRecord(record);
      // Reload stats after saving
      loadStats();
    } catch (error) {
      console.error("Failed to save battle record:", error);
    }
  };

  return {
    stats,
    history,
    isLoading,
    saveBattle,
    reload: loadStats,
  };
}
