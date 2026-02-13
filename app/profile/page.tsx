"use client";

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useProfile } from '@/hooks/useProfile';
import { useTestHistory } from '@/hooks/useTestHistory';
import { useStreak } from '@/hooks/useStreak';
import { useXP } from '@/hooks/useXP';
import { useAchievements } from '@/hooks/useAchievements';
import XPBar from '@/components/XPBar';
import Avatar from '@/components/Avatar';

export default function ProfilePage() {
  const router = useRouter();
  const { profile, isLoading: profileLoading } = useProfile();
  const { statistics, getRecent, getChartData, isLoading: historyLoading } = useTestHistory();
  const { streakData } = useStreak();
  const xpHook = useXP();
  const { unlockedCount, totalCount } = useAchievements();

  const recentTests = getRecent(5);
  const chartData = getChartData(20);

  // Redirect to home if no profile (shouldn't happen but safety)
  useEffect(() => {
    if (!profileLoading && !profile) {
      router.push('/');
    }
  }, [profile, profileLoading, router]);

  if (profileLoading || historyLoading || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Loading profile...</div>
      </div>
    );
  }


  // Simple sparkline SVG generator
  const generateSparkline = () => {
    if (chartData.length < 2) return null;

    const width = 400;
    const height = 60;
    const padding = 5;

    const wpms = chartData.map(d => d.wpm);
    const maxWpm = Math.max(...wpms);
    const minWpm = Math.min(...wpms);
    const range = maxWpm - minWpm || 1;

    const points = chartData.map((d, i) => {
      const x = (i / (chartData.length - 1)) * (width - padding * 2) + padding;
      const y = height - padding - ((d.wpm - minWpm) / range) * (height - padding * 2);
      return `${x},${y}`;
    }).join(' ');

    return (
      <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
        <polyline
          points={points}
          fill="none"
          stroke="#3B82F6"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {chartData.map((d, i) => {
          const x = (i / (chartData.length - 1)) * (width - padding * 2) + padding;
          const y = height - padding - ((d.wpm - minWpm) / range) * (height - padding * 2);
          return (
            <circle
              key={i}
              cx={x}
              cy={y}
              r="3"
              fill="#3B82F6"
            />
          );
        })}
      </svg>
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const formatJoinDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'long',
      year: 'numeric',
    }).format(date);
  };

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <Link
            href="/"
            className="text-primary hover:text-blue-600 font-semibold flex items-center gap-2"
          >
            ← Home
          </Link>
          <Link
            href="/profile/avatar"
            className="text-gray-600 hover:text-gray-900 font-semibold"
          >
            Customize Avatar
          </Link>
        </div>

        {/* Profile Header */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6 text-center">
          {/* Avatar */}
          <div className="mx-auto mb-4 flex justify-center">
            <Avatar
              initial={profile.avatar.initial}
              bgColor={profile.avatar.bgColor}
              frameId={profile.avatar.frameId}
              patternId={profile.avatar.patternId}
              size="xl"
            />
          </div>

          {/* Name & Level */}
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{profile.nickname}</h1>

          {/* XP Bar */}
          <div className="max-w-md mx-auto mb-4">
            <XPBar
              level={xpHook.level}
              currentLevelXP={xpHook.currentLevelXP}
              nextLevelXP={xpHook.nextLevelXP}
              progress={xpHook.progress}
              totalXP={xpHook.totalXP}
              compact={false}
              animated={false}
            />
          </div>

          {/* Join Date */}
          <p className="text-sm text-gray-500">
            Joined {formatJoinDate(profile.createdAt)}
          </p>
        </div>

        {/* Personal Stats */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            📊 Personal Stats
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-3xl font-bold text-primary">
                {statistics.bestWpm > 0 ? Math.round(statistics.bestWpm) : '--'}
              </div>
              <div className="text-xs text-gray-600 mt-1">WPM Best</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-3xl font-bold text-green-600">
                {statistics.bestAccuracy > 0 ? Math.round(statistics.bestAccuracy) : '--'}
              </div>
              <div className="text-xs text-gray-600 mt-1">% Best</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-3xl font-bold text-purple-600">
                {statistics.totalTests}
              </div>
              <div className="text-xs text-gray-600 mt-1">Tests</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-3xl font-bold text-orange-600">
                {streakData.currentStreak}
              </div>
              <div className="text-xs text-gray-600 mt-1">Day Streak</div>
            </div>
          </div>
        </div>

        {/* WPM Progress Chart */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            📈 WPM Progress
          </h2>
          {chartData.length >= 2 ? (
            <div className="bg-gray-50 rounded-lg p-4">
              {generateSparkline()}
              <p className="text-xs text-gray-500 text-center mt-2">
                Last {chartData.length} tests
              </p>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p className="mb-2">📊</p>
              <p>Complete more tests to see your progress chart!</p>
            </div>
          )}
        </div>

        {/* Recent Tests */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            🕐 Recent Tests
          </h2>
          {recentTests.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-2 px-2 text-sm font-semibold text-gray-600">Time</th>
                    <th className="text-left py-2 px-2 text-sm font-semibold text-gray-600">Mode</th>
                    <th className="text-center py-2 px-2 text-sm font-semibold text-gray-600">WPM</th>
                    <th className="text-center py-2 px-2 text-sm font-semibold text-gray-600">Accuracy</th>
                  </tr>
                </thead>
                <tbody>
                  {recentTests.map((test) => (
                    <tr key={test.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-2 text-sm text-gray-600">
                        {formatDate(test.timestamp)}
                      </td>
                      <td className="py-3 px-2 text-sm">
                        <span className="capitalize font-medium text-gray-900">
                          {test.mode}
                        </span>
                        {test.subMode && (
                          <span className="text-xs text-gray-500 ml-1">
                            ({test.subMode})
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-2 text-center font-bold text-primary">
                        {Math.round(test.wpm)}
                      </td>
                      <td className="py-3 px-2 text-center font-bold text-green-600">
                        {test.accuracy.toFixed(1)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p className="mb-2">🎯</p>
              <p>Complete a typing test to start tracking your progress!</p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href="/profile/achievements"
            className="flex-1 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-bold py-4 px-6 rounded-lg text-center transition-all shadow-lg hover:shadow-xl"
          >
            🏆 Achievements {unlockedCount}/{totalCount}
          </Link>
          <Link
            href="/history"
            className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-bold py-4 px-6 rounded-lg text-center transition-all shadow-lg hover:shadow-xl"
          >
            📊 Full History
          </Link>
        </div>
      </div>
    </main>
  );
}
