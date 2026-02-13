"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import type { TypingProgress, FinalResult } from "@/lib/battle-types";
import OpponentProgress from "./OpponentProgress";
import BattleStats from "./BattleStats";

interface BattleArenaProps {
  passage: string;
  opponentProgress: TypingProgress | null;
  opponentName: string;
  myName: string;
  onProgress: (progress: TypingProgress) => void;
  onFinished: (result: FinalResult) => void;
}

export default function BattleArena({
  passage,
  opponentProgress,
  opponentName,
  myName,
  onProgress,
  onFinished,
}: BattleArenaProps) {
  const [input, setInput] = useState("");
  const [timeLeft, setTimeLeft] = useState(60);
  const [startTime] = useState(Date.now());
  const [errors, setErrors] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const progressIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const charIndex = input.length;
  const totalChars = passage.length;
  const progress = (charIndex / totalChars) * 100;

  // Calculate WPM
  const elapsedMinutes = Math.max((Date.now() - startTime) / 60000, 0.01);
  const correctChars = input.split("").filter((c, i) => c === passage[i]).length;
  const wpm = Math.round(correctChars / 5 / elapsedMinutes);
  const accuracy = charIndex > 0 ? Math.round((correctChars / charIndex) * 1000) / 10 : 100;

  const myProgress: TypingProgress = {
    playerId: "me",
    charIndex,
    totalChars,
    progress: Math.min(progress, 100),
    currentWpm: wpm,
    currentAccuracy: accuracy,
    timestamp: Date.now(),
  };

  const finishGame = useCallback(() => {
    if (isFinished) return;
    setIsFinished(true);

    if (timerRef.current) clearInterval(timerRef.current);
    if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);

    onFinished({
      playerId: "me",
      wpm,
      accuracy,
      errors,
      charsTyped: charIndex,
      completionTime: Date.now() - startTime,
    });
  }, [isFinished, wpm, accuracy, errors, charIndex, startTime, onFinished]);

  // Timer
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          finishGame();
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [finishGame]);

  // Send progress every 500ms
  useEffect(() => {
    progressIntervalRef.current = setInterval(() => {
      if (!isFinished) {
        onProgress(myProgress);
      }
    }, 500);

    return () => {
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFinished]);

  // Auto focus
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Check completion
  useEffect(() => {
    if (charIndex >= totalChars && !isFinished) {
      finishGame();
    }
  }, [charIndex, totalChars, isFinished, finishGame]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (isFinished) return;

    if (e.key === "Backspace") {
      e.preventDefault();
      setInput((prev) => prev.slice(0, -1));
      return;
    }

    if (e.key.length === 1) {
      e.preventDefault();
      const newInput = input + e.key;

      if (e.key !== passage[charIndex]) {
        setErrors((prev) => prev + 1);
      }

      setInput(newInput);
    }
  };

  const renderPassage = () => {
    return passage.split("").map((char, i) => {
      let className = "text-gray-500"; // untyped

      if (i < input.length) {
        if (input[i] === char) {
          className = "text-green-400"; // correct
        } else {
          className = "text-red-400 underline decoration-wavy decoration-red-500"; // error
        }
      } else if (i === input.length) {
        className =
          "text-white bg-blue-500/30 border-b-2 border-yellow-400"; // current
      }

      return (
        <span key={i} className={className}>
          {char}
        </span>
      );
    });
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-4">
      {/* Progress bars */}
      <OpponentProgress
        myProgress={myProgress}
        opponentProgress={opponentProgress}
        myName={myName}
        opponentName={opponentName}
        timeLeft={timeLeft}
      />

      {/* Passage display */}
      <div
        className="bg-gray-800/60 backdrop-blur-sm border border-gray-700 rounded-xl p-6 mb-4 cursor-text min-h-[180px]"
        onClick={() => inputRef.current?.focus()}
      >
        <p className="text-lg md:text-xl leading-relaxed font-mono tracking-wide break-words">
          {renderPassage()}
        </p>
      </div>

      {/* Hidden input */}
      <input
        ref={inputRef}
        type="text"
        className="opacity-0 absolute -z-10"
        onKeyDown={handleKeyDown}
        value={input}
        onChange={() => {}}
        autoFocus
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck={false}
      />

      {/* Stats */}
      <BattleStats
        wpm={wpm}
        accuracy={accuracy}
        errors={errors}
        charsTyped={charIndex}
        totalChars={totalChars}
      />

      {/* Focus reminder */}
      <p className="text-center text-xs text-gray-600 mt-3">
        Click the text area above if typing isn&apos;t working
      </p>
    </div>
  );
}
