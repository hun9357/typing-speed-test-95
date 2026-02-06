"use client";

import { useState, useEffect, useRef } from "react";
import Timer from "./Timer";
import Results from "./Results";

interface TypingTestProps {
  passage: string;
}

type TestState = "idle" | "running" | "finished";

export default function TypingTest({ passage }: TypingTestProps) {
  const [testState, setTestState] = useState<TestState>("idle");
  const [userInput, setUserInput] = useState("");
  const [timeLeft, setTimeLeft] = useState(60);
  const [startTime, setStartTime] = useState<number | null>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

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
  };

  // Reset test
  const resetTest = () => {
    setTestState("idle");
    setUserInput("");
    setTimeLeft(60);
    setStartTime(null);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
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

  if (testState === "idle") {
    return (
      <div className="max-w-2xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">60-Second Typing Test</h2>
        <div className="bg-white p-8 rounded-lg shadow-lg mb-8">
          <p className="text-gray-600 mb-6">
            Click the button below to start your typing test. You&apos;ll have 60 seconds to type as much
            of the displayed text as possible. Your WPM and accuracy will be calculated in real-time.
          </p>
          <button
            onClick={startTest}
            className="bg-primary hover:bg-blue-600 text-white font-semibold px-8 py-3 rounded-lg transition-colors shadow-lg hover:shadow-xl"
          >
            Start Test
          </button>
        </div>
      </div>
    );
  }

  if (testState === "finished") {
    return <Results {...metrics} onReset={resetTest} />;
  }

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

      <div className="text-center">
        <button
          onClick={resetTest}
          className="text-gray-600 hover:text-gray-900 underline"
        >
          Reset Test
        </button>
      </div>
    </div>
  );
}
