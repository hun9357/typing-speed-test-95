import passages from "@/data/passages.json";

/**
 * Get today's date string in YYYY-MM-DD format (local timezone)
 */
export function getTodayDateString(): string {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * Generate a deterministic pseudo-random number from a date string
 * Uses Math.sin for reproducibility
 */
export function seedRandom(dateString: string): number {
  // Convert date string to a number seed
  const seed = dateString.split("-").reduce((acc, val) => acc + parseInt(val), 0);
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

/**
 * Get the daily passage for a specific date
 * Always returns the same passage for the same date
 */
export function getDailyPassage(dateString: string): string {
  const random = seedRandom(dateString);
  const index = Math.floor(random * passages.length);
  return passages[index];
}

/**
 * Get today's passage
 */
export function getTodayPassage(): string {
  return getDailyPassage(getTodayDateString());
}

/**
 * Get the day number since epoch (for display purposes)
 */
export function getDayNumber(dateString: string): number {
  const date = new Date(dateString);
  const epoch = new Date("2024-01-01");
  const diff = date.getTime() - epoch.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}
