"use client";

interface BattleStatsProps {
  wpm: number;
  accuracy: number;
  errors: number;
  charsTyped: number;
  totalChars: number;
}

export default function BattleStats({
  wpm,
  accuracy,
  errors,
  charsTyped,
  totalChars,
}: BattleStatsProps) {
  return (
    <div className="flex items-center justify-center gap-6 text-sm text-gray-400 mt-3">
      <div className="flex items-center gap-1.5">
        <span className="text-blue-400 font-bold text-base">{wpm}</span>
        <span>WPM</span>
      </div>
      <div className="w-px h-4 bg-gray-700" />
      <div className="flex items-center gap-1.5">
        <span
          className={`font-bold text-base ${
            accuracy >= 95 ? "text-green-400" : accuracy >= 85 ? "text-yellow-400" : "text-red-400"
          }`}
        >
          {accuracy.toFixed(1)}%
        </span>
        <span>Accuracy</span>
      </div>
      <div className="w-px h-4 bg-gray-700" />
      <div className="flex items-center gap-1.5">
        <span className={`font-bold text-base ${errors > 0 ? "text-red-400" : "text-green-400"}`}>
          {errors}
        </span>
        <span>Errors</span>
      </div>
      <div className="w-px h-4 bg-gray-700 hidden sm:block" />
      <div className="items-center gap-1.5 hidden sm:flex">
        <span className="text-gray-300 font-bold text-base">
          {charsTyped}
        </span>
        <span>/ {totalChars}</span>
      </div>
    </div>
  );
}
