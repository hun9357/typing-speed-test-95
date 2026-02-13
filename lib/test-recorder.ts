/**
 * Test result persistence layer
 * Manages test records with FIFO queue (max 1000 records)
 */

import { STORAGE_KEYS, get, set } from './storage';

export interface TestRecord {
  id: string;
  timestamp: string;
  mode: 'standard' | 'code' | 'simulation' | 'daily' | 'battle';
  subMode?: string; // e.g., 'javascript', 'python', 'email', 'customer-support'
  wpm: number;
  accuracy: number;
  errors: number;
  charsTyped: number;
  duration: number; // in seconds
}

export interface PersonalBest {
  mode: string;
  wpm: number;
  accuracy: number;
  timestamp: string;
}

const MAX_RECORDS = 1000;

/**
 * Generate a unique ID for a test record
 */
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Save a test record to localStorage
 */
export function saveTestRecord(record: Omit<TestRecord, 'id' | 'timestamp'>): TestRecord {
  const fullRecord: TestRecord = {
    ...record,
    id: generateId(),
    timestamp: new Date().toISOString(),
  };

  const records = get<TestRecord[]>(STORAGE_KEYS.RECORDS) || [];

  // Add new record
  records.push(fullRecord);

  // Enforce FIFO if exceeds max
  if (records.length > MAX_RECORDS) {
    records.shift(); // Remove oldest
  }

  set(STORAGE_KEYS.RECORDS, records);
  return fullRecord;
}

/**
 * Get all test records
 */
export function getTestRecords(): TestRecord[] {
  return get<TestRecord[]>(STORAGE_KEYS.RECORDS) || [];
}

/**
 * Get recent test records
 */
export function getRecentRecords(count: number = 10): TestRecord[] {
  const records = getTestRecords();
  return records.slice(-count).reverse();
}

/**
 * Get test records by mode
 */
export function getRecordsByMode(
  mode: TestRecord['mode'],
  subMode?: string
): TestRecord[] {
  const records = getTestRecords();

  return records.filter((record) => {
    if (record.mode !== mode) return false;
    if (subMode && record.subMode !== subMode) return false;
    return true;
  });
}

/**
 * Get personal bests for each mode
 */
export function getPersonalBests(): PersonalBest[] {
  const records = getTestRecords();
  const bests: { [key: string]: PersonalBest } = {};

  records.forEach((record) => {
    const key = record.subMode
      ? `${record.mode}-${record.subMode}`
      : record.mode;

    if (!bests[key] || record.wpm > bests[key].wpm) {
      bests[key] = {
        mode: record.subMode
          ? `${record.mode} (${record.subMode})`
          : record.mode,
        wpm: record.wpm,
        accuracy: record.accuracy,
        timestamp: record.timestamp,
      };
    }
  });

  return Object.values(bests);
}

/**
 * Get statistics across all records
 */
export function getStatistics() {
  const records = getTestRecords();

  if (records.length === 0) {
    return {
      totalTests: 0,
      averageWpm: 0,
      averageAccuracy: 0,
      bestWpm: 0,
      bestAccuracy: 0,
      totalChars: 0,
    };
  }

  const totalWpm = records.reduce((sum, r) => sum + r.wpm, 0);
  const totalAccuracy = records.reduce((sum, r) => sum + r.accuracy, 0);
  const totalChars = records.reduce((sum, r) => sum + r.charsTyped, 0);
  const bestWpm = Math.max(...records.map((r) => r.wpm));
  const bestAccuracy = Math.max(...records.map((r) => r.accuracy));

  return {
    totalTests: records.length,
    averageWpm: totalWpm / records.length,
    averageAccuracy: totalAccuracy / records.length,
    bestWpm,
    bestAccuracy,
    totalChars,
  };
}

/**
 * Clear all test records
 */
export function clearTestRecords(): boolean {
  return set(STORAGE_KEYS.RECORDS, []);
}

/**
 * Get WPM history for chart data (last N tests)
 */
export function getWpmHistory(count: number = 30): { timestamp: string; wpm: number }[] {
  const records = getTestRecords();
  return records
    .slice(-count)
    .map((r) => ({
      timestamp: r.timestamp,
      wpm: r.wpm,
    }));
}
