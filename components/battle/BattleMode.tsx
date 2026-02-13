"use client";

import { useBattle } from "@/hooks/useBattle";
import { useBattleStats } from "@/hooks/useBattleStats";
import MatchmakingScreen from "./MatchmakingScreen";
import CountdownScreen from "./CountdownScreen";
import BattleArena from "./BattleArena";
import BattleResults from "./BattleResults";
import Link from "next/link";

export default function BattleMode() {
  const {
    state,
    passage,
    opponent,
    opponentProgress,
    result,
    countdownValue,
    searchTime,
    myDisplayName,
    findOpponent,
    sendProgress,
    sendFinished,
    requestRematch,
    cancelSearch,
    disconnect,
  } = useBattle();

  const { stats, isLoading } = useBattleStats();

  // Idle screen
  if (state === "idle") {
    const hasStats = stats && stats.totalBattles > 0;

    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
        <h1 className="text-4xl md:text-6xl font-black text-white mb-4">
          <span className="text-red-400">&#9876;&#65039;</span> BATTLE MODE{" "}
          <span className="text-red-400">&#9876;&#65039;</span>
        </h1>
        <p className="text-gray-400 text-lg mb-6 max-w-md">
          Challenge a random opponent to a 60-second typing battle. Highest WPM
          wins!
        </p>

        {/* Mini Stats Display */}
        {hasStats && !isLoading && (
          <div className="mb-6 flex items-center gap-3 text-sm">
            <div className="px-3 py-1.5 bg-green-500/20 border border-green-500/40 rounded-lg">
              <span className="text-green-400 font-bold">{stats.wins}W</span>
            </div>
            <div className="px-3 py-1.5 bg-red-500/20 border border-red-500/40 rounded-lg">
              <span className="text-red-400 font-bold">{stats.losses}L</span>
            </div>
            <div className="px-3 py-1.5 bg-yellow-500/20 border border-yellow-500/40 rounded-lg">
              <span className="text-yellow-400 font-bold">{stats.draws}D</span>
            </div>
            <div className="text-gray-500 text-xs">
              {stats.winRate.toFixed(0)}% WR
            </div>
          </div>
        )}

        <button
          onClick={() => findOpponent()}
          className="group relative px-10 py-5 bg-gradient-to-r from-red-500 to-orange-500 text-white font-black text-xl rounded-2xl shadow-lg shadow-red-500/25 hover:shadow-xl hover:shadow-red-500/30 hover:scale-[1.03] transition-all animate-pulse hover:animate-none"
        >
          &#128308; FIND OPPONENT &#128308;
        </button>

        {/* View Stats Button */}
        {hasStats && !isLoading && (
          <Link
            href="/battle/stats"
            className="mt-4 px-6 py-3 bg-gray-800 border border-gray-600 hover:border-gray-500 hover:bg-gray-700 text-gray-300 font-medium rounded-xl transition-all text-sm"
          >
            &#128202; View Stats
          </Link>
        )}

        <div className="mt-12 max-w-sm text-left">
          <h3 className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-4">
            How It Works
          </h3>
          <div className="space-y-3">
            {[
              "Click \"Find Opponent\" to enter the queue",
              "Get matched with a random player",
              "Type the same passage for 60 seconds",
              "Highest WPM wins the battle!",
            ].map((step, i) => (
              <div key={i} className="flex items-start gap-3 text-sm text-gray-400">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center text-xs font-bold text-gray-500">
                  {i + 1}
                </span>
                {step}
              </div>
            ))}
          </div>
        </div>

        <Link
          href="/"
          className="mt-10 text-gray-600 hover:text-gray-400 text-sm transition-colors"
        >
          &#8592; Back to Home
        </Link>
      </div>
    );
  }

  // Searching
  if (state === "searching") {
    return <MatchmakingScreen searchTime={searchTime} onCancel={cancelSearch} />;
  }

  // Matched + Countdown
  if (state === "matched" || state === "countdown") {
    return (
      <CountdownScreen
        count={countdownValue}
        opponent={opponent}
        passage={passage}
        myName={myDisplayName}
      />
    );
  }

  // Playing
  if (state === "playing" && passage) {
    return (
      <BattleArena
        passage={passage}
        opponentProgress={opponentProgress}
        opponentName={opponent?.displayName ?? "Opponent"}
        myName={myDisplayName}
        onProgress={sendProgress}
        onFinished={sendFinished}
      />
    );
  }

  // Finished
  if (state === "finished" && result) {
    return (
      <BattleResults
        result={result}
        myId="me"
        onRematch={requestRematch}
        onNewOpponent={requestRematch}
        onHome={disconnect}
      />
    );
  }

  // Disconnected
  if (state === "disconnected") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
        <div className="text-5xl mb-4">&#128532;</div>
        <h2 className="text-2xl font-bold text-white mb-2">
          Opponent Left
        </h2>
        <p className="text-gray-400 mb-6">
          Your opponent disconnected from the battle.
        </p>
        <button
          onClick={() => findOpponent()}
          className="px-8 py-3 bg-gradient-to-r from-red-500 to-orange-500 text-white font-bold rounded-xl hover:scale-[1.02] transition-all"
        >
          Find New Opponent
        </button>
      </div>
    );
  }

  return null;
}
