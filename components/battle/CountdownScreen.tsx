"use client";

import { useEffect, useState } from "react";
import type { PlayerInfo } from "@/lib/battle-types";

interface CountdownScreenProps {
  count: number | null;
  opponent: PlayerInfo | null;
  passage: string | null;
  myName: string;
}

export default function CountdownScreen({
  count,
  opponent,
  passage,
  myName,
}: CountdownScreenProps) {
  const [flash, setFlash] = useState(false);

  useEffect(() => {
    if (count === 0) {
      setFlash(true);
      const t = setTimeout(() => setFlash(false), 500);
      return () => clearTimeout(t);
    }
  }, [count]);

  const displayCount = count === null ? 3 : count;
  const isGo = displayCount <= 0;

  return (
    <div
      className={`flex flex-col items-center justify-center min-h-[70vh] text-center px-4 transition-all duration-300 ${
        flash ? "bg-green-500/10" : ""
      }`}
    >
      {/* VS Layout */}
      <div className="flex items-center justify-center gap-8 md:gap-16 mb-12">
        {/* Player */}
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-blue-500/20 border-2 border-blue-500 flex items-center justify-center text-2xl md:text-3xl mb-3">
            &#128100;
          </div>
          <span className="text-blue-400 font-bold text-sm md:text-base">
            {myName}
          </span>
        </div>

        {/* VS */}
        <div className="text-3xl md:text-4xl font-black text-gray-500">
          VS
        </div>

        {/* Opponent */}
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-red-500/20 border-2 border-red-500 flex items-center justify-center text-2xl md:text-3xl mb-3">
            &#128100;
          </div>
          <span className="text-red-400 font-bold text-sm md:text-base">
            {opponent?.displayName ?? "???"}
          </span>
        </div>
      </div>

      {/* Countdown number */}
      <div className="mb-8">
        {isGo ? (
          <div
            key="go"
            className="text-[100px] md:text-[140px] font-black text-green-400 leading-none animate-countdownPop"
          >
            GO!
          </div>
        ) : (
          <div
            key={displayCount}
            className="text-[100px] md:text-[140px] font-black text-white leading-none animate-countdownPop"
          >
            {displayCount}
          </div>
        )}
      </div>

      <p className="text-gray-400 text-lg mb-8">
        {isGo ? "Type now!" : "Get ready to type!"}
      </p>

      {/* Passage preview */}
      {passage && (
        <div className="max-w-lg mx-auto bg-gray-800/40 backdrop-blur-sm border border-gray-700 rounded-xl p-4">
          <p className="text-gray-500 text-sm blur-[2px] select-none leading-relaxed">
            {passage.slice(0, 80)}...
          </p>
        </div>
      )}
    </div>
  );
}
