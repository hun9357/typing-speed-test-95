"use client";

import { useState, useEffect } from 'react';
import {
  getTestRecords,
  getRecentRecords,
  getRecordsByMode,
  getPersonalBests,
  getStatistics,
  getWpmHistory,
  type TestRecord,
  type PersonalBest,
} from '@/lib/test-recorder';

/**
 * Hook for querying test history and statistics
 */
export function useTestHistory() {
  const [records, setRecords] = useState<TestRecord[]>([]);
  const [personalBests, setPersonalBests] = useState<PersonalBest[]>([]);
  const [statistics, setStatistics] = useState({
    totalTests: 0,
    averageWpm: 0,
    averageAccuracy: 0,
    bestWpm: 0,
    bestAccuracy: 0,
    totalChars: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  // Load data on mount and refresh periodically
  useEffect(() => {
    const loadData = () => {
      const allRecords = getTestRecords();
      const bests = getPersonalBests();
      const stats = getStatistics();

      setRecords(allRecords);
      setPersonalBests(bests);
      setStatistics(stats);
      setIsLoading(false);
    };

    loadData();

    // Refresh when window gains focus (in case data changed in another tab)
    const handleFocus = () => loadData();
    window.addEventListener('focus', handleFocus);

    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  /**
   * Refresh data manually
   */
  const refresh = () => {
    const allRecords = getTestRecords();
    const bests = getPersonalBests();
    const stats = getStatistics();

    setRecords(allRecords);
    setPersonalBests(bests);
    setStatistics(stats);
  };

  /**
   * Get recent records (default 10)
   */
  const getRecent = (count: number = 10) => {
    return getRecentRecords(count);
  };

  /**
   * Get records filtered by mode
   */
  const getByMode = (mode: TestRecord['mode'], subMode?: string) => {
    return getRecordsByMode(mode, subMode);
  };

  /**
   * Get WPM chart data
   */
  const getChartData = (count: number = 30) => {
    return getWpmHistory(count);
  };

  return {
    records,
    personalBests,
    statistics,
    isLoading,
    refresh,
    getRecent,
    getByMode,
    getChartData,
    totalTests: statistics.totalTests,
    averageWpm: statistics.averageWpm,
    bestWpm: statistics.bestWpm,
    bestAccuracy: statistics.bestAccuracy,
  };
}
