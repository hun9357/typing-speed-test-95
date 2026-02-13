"use client";

import { useState, useEffect, useRef } from "react";
import confetti from "canvas-confetti";
import Timer from "./Timer";
import StreakDisplay from "./StreakDisplay";
import { useStreak } from "@/hooks/useStreak";
import { saveTestRecord, getStatistics } from "@/lib/test-recorder";
import { useXP } from "@/hooks/useXP";
import { useAchievements } from "@/hooks/useAchievements";
import { useDailyQuests } from "@/hooks/useDailyQuests";
import { calculateTestXP } from "@/lib/xp-system";
import XPGainDisplay from "./XPGainDisplay";
import AchievementUnlockModal from "./AchievementUnlockModal";
import LevelUpModal from "./LevelUpModal";
import { QuestCompleteToastContainer } from "./QuestCompleteToast";
import ShareResultCard from "./ShareResultCard";

interface DailyChallengeProps {
  passage: string;
  onComplete: (wpm: number, accuracy: number) => void;
}

type TestState = "idle" | "running" | "finished";

export default function DailyChallenge({ passage, onComplete }: DailyChallengeProps) {
  const [testState, setTestState] = useState<TestState>("idle");
  const [userInput, setUserInput] = useState("");
  const [timeLeft, setTimeLeft] = useState(60);
  const [startTime, setStartTime] = useState<number | null>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const { getTodayProgress, recordCompletion, streakData } = useStreak();
  const [showShare, setShowShare] = useState(false);

  // XP and achievement hooks
  const xpHook = useXP();
  const achievementsHook = useAchievements();
  const questsHook = useDailyQuests();
  const [xpReward, setXpReward] = useState<ReturnType<typeof calculateTestXP> | null>(null);
  const [currentAchievement, setCurrentAchievement] = useState<number>(0);

  const todayProgress = getTodayProgress();
  const alreadyCompleted = todayProgress?.completed || false;

  // Calculate metrics
  const calculateMetrics = () => {
    const totalChars = userInput.length;
    const elapsedMinutes = startTime ? (60 - timeLeft) / 60 : 0;

    // WPM = (total characters / 5) / elapsed minutes
    const wpm = elapsedMinutes > 0 ? (totalChars / 5) / elapsedMinutes : 0;

    // Calculate errors and accuracy
    let errors = 0;
    for (let i = 0; i < userInput.length; i++) {
      if (userInput[i] !== passage[i]) {
        errors++;
      }
    }

    const accuracy = totalChars > 0 ? ((totalChars - errors) / totalChars) * 100 : 100;

    return { wpm, accuracy, errors };
  };

  const metrics = calculateMetrics();

  // Start test
  const startTest = () => {
    if (alreadyCompleted) return; // Don't allow restart if already completed

    setTestState("running");
    setUserInput("");
    setTimeLeft(60);
    setStartTime(Date.now());

    // Focus input
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);

    // Start timer
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          finishTest();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Finish test
  const finishTest = () => {
    setTestState("finished");
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    // Calculate final metrics
    const finalMetrics = calculateMetrics();

    // Get previous best WPM before saving
    const stats = getStatistics();
    const previousBestWpm = stats.bestWpm;

    // Save test record
    const testRecord = saveTestRecord({
      mode: 'daily',
      wpm: Math.round(finalMetrics.wpm),
      accuracy: finalMetrics.accuracy,
      errors: finalMetrics.errors,
      charsTyped: userInput.length,
      duration: 60 - timeLeft,
    });

    // Record completion
    recordCompletion(Math.round(finalMetrics.wpm), finalMetrics.accuracy);

    // Update quest progress
    questsHook.updateProgress(testRecord, previousBestWpm);

    // Calculate XP with Daily 2x bonus
    const reward = calculateTestXP(
      Math.round(finalMetrics.wpm),
      finalMetrics.accuracy,
      'daily',
      streakData.currentStreak
    );
    setXpReward(reward);

    // Add XP
    xpHook.addXP(reward.totalXP, 'Daily challenge completion');

    // Check for new achievements
    achievementsHook.checkAndUpdate();

    onComplete(Math.round(finalMetrics.wpm), finalMetrics.accuracy);

    // Trigger confetti
    const duration = 2000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const randomInRange = (min: number, max: number) => {
      return Math.random() * (max - min) + min;
    };

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);

      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      });
    }, 250);
  };

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (testState !== "running") return;

    const value = e.target.value;

    // Don't allow typing beyond passage length
    if (value.length > passage.length) return;

    setUserInput(value);

    // Auto-finish if passage is complete
    if (value.length === passage.length) {
      finishTest();
    }
  };

  // Render character with highlighting
  const renderCharacter = (char: string, index: number) => {
    if (index >= userInput.length) {
      return <span key={index} className="text-gray-400">{char}</span>;
    }

    const isCorrect = userInput[index] === char;
    const className = isCorrect ? "text-green-600 bg-green-50" : "text-red-600 bg-red-50";

    return (
      <span key={index} className={className}>
        {char}
      </span>
    );
  };

  // Already completed view
  if (alreadyCompleted && testState === "idle") {
    return (
      <div className="max-w-2xl mx-auto text-center">
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-8 rounded-lg shadow-lg mb-6 border-2 border-green-200">
          <div className="text-6xl mb-4">✅</div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Challenge Completed!</h2>
          <p className="text-gray-700 mb-6">
            You&apos;ve already completed today&apos;s challenge. Come back tomorrow for a new one!
          </p>

          {todayProgress && (
            <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
              <div className="bg-white p-4 rounded-lg shadow">
                <div className="text-3xl font-bold text-primary mb-1">{todayProgress.wpm}</div>
                <div className="text-sm text-gray-600">WPM</div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow">
                <div className="text-3xl font-bold text-green-600 mb-1">
                  {todayProgress.accuracy.toFixed(1)}%
                </div>
                <div className="text-sm text-gray-600">Accuracy</div>
              </div>
            </div>
          )}

          <div className="mt-6">
            <StreakDisplay streak={streakData.currentStreak} size="large" />
          </div>
        </div>
      </div>
    );
  }

  // Idle state
  if (testState === "idle") {
    return (
      <div className="max-w-2xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Today&apos;s Challenge</h2>

        {/* Blurred passage preview */}
        <div className="bg-white p-8 rounded-lg shadow-lg mb-6 relative overflow-hidden">
          <div className="text-lg leading-relaxed text-gray-600 blur-sm select-none">
            {passage}
          </div>
          <div className="absolute inset-0 flex items-center justify-center bg-white/30 backdrop-blur-sm">
            <div className="text-2xl font-bold text-gray-900">Ready to start?</div>
          </div>
        </div>

        <button
          onClick={startTest}
          className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold px-12 py-4 rounded-lg text-lg transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          START TODAY&apos;S CHALLENGE
        </button>
      </div>
    );
  }

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

  // Finished state
  if (testState === "finished") {
    return (
      <div className="max-w-4xl mx-auto">
        {/* Quest Complete Toasts */}
        <QuestCompleteToastContainer
          quests={questsHook.newlyCompleted}
          onDismiss={questsHook.dismissCompleted}
        />

        {/* Share Result Card */}
        {showShare && (
          <ShareResultCard
            wpm={Math.round(metrics.wpm)}
            accuracy={metrics.accuracy}
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

        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Challenge Complete! 🎉</h2>
          <StreakDisplay streak={streakData.currentStreak} size="large" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-lg border-2 border-primary">
            <div className="text-4xl font-bold text-primary mb-2">{Math.round(metrics.wpm)}</div>
            <div className="text-gray-600 font-semibold">Words Per Minute</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="text-4xl font-bold text-green-600 mb-2">{metrics.accuracy.toFixed(1)}%</div>
            <div className="text-gray-600 font-semibold">Accuracy</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="text-4xl font-bold text-red-600 mb-2">{metrics.errors}</div>
            <div className="text-gray-600 font-semibold">Errors</div>
          </div>
        </div>

        {/* XP Gain Display */}
        {xpReward && (
          <div className="mb-8">
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

        <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-lg p-8 text-center border-2 border-orange-200 mb-6">
          <div className="text-5xl mb-4">🔥</div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            See you tomorrow!
          </h3>
          <p className="text-gray-700">
            Come back tomorrow for a new challenge and keep your streak alive!
          </p>
        </div>

        {/* Share Button */}
        <div className="text-center">
          <button
            onClick={() => setShowShare(true)}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold px-8 py-3 rounded-lg transition-all shadow-lg hover:shadow-xl"
          >
            📤 Share Result
          </button>
        </div>
      </div>
    );
  }

  // Running state
  return (
    <div className="max-w-4xl mx-auto">
      {/* Stats Bar */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-sm text-gray-600 mb-1">WPM</div>
            <div className="text-2xl font-bold text-primary">{Math.round(metrics.wpm)}</div>
          </div>
          <div>
            <div className="text-sm text-gray-600 mb-1">Accuracy</div>
            <div className="text-2xl font-bold text-green-600">{metrics.accuracy.toFixed(1)}%</div>
          </div>
          <div>
            <div className="text-sm text-gray-600 mb-1">Time Left</div>
            <Timer seconds={timeLeft} />
          </div>
        </div>
      </div>

      {/* Passage Display */}
      <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
        <div className="text-xl leading-relaxed font-mono mb-6 select-none">
          {passage.split("").map((char, index) => renderCharacter(char, index))}
        </div>

        {/* Input Area */}
        <textarea
          ref={inputRef}
          value={userInput}
          onChange={handleInputChange}
          className="w-full h-32 p-4 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none font-mono text-lg resize-none"
          placeholder="Start typing here..."
          spellCheck={false}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
        />
      </div>
    </div>
  );
}
