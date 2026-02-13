"use client";

import { useBattleStats } from "@/hooks/useBattleStats";
import { timeAgo } from "@/lib/time-utils";
import Link from "next/link";

export default function BattleStatsPage() {
  const { stats, history, isLoading } = useBattleStats();

  if (isLoading || !stats) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/30 to-gray-900 flex items-center justify-center">
        <div className="text-gray-400">Loading battle stats...</div>
      </div>
    );
  }

  const hasNoBattles = stats.totalBattles === 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/30 to-gray-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link
            href="/battle"
            className="text-gray-400 hover:text-gray-300 transition-colors text-sm"
          >
            &#8592; Battle
          </Link>
          <h1 className="text-3xl md:text-4xl font-black text-white">
            &#9876;&#65039; Battle Stats
          </h1>
          <div className="w-16" /> {/* Spacer for centering */}
        </div>

        {/* Empty State */}
        {hasNoBattles && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="text-6xl mb-4">&#127942;</div>
            <h2 className="text-2xl font-bold text-white mb-3">
              No Battles Yet!
            </h2>
            <p className="text-gray-400 mb-6 max-w-md">
              Start your first battle to see your stats here. Challenge opponents
              and track your progress!
            </p>
            <Link
              href="/battle"
              className="px-8 py-4 bg-gradient-to-r from-red-500 to-orange-500 text-white font-bold rounded-xl hover:scale-[1.02] transition-all shadow-lg"
            >
              &#128308; Start First Battle
            </Link>
          </div>
        )}

        {/* Stats Content */}
        {!hasNoBattles && (
          <div className="space-y-6">
            {/* Battle Record */}
            <div className="bg-gray-800/60 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <span>&#128202;</span> YOUR BATTLE RECORD
              </h2>

              <div className="grid grid-cols-3 gap-4 mb-6">
                {/* Wins */}
                <div className="bg-green-500/20 border border-green-500/40 rounded-xl p-4 text-center">
                  <div className="text-3xl font-black text-green-400">
                    {stats.wins}
                  </div>
                  <div className="text-sm text-green-400/80 font-medium mt-1">
                    WINS
                  </div>
                  <div className="text-2xl mt-2">&#128994;</div>
                </div>

                {/* Losses */}
                <div className="bg-red-500/20 border border-red-500/40 rounded-xl p-4 text-center">
                  <div className="text-3xl font-black text-red-400">
                    {stats.losses}
                  </div>
                  <div className="text-sm text-red-400/80 font-medium mt-1">
                    LOSSES
                  </div>
                  <div className="text-2xl mt-2">&#128308;</div>
                </div>

                {/* Draws */}
                <div className="bg-yellow-500/20 border border-yellow-500/40 rounded-xl p-4 text-center">
                  <div className="text-3xl font-black text-yellow-400">
                    {stats.draws}
                  </div>
                  <div className="text-sm text-yellow-400/80 font-medium mt-1">
                    DRAWS
                  </div>
                  <div className="text-2xl mt-2">&#128993;</div>
                </div>
              </div>

              {/* Win Rate */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-400 text-sm font-medium">
                    Win Rate: {stats.winRate.toFixed(1)}%
                  </span>
                  <span className="text-gray-500 text-xs">
                    Total Battles: {stats.totalBattles}
                  </span>
                </div>
                <div className="w-full bg-gray-700/50 rounded-full h-3 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-green-500 to-emerald-400 transition-all duration-500"
                    style={{ width: `${Math.min(stats.winRate, 100)}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Personal Bests */}
            <div className="bg-gray-800/60 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <span>&#127942;</span> PERSONAL BESTS
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Best WPM */}
                <div className="bg-gray-800/40 rounded-xl p-4 border border-gray-600">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">&#9889;</span>
                    <div className="flex-1">
                      <div className="text-2xl font-black text-yellow-400">
                        {stats.bestWpm}
                      </div>
                      <div className="text-xs text-gray-400">
                        Best WPM in battle
                      </div>
                    </div>
                  </div>
                </div>

                {/* Best Accuracy */}
                <div className="bg-gray-800/40 rounded-xl p-4 border border-gray-600">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">&#127919;</span>
                    <div className="flex-1">
                      <div className="text-2xl font-black text-blue-400">
                        {stats.bestAccuracy.toFixed(1)}%
                      </div>
                      <div className="text-xs text-gray-400">Best Accuracy</div>
                    </div>
                  </div>
                </div>

                {/* Win Streak */}
                <div className="bg-gray-800/40 rounded-xl p-4 border border-gray-600">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">&#128165;</span>
                    <div className="flex-1">
                      <div className="text-2xl font-black text-orange-400">
                        {stats.longestWinStreak}
                      </div>
                      <div className="text-xs text-gray-400">
                        Win Streak{" "}
                        <span className="text-gray-500">
                          (current: {stats.currentWinStreak})
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Avg WPM */}
                <div className="bg-gray-800/40 rounded-xl p-4 border border-gray-600">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">&#128200;</span>
                    <div className="flex-1">
                      <div className="text-2xl font-black text-purple-400">
                        {stats.avgWpm.toFixed(0)}
                      </div>
                      <div className="text-xs text-gray-400">
                        Avg WPM{" "}
                        <span className="text-gray-500">
                          ({stats.avgAccuracy.toFixed(1)}% acc)
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Battles */}
            {history.length > 0 && (
              <div className="bg-gray-800/60 backdrop-blur-sm rounded-2xl p-6 border border-gray-700">
                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <span>&#128337;</span> RECENT BATTLES
                </h2>

                <div className="space-y-3">
                  {history.map((battle) => {
                    const isWin = battle.result === "win";
                    const isLoss = battle.result === "lose";
                    const isDraw = battle.result === "draw";

                    return (
                      <div
                        key={battle.id}
                        className={`relative rounded-xl p-4 border-l-4 ${
                          isWin
                            ? "bg-green-500/10 border-green-500"
                            : isLoss
                            ? "bg-red-500/10 border-red-500"
                            : "bg-yellow-500/10 border-yellow-500"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span
                                className={`text-sm font-bold uppercase ${
                                  isWin
                                    ? "text-green-400"
                                    : isLoss
                                    ? "text-red-400"
                                    : "text-yellow-400"
                                }`}
                              >
                                {isWin && "&#128994; WIN"}
                                {isLoss && "&#128308; LOSE"}
                                {isDraw && "&#128993; DRAW"}
                              </span>
                              <span className="text-gray-400 text-sm">
                                vs {battle.opponentName}
                              </span>
                            </div>

                            <div className="flex items-center gap-4 text-sm">
                              <div>
                                <span className="text-white font-bold">
                                  {battle.myWpm} WPM
                                </span>
                                <span className="text-gray-500 mx-1">vs</span>
                                <span className="text-gray-400 font-bold">
                                  {battle.opponentWpm} WPM
                                </span>
                              </div>

                              <div
                                className={`text-xs font-medium ${
                                  battle.wpmDiff > 0
                                    ? "text-green-400"
                                    : battle.wpmDiff < 0
                                    ? "text-red-400"
                                    : "text-gray-400"
                                }`}
                              >
                                ({battle.wpmDiff > 0 ? "+" : ""}
                                {battle.wpmDiff})
                              </div>
                            </div>

                            <div className="text-xs text-gray-500 mt-1">
                              Accuracy: {battle.myAccuracy.toFixed(1)}% vs{" "}
                              {battle.opponentAccuracy.toFixed(1)}%
                            </div>
                          </div>

                          <div className="text-xs text-gray-500 whitespace-nowrap">
                            {timeAgo(battle.timestamp)}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {stats.totalBattles > 20 && (
                  <div className="mt-4 text-center text-sm text-gray-500">
                    Showing most recent 20 of {stats.totalBattles} battles
                  </div>
                )}
              </div>
            )}

            {/* CTA */}
            <div className="flex justify-center pt-4">
              <Link
                href="/battle"
                className="px-8 py-4 bg-gradient-to-r from-red-500 to-orange-500 text-white font-bold rounded-xl hover:scale-[1.02] transition-all shadow-lg shadow-red-500/20"
              >
                &#9876;&#65039; Start New Battle
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
