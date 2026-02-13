/**
 * localStorage abstraction layer
 * Provides SSR-safe localStorage access with error handling
 * Designed for easy migration to Supabase in the future
 */

export const STORAGE_KEYS = {
  PROFILE: 'typing-test-profile',
  RECORDS: 'typing-test-records',
  XP: 'typing-test-xp',
  ACHIEVEMENTS: 'typing-test-achievements',
  QUESTS: 'typing-test-daily-quests',
  AVATAR_INVENTORY: 'typing-test-avatar-inventory',
  STREAK: 'typing-test-streak-data', // Maintain existing key for compatibility
} as const;

type StorageKey = typeof STORAGE_KEYS[keyof typeof STORAGE_KEYS];

/**
 * Check if we're in a browser environment
 */
const isBrowser = typeof window !== 'undefined';

/**
 * Get item from localStorage with type safety
 */
export function get<T>(key: StorageKey): T | null {
  if (!isBrowser) return null;

  try {
    const item = localStorage.getItem(key);
    if (item === null) return null;
    return JSON.parse(item) as T;
  } catch (error) {
    console.error(`Failed to get ${key} from localStorage:`, error);
    return null;
  }
}

/**
 * Set item in localStorage with type safety
 */
export function set<T>(key: StorageKey, value: T): boolean {
  if (!isBrowser) return false;

  try {
    const serialized = JSON.stringify(value);
    localStorage.setItem(key, serialized);
    return true;
  } catch (error) {
    if (error instanceof Error && error.name === 'QuotaExceededError') {
      console.error(`localStorage quota exceeded for key ${key}`);
    } else {
      console.error(`Failed to set ${key} in localStorage:`, error);
    }
    return false;
  }
}

/**
 * Remove item from localStorage
 */
export function remove(key: StorageKey): boolean {
  if (!isBrowser) return false;

  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`Failed to remove ${key} from localStorage:`, error);
    return false;
  }
}

/**
 * Clear all app data from localStorage
 */
export function clear(): boolean {
  if (!isBrowser) return false;

  try {
    Object.values(STORAGE_KEYS).forEach((key) => {
      localStorage.removeItem(key);
    });
    return true;
  } catch (error) {
    console.error('Failed to clear localStorage:', error);
    return false;
  }
}

/**
 * Migrate data between storage keys
 * Useful for data structure updates
 */
export function migrate<T>(
  fromKey: StorageKey,
  toKey: StorageKey,
  transform?: (data: T) => T
): boolean {
  if (!isBrowser) return false;

  try {
    const data = get<T>(fromKey);
    if (data === null) return false;

    const transformed = transform ? transform(data) : data;
    const success = set(toKey, transformed);

    if (success) {
      remove(fromKey);
    }

    return success;
  } catch (error) {
    console.error(`Failed to migrate from ${fromKey} to ${toKey}:`, error);
    return false;
  }
}

/**
 * Get the total size of localStorage data in bytes
 */
export function getStorageSize(): number {
  if (!isBrowser) return 0;

  let total = 0;
  try {
    Object.values(STORAGE_KEYS).forEach((key) => {
      const item = localStorage.getItem(key);
      if (item) {
        total += item.length + key.length;
      }
    });
  } catch (error) {
    console.error('Failed to calculate storage size:', error);
  }
  return total;
}

/**
 * Check if localStorage is available and working
 */
export function isAvailable(): boolean {
  if (!isBrowser) return false;

  try {
    const test = '__storage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
}
