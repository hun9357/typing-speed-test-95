"use client";

import { useState, useEffect } from 'react';
import { useDailyQuests } from '@/hooks/useDailyQuests';
import { getTimeUntilMidnight } from '@/lib/daily-quests';

export default function DailyQuestPanel() {
  const { quests, allCompleted, bonusClaimed, completedCount, claimBonus } = useDailyQuests();
  const [isExpanded, setIsExpanded] = useState(true);
  const [timeUntilReset, setTimeUntilReset] = useState({ hours: 0, minutes: 0 });

  // Update countdown timer
  useEffect(() => {
    const updateTimer = () => {
      setTimeUntilReset(getTimeUntilMidnight());
    };

    updateTimer();
    const interval = setInterval(updateTimer, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  const handleClaimBonus = () => {
    claimBonus();
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl">📋</span>
          <h2 className="text-xl font-bold text-gray-900">Daily Quests</h2>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm font-semibold text-gray-600">
            {completedCount}/{quests.length} completed
          </span>
          <svg
            className={`w-5 h-5 text-gray-600 transition-transform ${
              isExpanded ? 'rotate-180' : ''
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </button>

      {/* Content */}
      {isExpanded && (
        <div className="px-6 pb-6">
          <div className="h-px bg-gray-200 mb-6" />

          {/* Quest List */}
          <div className="space-y-4">
            {quests.map((quest) => (
              <div
                key={quest.id}
                className={`p-4 rounded-xl border-l-4 transition-all ${
                  quest.completed
                    ? 'bg-green-50 border-green-500'
                    : 'bg-gray-50 border-gray-300'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1">
                    <span className="text-2xl">{quest.icon}</span>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-gray-900">{quest.title}</h3>
                        {quest.completed && (
                          <span className="text-green-600">✓</span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{quest.description}</p>

                      {/* Progress Bar */}
                      {!quest.completed && (
                        <div className="mt-3">
                          <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                            <span>
                              {quest.type === 'no_errors'
                                ? quest.current === 0
                                  ? 'Not completed'
                                  : 'Completed'
                                : `${quest.current}/${quest.target}`}
                            </span>
                            <span>
                              {quest.type === 'no_errors'
                                ? ''
                                : `${Math.round((quest.current / quest.target) * 100)}%`}
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                            <div
                              className="bg-primary h-full transition-all duration-300 rounded-full"
                              style={{
                                width:
                                  quest.type === 'no_errors'
                                    ? '0%'
                                    : `${Math.min((quest.current / quest.target) * 100, 100)}%`,
                              }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* XP Reward */}
                  <div className="text-right">
                    <span className="inline-block bg-yellow-100 text-yellow-800 text-xs font-bold px-2 py-1 rounded">
                      +{quest.xpReward} XP
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Bonus Section */}
          <div className="mt-6">
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🎁</span>
                  <span className="font-semibold text-gray-900">
                    {allCompleted
                      ? bonusClaimed
                        ? 'Bonus Claimed!'
                        : 'Bonus Ready!'
                      : 'Complete all 3 for +200 XP bonus!'}
                  </span>
                </div>
                {allCompleted && !bonusClaimed && (
                  <button
                    onClick={handleClaimBonus}
                    className="bg-gradient-to-r from-yellow-400 to-orange-400 hover:from-yellow-500 hover:to-orange-500 text-white font-bold px-4 py-2 rounded-lg transition-all shadow-md hover:shadow-lg transform hover:scale-105"
                  >
                    Claim +200 XP
                  </button>
                )}
                {bonusClaimed && (
                  <span className="text-green-600 font-bold">✓ Claimed</span>
                )}
              </div>
            </div>
          </div>

          {/* Reset Timer */}
          <div className="mt-4 text-center">
            <p className="text-xs text-gray-500">
              Resets in {timeUntilReset.hours}h {timeUntilReset.minutes}m
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
