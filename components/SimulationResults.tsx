"use client";

import { useEffect, useState } from "react";
import { SimulationCategory } from "@/types/simulation";
import { generateSimulationFeedback } from "@/lib/simulation-feedback";
import { saveTestRecord, getStatistics } from "@/lib/test-recorder";
import { useXP } from "@/hooks/useXP";
import { useAchievements } from "@/hooks/useAchievements";
import { useStreak } from "@/hooks/useStreak";
import { useDailyQuests } from "@/hooks/useDailyQuests";
import { calculateTestXP } from "@/lib/xp-system";
import XPGainDisplay from "./XPGainDisplay";
import AchievementUnlockModal from "./AchievementUnlockModal";
import LevelUpModal from "./LevelUpModal";
import { QuestCompleteToastContainer } from "./QuestCompleteToast";
import ShareResultCard from "./ShareResultCard";

interface SimulationResultsProps {
  wpm: number;
  accuracy: number;
  errors: number;
  category: SimulationCategory;
  onTryAgain: () => void;
  onChangeCategory: () => void;
  charsTyped?: number;
  duration?: number;
}

export default function SimulationResults({
  wpm,
  accuracy,
  errors,
  category,
  onTryAgain,
  onChangeCategory,
  charsTyped,
  duration,
}: SimulationResultsProps) {
  const feedback = generateSimulationFeedback(category, Math.round(wpm), accuracy);
  const [showShare, setShowShare] = useState(false);

  // XP and achievement hooks
  const xpHook = useXP();
  const achievementsHook = useAchievements();
  const streakHook = useStreak();
  const questsHook = useDailyQuests();
  const [xpReward, setXpReward] = useState<ReturnType<typeof calculateTestXP> | null>(null);
  const [currentAchievement, setCurrentAchievement] = useState<number>(0);

  // Save test record and calculate rewards
  useEffect(() => {
    const stats = getStatistics();
    const previousBestWpm = stats.bestWpm;

    const testRecord = saveTestRecord({
      mode: 'simulation',
      subMode: category,
      wpm: Math.round(wpm),
      accuracy,
      errors,
      charsTyped: charsTyped || 0,
      duration: duration || 60,
    });

    // Update streak
    streakHook.recordCompletion(Math.round(wpm), accuracy);

    // Update quest progress
    questsHook.updateProgress(testRecord, previousBestWpm);

    // Calculate XP
    const reward = calculateTestXP(
      Math.round(wpm),
      accuracy,
      'simulation',
      streakHook.streakData.currentStreak
    );
    setXpReward(reward);

    // Add XP
    xpHook.addXP(reward.totalXP, 'Simulation completion');

    // Check for new achievements
    achievementsHook.checkAndUpdate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wpm, accuracy, errors, category, charsTyped, duration]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'excellent':
        return '✅';
      case 'good':
        return '✓';
      case 'needs-improvement':
        return '⚠️';
      default:
        return '';
    }
  };

  // Handle achievement modal queue
  const handleDismissAchievement = () => {
    if (achievementsHook.newlyUnlocked[currentAchievement]) {
      achievementsHook.dismissNewAchievement(
        achievementsHook.newlyUnlocked[currentAchievement].id
      );
    }
    setCurrentAchievement(prev => prev + 1);
  };

  const showingAchievement = currentAchievement < achievementsHook.newlyUnlocked.length;
  const currentAchievementDef = showingAchievement
    ? achievementsHook.newlyUnlocked[currentAchievement]
    : null;

  return (
    <div className="max-w-3xl mx-auto">
      {/* Quest Complete Toasts */}
      <QuestCompleteToastContainer
        quests={questsHook.newlyCompleted}
        onDismiss={questsHook.dismissCompleted}
      />

      {/* Share Result Card */}
      {showShare && (
        <ShareResultCard
          wpm={Math.round(wpm)}
          accuracy={accuracy}
          onClose={() => setShowShare(false)}
        />
      )}

      {/* Achievement Unlock Modal */}
      {currentAchievementDef && (
        <AchievementUnlockModal
          achievement={currentAchievementDef}
          onClose={handleDismissAchievement}
        />
      )}

      {/* Level Up Modal */}
      {xpHook.leveledUp && !showingAchievement && (
        <LevelUpModal
          oldLevel={xpHook.previousLevel}
          newLevel={xpHook.level}
          totalXP={xpHook.totalXP}
          nextLevelXP={xpHook.nextLevelXP}
          onClose={xpHook.dismissLevelUp}
        />
      )}

      {/* Header */}
      <div className="text-center mb-8">
        <div className="text-5xl mb-4">✅</div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">SIMULATION COMPLETE!</h2>
      </div>

      {/* Results Card */}
      <div className="bg-white rounded-lg shadow-xl p-8 mb-6">
        <h3 className="text-xl font-bold text-gray-900 mb-6 border-b pb-3">Your Results</h3>
        <div className="grid grid-cols-3 gap-6 text-center mb-8">
          <div>
            <div className="text-sm text-gray-600 mb-2">Speed</div>
            <div className="text-3xl font-bold text-primary">{Math.round(wpm)} WPM</div>
          </div>
          <div>
            <div className="text-sm text-gray-600 mb-2">Accuracy</div>
            <div className="text-3xl font-bold text-green-600">{accuracy.toFixed(1)}%</div>
          </div>
          <div>
            <div className="text-sm text-gray-600 mb-2">Errors</div>
            <div className="text-3xl font-bold text-red-600">{errors}</div>
          </div>
        </div>

        {/* XP Gain Display */}
        {xpReward && (
          <div className="mb-6">
            <XPGainDisplay
              reward={xpReward}
              level={xpHook.level}
              currentLevelXP={xpHook.currentLevelXP}
              nextLevelXP={xpHook.nextLevelXP}
              progress={xpHook.progress}
              totalXP={xpHook.totalXP}
            />
          </div>
        )}

        {/* Feedback Title */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 mb-6">
          <h4 className="text-xl font-bold text-gray-900 mb-2">{feedback.title}</h4>
          <p className="text-gray-700">{feedback.message}</p>
        </div>

        {/* Practical Insights */}
        <div className="mb-6">
          <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            💼 REAL-WORLD INSIGHT
          </h4>
          <div className="space-y-2">
            {feedback.practicalInsights.map((insight, index) => (
              <div key={index} className="flex items-start gap-2">
                <span className="text-primary font-bold mt-1">•</span>
                <p className="text-gray-700">{insight}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Job Readiness */}
        {feedback.jobReadiness.length > 0 && (
          <div>
            <h4 className="text-lg font-bold text-gray-900 mb-4">Job Readiness Assessment</h4>
            <div className="space-y-3">
              {feedback.jobReadiness.map((job, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <span className="font-medium text-gray-900">{job.role}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{getStatusIcon(job.status)}</span>
                    <span
                      className={`text-sm font-semibold ${
                        job.status === 'excellent'
                          ? 'text-green-600'
                          : job.status === 'good'
                          ? 'text-blue-600'
                          : 'text-orange-600'
                      }`}
                    >
                      {job.status === 'excellent'
                        ? 'Excellent'
                        : job.status === 'good'
                        ? 'Good'
                        : 'Needs Improvement'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          onClick={onTryAgain}
          className="bg-primary hover:bg-blue-600 text-white font-semibold px-8 py-3 rounded-lg transition-colors shadow-lg hover:shadow-xl"
        >
          Try Another Scenario
        </button>
        <button
          onClick={onChangeCategory}
          className="bg-white hover:bg-gray-50 text-gray-900 font-semibold px-8 py-3 rounded-lg transition-colors shadow-lg hover:shadow-xl border-2 border-gray-300"
        >
          Change Category
        </button>
        <button
          onClick={() => setShowShare(true)}
          className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold px-8 py-3 rounded-lg transition-all shadow-lg hover:shadow-xl"
        >
          📤 Share
        </button>
      </div>
    </div>
  );
}
