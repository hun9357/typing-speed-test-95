"use client";

import { useEffect, useState } from "react";
import type { BattleResult } from "@/lib/battle-types";
import { saveTestRecord, getStatistics } from "@/lib/test-recorder";
import { saveBattleRecord } from "@/lib/battle-stats";
import { useXP } from "@/hooks/useXP";
import { useAchievements } from "@/hooks/useAchievements";
import { useStreak } from "@/hooks/useStreak";
import { useDailyQuests } from "@/hooks/useDailyQuests";
import { calculateTestXP } from "@/lib/xp-system";
import XPGainDisplay from "../XPGainDisplay";
import AchievementUnlockModal from "../AchievementUnlockModal";
import LevelUpModal from "../LevelUpModal";
import { QuestCompleteToastContainer } from "../QuestCompleteToast";
import ShareResultCard from "../ShareResultCard";
import Link from "next/link";

interface BattleResultsProps {
  result: BattleResult;
  myId: string;
  onRematch: () => void;
  onNewOpponent: () => void;
  onHome: () => void;
}

export default function BattleResults({
  result,
  myId,
  onRematch,
  onNewOpponent,
  onHome,
}: BattleResultsProps) {
  const isWinner = result.winner === myId;
  const isDraw = result.winner === null;

  const players = Object.entries(result.players);
  const me = players.find(([id]) => id === myId)?.[1];
  const opponent = players.find(([id]) => id !== myId)?.[1];

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
    if (me && opponent) {
      const stats = getStatistics();
      const previousBestWpm = stats.bestWpm;

      const testRecord = saveTestRecord({
        mode: 'battle',
        wpm: me.wpm,
        accuracy: me.accuracy,
        errors: me.errors,
        charsTyped: me.charsTyped,
        duration: 60,
      });

      // Save battle record for stats tracking
      saveBattleRecord({
        myWpm: me.wpm,
        myAccuracy: me.accuracy,
        opponentWpm: opponent.wpm,
        opponentAccuracy: opponent.accuracy,
        opponentName: opponent.displayName,
        result: isDraw ? 'draw' : isWinner ? 'win' : 'lose',
        wpmDiff: me.wpm - opponent.wpm,
      });

      // Update streak
      streakHook.recordCompletion(me.wpm, me.accuracy);

      // Update quest progress
      questsHook.updateProgress(testRecord, previousBestWpm);

      // Calculate XP
      const reward = calculateTestXP(
        me.wpm,
        me.accuracy,
        'battle',
        streakHook.streakData.currentStreak
      );
      setXpReward(reward);

      // Add XP
      xpHook.addXP(reward.totalXP, 'Battle completion');

      // Check for new achievements
      achievementsHook.checkAndUpdate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [me, opponent]);

  // Confetti on victory
  useEffect(() => {
    if (isWinner) {
      import("canvas-confetti").then((confetti) => {
        const fire = confetti.default;
        fire({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
        setTimeout(
          () => fire({ particleCount: 60, spread: 100, origin: { y: 0.5 } }),
          300
        );
      });
    }
  }, [isWinner]);

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
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
      {/* Quest Complete Toasts */}
      <QuestCompleteToastContainer
        quests={questsHook.newlyCompleted}
        onDismiss={questsHook.dismissCompleted}
      />

      {/* Share Result Card */}
      {showShare && me && (
        <ShareResultCard
          wpm={me.wpm}
          accuracy={me.accuracy}
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

      {/* Result header */}
      <div className="mb-8">
        {isWinner && (
          <div className="animate-bounce">
            <div className="text-6xl md:text-7xl mb-2">&#127942;</div>
            <h2 className="text-4xl md:text-5xl font-black text-yellow-400">
              VICTORY!
            </h2>
          </div>
        )}
        {!isWinner && !isDraw && (
          <div>
            <div className="text-5xl md:text-6xl mb-2">&#128532;</div>
            <h2 className="text-4xl md:text-5xl font-black text-gray-400">
              DEFEAT
            </h2>
          </div>
        )}
        {isDraw && (
          <div>
            <div className="text-5xl md:text-6xl mb-2">&#129309;</div>
            <h2 className="text-4xl md:text-5xl font-black text-purple-400">
              DRAW!
            </h2>
          </div>
        )}
      </div>

      {/* Stats comparison */}
      <div className="flex flex-col md:flex-row gap-4 md:gap-6 mb-8 w-full max-w-2xl">
        {/* My stats */}
        <div
          className={`flex-1 rounded-2xl p-6 border-2 ${
            isWinner
              ? "bg-yellow-500/10 border-yellow-500/40"
              : "bg-gray-800/60 border-gray-700"
          }`}
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-3 h-3 rounded-full bg-blue-500" />
            <span className="text-blue-400 font-bold text-lg">
              {me?.displayName ?? "You"}
            </span>
          </div>

          <div className="space-y-3">
            <div>
              <div className="text-3xl font-black text-white">
                {me?.wpm ?? 0}
              </div>
              <div className="text-xs text-gray-500 uppercase tracking-wider">
                WPM
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <div className="text-lg font-bold text-gray-300">
                  {me?.accuracy.toFixed(1) ?? 0}%
                </div>
                <div className="text-xs text-gray-500">Accuracy</div>
              </div>
              <div>
                <div className="text-lg font-bold text-gray-300">
                  {me?.errors ?? 0}
                </div>
                <div className="text-xs text-gray-500">Errors</div>
              </div>
            </div>
            <div className="text-xs text-gray-500">
              {me?.charsTyped ?? 0} characters typed
            </div>
          </div>

          {isWinner && (
            <div className="mt-4 text-yellow-400 font-bold text-sm">
              &#9733; WINNER &#9733;
            </div>
          )}
        </div>

        {/* Opponent stats */}
        <div className="flex-1 rounded-2xl p-6 bg-gray-800/60 border-2 border-gray-700">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <span className="text-red-400 font-bold text-lg">
              {opponent?.displayName ?? "Opponent"}
            </span>
          </div>

          <div className="space-y-3">
            <div>
              <div className="text-3xl font-black text-white">
                {opponent?.wpm ?? 0}
              </div>
              <div className="text-xs text-gray-500 uppercase tracking-wider">
                WPM
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <div className="text-lg font-bold text-gray-300">
                  {opponent?.accuracy.toFixed(1) ?? 0}%
                </div>
                <div className="text-xs text-gray-500">Accuracy</div>
              </div>
              <div>
                <div className="text-lg font-bold text-gray-300">
                  {opponent?.errors ?? 0}
                </div>
                <div className="text-xs text-gray-500">Errors</div>
              </div>
            </div>
            <div className="text-xs text-gray-500">
              {opponent?.charsTyped ?? 0} characters typed
            </div>
          </div>

          {result.winner && result.winner !== myId && (
            <div className="mt-4 text-red-400 font-bold text-sm">
              &#9733; WINNER &#9733;
            </div>
          )}
        </div>
      </div>

      {/* Margin info */}
      {!isDraw && (
        <p className="text-gray-400 text-sm mb-8">
          WPM Difference:{" "}
          <span className={isWinner ? "text-green-400" : "text-red-400"}>
            {isWinner ? "+" : "-"}
            {result.margin.wpmDiff} WPM
          </span>
        </p>
      )}

      {!isWinner && !isDraw && (
        <p className="text-gray-500 text-sm mb-6">
          Need <span className="text-orange-400">+{result.margin.wpmDiff} WPM</span> to
          win next time!
        </p>
      )}

      {/* XP Gain Display */}
      {xpReward && (
        <div className="w-full max-w-md mb-6">
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

      {/* Action buttons */}
      <div className="flex flex-col sm:flex-row gap-3 w-full max-w-md mb-3">
        <button
          onClick={onRematch}
          className="flex-1 px-6 py-3.5 bg-gradient-to-r from-red-500 to-orange-500 text-white font-bold rounded-xl hover:scale-[1.02] hover:shadow-lg hover:shadow-red-500/20 transition-all text-sm"
        >
          &#128260; Rematch
        </button>
        <button
          onClick={onNewOpponent}
          className="flex-1 px-6 py-3.5 border border-gray-600 text-gray-300 font-medium rounded-xl hover:border-gray-500 hover:bg-gray-800/50 transition-all text-sm"
        >
          &#128269; New Opponent
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <button
          onClick={() => setShowShare(true)}
          className="px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-xl text-sm"
        >
          📤 Share Result
        </button>

        <Link
          href="/battle/stats"
          className="px-6 py-2 bg-gray-800 border border-gray-600 hover:border-gray-500 hover:bg-gray-700 text-gray-300 font-semibold rounded-xl transition-all text-sm text-center"
        >
          &#128202; View Stats
        </Link>
      </div>

      <button
        onClick={onHome}
        className="text-gray-500 hover:text-gray-400 text-sm transition-colors"
      >
        &#127968; Back to Home
      </button>
    </div>
  );
}
