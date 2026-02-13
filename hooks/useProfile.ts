"use client";

import { useState, useEffect } from 'react';
import { STORAGE_KEYS, get, set } from '@/lib/storage';

export interface UserProfile {
  id: string;
  nickname: string;
  createdAt: string;
  avatar: {
    initial: string;
    bgColor: string;
    frameId: string;
    patternId: string;
  };
}

/**
 * Generate random avatar background color
 */
function generateRandomColor(): string {
  const colors = [
    '#3B82F6', // blue
    '#8B5CF6', // purple
    '#EC4899', // pink
    '#F59E0B', // amber
    '#10B981', // emerald
    '#06B6D4', // cyan
    '#F97316', // orange
    '#6366F1', // indigo
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}

/**
 * Generate initials from nickname
 */
function generateInitials(nickname: string): string {
  const words = nickname.trim().split(/\s+/);
  if (words.length === 1) {
    return words[0].substring(0, 2).toUpperCase();
  }
  return (words[0][0] + words[words.length - 1][0]).toUpperCase();
}

/**
 * Hook for managing user profile
 */
export function useProfile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isNewUser, setIsNewUser] = useState(false);

  // Load profile on mount
  useEffect(() => {
    const loadProfile = () => {
      const stored = get<UserProfile>(STORAGE_KEYS.PROFILE);

      if (stored) {
        setProfile(stored);
        setIsNewUser(false);
      } else {
        setIsNewUser(true);
      }

      setIsLoading(false);
    };

    loadProfile();
  }, []);

  /**
   * Create a new profile
   */
  const createProfile = (nickname: string): UserProfile => {
    const newProfile: UserProfile = {
      id: `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      nickname: nickname.trim() || 'Anonymous',
      createdAt: new Date().toISOString(),
      avatar: {
        initial: generateInitials(nickname.trim() || 'Anonymous'),
        bgColor: generateRandomColor(),
        frameId: 'default',
        patternId: 'solid',
      },
    };

    set(STORAGE_KEYS.PROFILE, newProfile);
    setProfile(newProfile);
    setIsNewUser(false);

    return newProfile;
  };

  /**
   * Update existing profile
   */
  const updateProfile = (updates: Partial<Omit<UserProfile, 'id' | 'createdAt'>>): boolean => {
    if (!profile) return false;

    const updatedProfile: UserProfile = {
      ...profile,
      ...updates,
    };

    // Update initials if nickname changed
    if (updates.nickname) {
      updatedProfile.avatar = {
        ...updatedProfile.avatar,
        initial: generateInitials(updates.nickname),
      };
    }

    const success = set(STORAGE_KEYS.PROFILE, updatedProfile);
    if (success) {
      setProfile(updatedProfile);
    }
    return success;
  };

  /**
   * Delete profile (reset)
   */
  const deleteProfile = (): boolean => {
    const success = set(STORAGE_KEYS.PROFILE, null);
    if (success) {
      setProfile(null);
      setIsNewUser(true);
    }
    return success;
  };

  return {
    profile,
    isLoading,
    isNewUser,
    createProfile,
    updateProfile,
    deleteProfile,
  };
}
