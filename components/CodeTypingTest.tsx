"use client";

import { useState, useEffect, useRef } from "react";
import Timer from "./Timer";
import Results from "./Results";

interface CodeSnippet {
  id: string;
  language: string;
  difficulty: string;
  description: string;
  code: string;
}

interface CodeTypingTestProps {
  snippet: CodeSnippet;
  onBack: () => void;
}

type TestState = "idle" | "running" | "finished";

export default function CodeTypingTest({ snippet, onBack }: CodeTypingTestProps) {
  const [testState, setTestState] = useState<TestState>("idle");
  const [userInput, setUserInput] = useState("");
  const [timeLeft, setTimeLeft] = useState(60);
  const [startTime, setStartTime] = useState<number | null>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Split code into lines for display
  const codeLines = snippet.code.split('\n');

  // Calculate metrics
  const calculateMetrics = () => {
    const totalChars = userInput.length;
    const elapsedMinutes = startTime ? (60 - timeLeft) / 60 : 0;

    // WPM = (total characters / 5) / elapsed minutes
    const wpm = elapsedMinutes > 0 ? (totalChars / 5) / elapsedMinutes : 0;

    // Calculate errors and accuracy
    let errors = 0;
    for (let i = 0; i < userInput.length; i++) {
      if (userInput[i] !== snippet.code[i]) {
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

    // Don't allow typing beyond code length
    if (value.length > snippet.code.length) return;

    setUserInput(value);

    // Auto-finish if code is complete
    if (value.length === snippet.code.length) {
      finishTest();
    }
  };

  // Render character with code-specific highlighting
  const renderCharacter = (char: string, index: number) => {
    if (index >= userInput.length) {
      // Untyped character
      return (
        <span key={index} className="text-gray-500">
          {char}
        </span>
      );
    }

    const isCorrect = userInput[index] === char;

    if (isCorrect) {
      // Correct character - teal/cyan color
      return (
        <span key={index} className="text-teal-400">
          {char}
        </span>
      );
    } else {
      // Incorrect character - red with underline
      return (
        <span key={index} className="text-red-500 underline decoration-wavy decoration-red-500">
          {char}
        </span>
      );
    }
  };

  if (testState === "idle") {
    return (
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <button
            onClick={onBack}
            className="text-primary hover:text-blue-600 font-semibold mb-4"
          >
            ← Back to Language Selection
          </button>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            {snippet.language.toUpperCase()} Typing Test
          </h2>
          <p className="text-gray-600">
            Difficulty: <span className="font-semibold capitalize">{snippet.difficulty}</span>
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <p className="text-gray-600 mb-6">
            Click the button below to start your coding typing test. You&apos;ll have 60 seconds to type the code snippet as accurately as possible. Special characters, indentation, and syntax matter!
          </p>

          {/* Code Preview */}
          <div className="bg-[#1E1E1E] rounded-lg p-6 mb-6 overflow-x-auto">
            <div className="font-mono text-sm">
              {codeLines.map((line, idx) => (
                <div key={idx} className="flex">
                  <span className="text-gray-500 select-none pr-4 text-right w-8">
                    {idx + 1}
                  </span>
                  <span className="text-gray-400">{line || '\n'}</span>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={startTest}
            className="w-full bg-primary hover:bg-blue-600 text-white font-semibold px-8 py-3 rounded-lg transition-colors shadow-lg hover:shadow-xl"
          >
            Start Typing Test
          </button>
        </div>
      </div>
    );
  }

  if (testState === "finished") {
    return (
      <div className="max-w-4xl mx-auto px-4">
        <button
          onClick={onBack}
          className="text-primary hover:text-blue-600 font-semibold mb-4"
        >
          ← Back to Language Selection
        </button>
        <Results {...metrics} onReset={resetTest} />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={onBack}
          className="text-primary hover:text-blue-600 font-semibold mb-2"
        >
          ← Back
        </button>
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">
            {snippet.language.toUpperCase()}
          </h2>
          <div className="flex items-center gap-6 text-lg">
            <div className="flex items-center gap-2">
              <span className="text-gray-600">Time:</span>
              <Timer seconds={timeLeft} />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-600">WPM:</span>
              <span className="font-bold text-primary">{Math.round(metrics.wpm)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Code Editor Display */}
      <div className="bg-[#1E1E1E] rounded-lg shadow-2xl p-6 mb-6 border border-[#3C3C3C]">
        <div className="font-mono text-base leading-relaxed overflow-x-auto">
          {codeLines.map((line, lineIdx) => {
            // Calculate character position for this line
            const lineStart = codeLines.slice(0, lineIdx).join('\n').length + (lineIdx > 0 ? 1 : 0);
            const lineEnd = lineStart + line.length;

            return (
              <div key={lineIdx} className="flex min-h-[1.7em]">
                {/* Line Number */}
                <span className="text-gray-600 select-none pr-4 text-right" style={{ minWidth: '2.5rem' }}>
                  {lineIdx + 1}
                </span>

                {/* Code Line */}
                <div className="flex-1">
                  {line.split('').map((char, charIdx) => {
                    const globalIdx = lineStart + charIdx;
                    return renderCharacter(char, globalIdx);
                  })}
                  {lineIdx < codeLines.length - 1 && renderCharacter('\n', lineEnd)}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Stats Bar */}
      <div className="bg-white rounded-lg shadow-lg p-4 mb-6">
        <div className="flex justify-between items-center text-sm">
          <div className="flex gap-6">
            <div>
              <span className="text-gray-600">Accuracy: </span>
              <span className="font-semibold text-green-600">{metrics.accuracy.toFixed(1)}%</span>
            </div>
            <div>
              <span className="text-gray-600">Characters: </span>
              <span className="font-semibold text-gray-900">
                {userInput.length} / {snippet.code.length}
              </span>
            </div>
          </div>
          <button
            onClick={resetTest}
            className="text-gray-600 hover:text-gray-900 underline text-sm"
          >
            Reset Test
          </button>
        </div>
      </div>

      {/* Input Area */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Type the code here:
        </label>
        <textarea
          ref={inputRef}
          value={userInput}
          onChange={handleInputChange}
          className="w-full h-40 p-4 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none font-mono text-base resize-none bg-gray-50"
          placeholder="Start typing the code above..."
          spellCheck={false}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
        />
      </div>
    </div>
  );
}
