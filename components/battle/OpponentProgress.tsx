"use client";

import type { TypingProgress } from "@/lib/battle-types";

interface OpponentProgressProps {
  myProgress: TypingProgress | null;
  opponentProgress: TypingProgress | null;
  myName: string;
  opponentName: string;
  timeLeft: number;
}

export default function OpponentProgress({
  myProgress,
  opponentProgress,
  myName,
  opponentName,
  timeLeft,
}: OpponentProgressProps) {
  const myPct = myProgress?.progress ?? 0;
  const oppPct = opponentProgress?.progress ?? 0;
  const myWpm = myProgress?.currentWpm ?? 0;
  const oppWpm = opponentProgress?.currentWpm ?? 0;
  const opponentLeading = oppPct > myPct;

  return (
    <div className="w-full bg-gray-800/60 backdrop-blur-sm border border-gray-700 rounded-xl p-4 mb-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-red-400 text-lg">&#9876;&#65039;</span>
          <span className="text-gray-400 text-xs font-medium uppercase tracking-wider">
            Battle Progress
          </span>
        </div>
        <div
          className={`font-mono font-bold text-lg ${
            timeLeft <= 10 ? "text-red-500 animate-pulse" : "text-white"
          }`}
        >
          &#9201;&#65039; {Math.floor(timeLeft / 60)}:
          {(timeLeft % 60).toString().padStart(2, "0")}
        </div>
      </div>

      {/* My progress */}
      <div className="mb-3">
        <div className="flex items-center justify-between text-sm mb-1.5">
          <span className="text-blue-400 font-semibold">{myName}</span>
          <div className="flex items-center gap-3">
            <span className="text-gray-400 text-xs">
              {myWpm} WPM
            </span>
            <span className="text-gray-500 text-xs">
              {Math.round(myPct)}%
            </span>
          </div>
        </div>
        <div className="h-3 bg-gray-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-blue-400 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${Math.min(myPct, 100)}%` }}
          />
        </div>
      </div>

      {/* Opponent progress */}
      <div>
        <div className="flex items-center justify-between text-sm mb-1.5">
          <span className="text-red-400 font-semibold">{opponentName}</span>
          <div className="flex items-center gap-3">
            <span className="text-gray-400 text-xs">
              {oppWpm} WPM
            </span>
            <span className="text-gray-500 text-xs">
              {Math.round(oppPct)}%
            </span>
          </div>
        </div>
        <div className="h-3 bg-gray-700 rounded-full overflow-hidden">
          <div
            className={`h-full bg-gradient-to-r from-red-500 to-red-400 rounded-full transition-all duration-300 ease-out ${
              opponentLeading ? "animate-pulse" : ""
            }`}
            style={{ width: `${Math.min(oppPct, 100)}%` }}
          />
        </div>
      </div>
    </div>
  );
}
