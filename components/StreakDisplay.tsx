"use client";

interface StreakDisplayProps {
  streak: number;
  size?: "small" | "medium" | "large";
}

export default function StreakDisplay({ streak, size = "medium" }: StreakDisplayProps) {
  // Determine color and animation based on streak level
  const getStreakLevel = () => {
    if (streak >= 14) {
      return {
        emoji: "🔥👑",
        color: "text-purple-600",
        glow: "drop-shadow-[0_0_8px_rgba(139,92,246,0.6)]",
        animation: "animate-pulse",
      };
    } else if (streak >= 7) {
      return {
        emoji: "🔥🔥🔥",
        color: "text-red-600",
        glow: "drop-shadow-[0_0_4px_rgba(239,68,68,0.5)]",
        animation: "animate-pulse",
      };
    } else if (streak >= 4) {
      return {
        emoji: "🔥🔥",
        color: "text-red-500",
        glow: "",
        animation: "",
      };
    } else if (streak >= 1) {
      return {
        emoji: "🔥",
        color: "text-orange-500",
        glow: "",
        animation: "",
      };
    } else {
      return {
        emoji: "",
        color: "text-gray-400",
        glow: "",
        animation: "",
      };
    }
  };

  const level = getStreakLevel();

  const sizeClasses = {
    small: "text-lg",
    medium: "text-2xl",
    large: "text-4xl",
  };

  if (streak === 0) {
    return (
      <div className={`${sizeClasses[size]} font-bold text-gray-400`}>
        0 Day Streak
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-2 ${sizeClasses[size]} font-bold ${level.color}`}>
      <span className={`${level.glow} ${level.animation}`}>{level.emoji}</span>
      <span>{streak} Day Streak</span>
    </div>
  );
}
