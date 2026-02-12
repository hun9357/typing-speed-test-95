"use client";

import { useState } from "react";
import Link from "next/link";
import DailyChallenge from "@/components/DailyChallenge";
import CalendarView from "@/components/CalendarView";
import StreakDisplay from "@/components/StreakDisplay";
import { useStreak } from "@/hooks/useStreak";
import { getTodayPassage, getTodayDateString, getDayNumber } from "@/lib/daily-passage";

export default function DailyPage() {
  const { streakData, isLoading, getTodayProgress } = useStreak();
  const [showChallenge, setShowChallenge] = useState(false);

  const todayPassage = getTodayPassage();
  const todayDate = getTodayDateString();
  const dayNumber = getDayNumber(todayDate);
  const todayProgress = getTodayProgress();

  const handleComplete = () => {
    // Challenge component handles recording, just update view
    setShowChallenge(false);
  };

  if (isLoading) {
    return (
      <main className="min-h-screen py-8 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-gray-600">Loading...</div>
        </div>
      </main>
    );
  }

  if (showChallenge) {
    return (
      <main className="min-h-screen py-8 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <button
              onClick={() => setShowChallenge(false)}
              className="inline-block text-primary hover:text-blue-600 font-semibold mb-4"
            >
              ← Back to Daily Challenge
            </button>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
              Daily Challenge #{dayNumber}
            </h1>
          </div>

          {/* Test Component */}
          <DailyChallenge
            passage={todayPassage}
            onComplete={handleComplete}
          />
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block text-primary hover:text-blue-600 font-semibold mb-4">
            ← Back to Home
          </Link>
        </div>

        {/* Title with Streak */}
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div>
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-2">
              🔥 TODAY&apos;S CHALLENGE
            </h1>
            <p className="text-gray-600">Daily Challenge #{dayNumber}</p>
          </div>
          <div className="text-right">
            <StreakDisplay streak={streakData.currentStreak} size="large" />
          </div>
        </div>

        {/* Challenge Preview */}
        <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-xl shadow-xl p-8 mb-8 border-2 border-orange-200">
          <div className="text-center mb-6">
            <div className="inline-block bg-white px-6 py-3 rounded-full shadow-md mb-4">
              <div className="text-sm text-gray-600 font-semibold">
                {new Date(todayDate).toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>
            </div>
          </div>

          {/* Blurred preview */}
          <div className="bg-white p-6 rounded-lg mb-6 relative overflow-hidden">
            <div className="text-base text-gray-600 blur-sm select-none line-clamp-3">
              {todayPassage}
            </div>
            <div className="absolute inset-0 flex items-center justify-center bg-white/50 backdrop-blur-sm">
              <div className="text-center">
                <div className="text-lg font-semibold text-gray-900 mb-1">
                  Today&apos;s Passage
                </div>
                <div className="text-sm text-gray-600">
                  Start the challenge to reveal
                </div>
              </div>
            </div>
          </div>

          <div className="text-center">
            <button
              onClick={() => setShowChallenge(true)}
              disabled={todayProgress?.completed}
              className={`${
                todayProgress?.completed
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 transform hover:scale-105"
              } text-white font-bold px-12 py-4 rounded-lg text-lg transition-all shadow-lg hover:shadow-xl`}
            >
              {todayProgress?.completed ? "✓ COMPLETED TODAY" : "START TODAY'S CHALLENGE"}
            </button>
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-white rounded-xl shadow-xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            📊 YOUR STATS
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
              <div className="text-sm text-gray-600 font-semibold mb-2">Today&apos;s Best</div>
              {todayProgress?.completed ? (
                <>
                  <div className="text-3xl font-bold text-primary mb-1">{todayProgress.wpm}</div>
                  <div className="text-sm text-gray-600">WPM</div>
                  <div className="text-lg font-bold text-green-600 mt-2">
                    {todayProgress.accuracy.toFixed(1)}%
                  </div>
                </>
              ) : (
                <div className="text-2xl text-gray-400">-- / --%</div>
              )}
            </div>

            <div className="text-center p-6 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg">
              <div className="text-sm text-gray-600 font-semibold mb-2">Current Streak</div>
              <div className="text-3xl font-bold text-orange-600 mb-1">
                {streakData.currentStreak}
              </div>
              <div className="text-sm text-gray-600">days 🔥</div>
            </div>

            <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg">
              <div className="text-sm text-gray-600 font-semibold mb-2">Longest Streak</div>
              <div className="text-3xl font-bold text-purple-600 mb-1">
                {streakData.longestStreak}
              </div>
              <div className="text-sm text-gray-600">days 🏆</div>
            </div>
          </div>
        </div>

        {/* Calendar View */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">CALENDAR VIEW</h2>
          <CalendarView history={streakData.history} />
        </div>

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-gray-200 text-center text-gray-600 text-sm">
          <p>&copy; {new Date().getFullYear()} Typing Speed Test. All rights reserved.</p>
        </footer>
      </div>
    </main>
  );
}
