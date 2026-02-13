"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useAchievements, AchievementWithStatus } from '@/hooks/useAchievements';
import { AchievementTier } from '@/lib/achievements';

const TIER_COLORS: Record<AchievementTier, string> = {
  bronze: 'border-orange-300 bg-orange-50',
  silver: 'border-gray-300 bg-gray-50',
  gold: 'border-yellow-400 bg-yellow-50',
  diamond: 'border-purple-400 bg-purple-50',
};

const CATEGORIES = [
  { id: 'all', name: 'All' },
  { id: 'speed', name: 'Speed' },
  { id: 'accuracy', name: 'Accuracy' },
  { id: 'streak', name: 'Streak' },
  { id: 'endurance', name: 'Endurance' },
  { id: 'explorer', name: 'Explorer' },
  { id: 'special', name: 'Special' },
];

function AchievementCard({ achievement }: { achievement: AchievementWithStatus }) {
  const { def, unlocked, unlockedAt, progress } = achievement;
  const isLocked = !unlocked;
  const isHidden = def.hidden && isLocked;

  return (
    <div
      className={`
        rounded-2xl border-2 p-6 transition-all
        ${unlocked ? TIER_COLORS[def.tier] : 'border-gray-200 bg-gray-50 opacity-50'}
        ${unlocked ? 'hover:shadow-lg' : ''}
      `}
    >
      {/* Icon */}
      <div
        className={`text-5xl text-center mb-3 ${
          isLocked ? 'grayscale opacity-50' : ''
        }`}
      >
        {isHidden ? '🔒' : def.icon}
      </div>

      {/* Name & Tier */}
      <div className="text-center mb-2">
        <h3 className="text-lg font-bold text-gray-800 mb-1">
          {isHidden ? '???' : def.name}
        </h3>
        <p className="text-xs uppercase tracking-wider font-bold text-gray-500">
          {def.tier}
        </p>
      </div>

      {/* Description */}
      <p className="text-sm text-gray-600 text-center mb-3">
        {isHidden ? 'Hidden achievement' : def.description}
      </p>

      {/* Progress Bar (if in progress) */}
      {!unlocked && progress && progress.current > 0 && (
        <div className="mb-3">
          <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
            <span>Progress</span>
            <span>
              {progress.current} / {progress.target}
            </span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary to-purple-500 transition-all"
              style={{
                width: `${(progress.current / progress.target) * 100}%`,
              }}
            />
          </div>
        </div>
      )}

      {/* XP Reward */}
      <div className="text-center">
        <span className="inline-block bg-gradient-to-r from-primary to-purple-500 text-white text-xs font-bold px-3 py-1 rounded-full">
          +{def.xpReward} XP
        </span>
      </div>

      {/* Unlocked Date */}
      {unlocked && unlockedAt && (
        <div className="text-xs text-gray-400 text-center mt-2">
          Unlocked {new Date(unlockedAt).toLocaleDateString()}
        </div>
      )}
    </div>
  );
}

export default function AchievementsPage() {
  const { achievements, unlockedCount, totalCount, getByCategory } = useAchievements();
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredAchievements = getByCategory(selectedCategory);

  const unlocked = filteredAchievements.filter(a => a.unlocked);
  const inProgress = filteredAchievements.filter(
    a => !a.unlocked && a.progress && a.progress.current > 0
  );
  const locked = filteredAchievements.filter(
    a => !a.unlocked && (!a.progress || a.progress.current === 0)
  );

  // Suppress unused warning - we're using filteredAchievements through the above filters
  void achievements;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/profile"
            className="inline-flex items-center gap-2 text-primary hover:underline mb-4"
          >
            ← Back to Profile
          </Link>
          <div className="flex items-center justify-between">
            <h1 className="text-4xl font-black text-gray-800">Achievements</h1>
            <div className="text-2xl font-bold text-gray-600">
              {unlockedCount} / {totalCount}
            </div>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2 mb-8">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`
                px-4 py-2 rounded-full font-medium text-sm transition-all
                ${
                  selectedCategory === cat.id
                    ? 'bg-primary text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                }
              `}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Unlocked Achievements */}
        {unlocked.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-black text-gray-800 mb-4">
              ═══ Unlocked ({unlocked.length}) ═══
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {unlocked.map(achievement => (
                <AchievementCard
                  key={achievement.def.id}
                  achievement={achievement}
                />
              ))}
            </div>
          </div>
        )}

        {/* In Progress */}
        {inProgress.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-black text-gray-800 mb-4">
              ═══ In Progress ({inProgress.length}) ═══
            </h2>
            <div className="space-y-4">
              {inProgress.map(achievement => (
                <div
                  key={achievement.def.id}
                  className="bg-white rounded-2xl border-2 border-gray-200 p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-start gap-4">
                    <div className="text-4xl">{achievement.def.icon}</div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="text-lg font-bold text-gray-800">
                            {achievement.def.name}
                          </h3>
                          <p className="text-xs uppercase tracking-wider font-bold text-gray-500">
                            {achievement.def.tier}
                          </p>
                        </div>
                        <span className="text-xs bg-primary text-white font-bold px-3 py-1 rounded-full">
                          +{achievement.def.xpReward} XP
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">
                        {achievement.def.description}
                      </p>
                      {achievement.progress && (
                        <div>
                          <div className="flex items-center justify-between text-sm mb-1">
                            <span className="text-gray-600">Your progress:</span>
                            <span className="font-bold text-gray-800">
                              {achievement.progress.current} / {achievement.progress.target}
                              <span className="text-gray-500 ml-1">
                                ({Math.floor(
                                  (achievement.progress.current /
                                    achievement.progress.target) *
                                    100
                                )}
                                %)
                              </span>
                            </span>
                          </div>
                          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-primary to-purple-500 transition-all"
                              style={{
                                width: `${
                                  (achievement.progress.current /
                                    achievement.progress.target) *
                                  100
                                }%`,
                              }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Locked Achievements */}
        {locked.length > 0 && (
          <div>
            <h2 className="text-2xl font-black text-gray-800 mb-4">
              ═══ Locked ({locked.length}) ═══
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {locked.map(achievement => (
                <AchievementCard
                  key={achievement.def.id}
                  achievement={achievement}
                />
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {filteredAchievements.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No achievements in this category yet.
          </div>
        )}
      </div>
    </div>
  );
}
