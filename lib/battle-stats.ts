/**
 * Battle statistics and leaderboard system
 * Manages battle records with FIFO queue (max 100 records)
 */

const STORAGE_KEY = "typing-test-battle-records";
const MAX_RECORDS = 100;

export interface BattleRecord {
  id: string;
  timestamp: string;
  myWpm: number;
  myAccuracy: number;
  opponentWpm: number;
  opponentAccuracy: number;
  opponentName: string;
  result: "win" | "lose" | "draw";
  wpmDiff: number;
}

export interface BattleStats {
  totalBattles: number;
  wins: number;
  losses: number;
  draws: number;
  winRate: number; // 0-100
  bestWpm: number;
  avgWpm: number;
  bestAccuracy: number;
  avgAccuracy: number;
  currentWinStreak: number;
  longestWinStreak: number;
  recentBattles: BattleRecord[]; // Most recent 20
}

/**
 * Generate a unique ID for a battle record
 */
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Get all battle records from localStorage
 */
function getBattleRecords(): BattleRecord[] {
  if (typeof window === "undefined") return [];
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

/**
 * Save battle records to localStorage
 */
function setBattleRecords(records: BattleRecord[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  } catch (error) {
    console.error("Failed to save battle records:", error);
  }
}

/**
 * Save a new battle record
 */
export function saveBattleRecord(
  record: Omit<BattleRecord, "id" | "timestamp">
): BattleRecord {
  const fullRecord: BattleRecord = {
    ...record,
    id: generateId(),
    timestamp: new Date().toISOString(),
  };

  const records = getBattleRecords();
  records.push(fullRecord);

  // Enforce FIFO if exceeds max
  if (records.length > MAX_RECORDS) {
    records.shift(); // Remove oldest
  }

  setBattleRecords(records);
  return fullRecord;
}

/**
 * Calculate current win streak from recent battles
 */
function calculateCurrentWinStreak(records: BattleRecord[]): number {
  let streak = 0;
  // Iterate from most recent backwards
  for (let i = records.length - 1; i >= 0; i--) {
    if (records[i].result === "win") {
      streak++;
    } else {
      break;
    }
  }
  return streak;
}

/**
 * Calculate longest win streak from all battles
 */
function calculateLongestWinStreak(records: BattleRecord[]): number {
  let longest = 0;
  let current = 0;

  for (const record of records) {
    if (record.result === "win") {
      current++;
      longest = Math.max(longest, current);
    } else {
      current = 0;
    }
  }

  return longest;
}

/**
 * Get comprehensive battle statistics
 */
export function getBattleStats(): BattleStats {
  const records = getBattleRecords();

  if (records.length === 0) {
    return {
      totalBattles: 0,
      wins: 0,
      losses: 0,
      draws: 0,
      winRate: 0,
      bestWpm: 0,
      avgWpm: 0,
      bestAccuracy: 0,
      avgAccuracy: 0,
      currentWinStreak: 0,
      longestWinStreak: 0,
      recentBattles: [],
    };
  }

  const wins = records.filter((r) => r.result === "win").length;
  const losses = records.filter((r) => r.result === "lose").length;
  const draws = records.filter((r) => r.result === "draw").length;
  const totalBattles = records.length;
  const winRate = totalBattles > 0 ? (wins / totalBattles) * 100 : 0;

  const totalWpm = records.reduce((sum, r) => sum + r.myWpm, 0);
  const totalAccuracy = records.reduce((sum, r) => sum + r.myAccuracy, 0);

  const bestWpm = Math.max(...records.map((r) => r.myWpm));
  const avgWpm = totalWpm / totalBattles;
  const bestAccuracy = Math.max(...records.map((r) => r.myAccuracy));
  const avgAccuracy = totalAccuracy / totalBattles;

  const currentWinStreak = calculateCurrentWinStreak(records);
  const longestWinStreak = calculateLongestWinStreak(records);

  // Get most recent 20 battles
  const recentBattles = records.slice(-20).reverse();

  return {
    totalBattles,
    wins,
    losses,
    draws,
    winRate,
    bestWpm,
    avgWpm,
    bestAccuracy,
    avgAccuracy,
    currentWinStreak,
    longestWinStreak,
    recentBattles,
  };
}

/**
 * Get battle history with optional limit
 */
export function getBattleHistory(limit?: number): BattleRecord[] {
  const records = getBattleRecords();
  const reversed = [...records].reverse(); // Most recent first
  return limit ? reversed.slice(0, limit) : reversed;
}

/**
 * Get personal battle bests
 */
export function getPersonalBattleBests() {
  const records = getBattleRecords();

  if (records.length === 0) {
    return {
      bestWpm: 0,
      bestAccuracy: 0,
      longestWinStreak: 0,
    };
  }

  return {
    bestWpm: Math.max(...records.map((r) => r.myWpm)),
    bestAccuracy: Math.max(...records.map((r) => r.myAccuracy)),
    longestWinStreak: calculateLongestWinStreak(records),
  };
}

/**
 * Clear all battle records
 */
export function clearBattleRecords(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error("Failed to clear battle records:", error);
  }
}
