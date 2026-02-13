"use client";

const TIPS = [
  "Average battle winner types at 65 WPM. Can you beat that?",
  "Focus on accuracy first, speed will follow naturally.",
  "Keep your fingers on the home row for maximum speed.",
  "The best typists maintain a consistent rhythm throughout.",
  "Try to look at the text, not your keyboard!",
];

interface MatchmakingScreenProps {
  searchTime: number;
  onCancel: () => void;
}

export default function MatchmakingScreen({
  searchTime,
  onCancel,
}: MatchmakingScreenProps) {
  const tip = TIPS[Math.floor(Date.now() / 60000) % TIPS.length];

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
      <h2 className="text-3xl md:text-4xl font-black text-white mb-8">
        <span className="text-red-400">&#9876;&#65039;</span> BATTLE MODE{" "}
        <span className="text-red-400">&#9876;&#65039;</span>
      </h2>

      <div className="bg-gray-800/60 backdrop-blur-sm border border-gray-700 rounded-2xl p-8 md:p-12 max-w-md w-full mb-8">
        {/* Animated dots */}
        <div className="flex justify-center gap-3 mb-6">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-4 h-4 bg-orange-400 rounded-full animate-bounce"
              style={{ animationDelay: `${i * 0.2}s` }}
            />
          ))}
        </div>

        <p className="text-xl text-gray-300 mb-2">Finding Opponent...</p>
        <p className="text-sm text-gray-500 italic mb-6">
          &quot;Searching for a worthy challenger...&quot;
        </p>

        <div className="flex items-center justify-center gap-6 text-sm text-gray-400">
          <div className="flex items-center gap-2">
            <span>&#9201;&#65039;</span>
            <span>
              {Math.floor(searchTime / 60)}:
              {(searchTime % 60).toString().padStart(2, "0")}
            </span>
          </div>
        </div>
      </div>

      <button
        onClick={onCancel}
        className="px-6 py-3 border border-gray-600 text-gray-400 rounded-xl hover:border-gray-500 hover:text-gray-300 transition-all text-sm"
      >
        Cancel Search
      </button>

      <p className="mt-8 text-sm text-gray-500 max-w-sm">
        &#128161; Tip: {tip}
      </p>
    </div>
  );
}
