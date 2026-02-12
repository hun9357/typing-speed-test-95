"use client";

import { useState, useEffect, useRef } from "react";
import { SimulationScenario } from "@/types/simulation";
import Timer from "./Timer";
import SimulationResults from "./SimulationResults";

interface SimulationTestProps {
  scenario: SimulationScenario;
  onChangeCategory: () => void;
  onTryAgain: () => void;
}

type TestState = "idle" | "running" | "finished";

export default function SimulationTest({
  scenario,
  onChangeCategory,
  onTryAgain,
}: SimulationTestProps) {
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
    const wpm = elapsedMinutes > 0 ? totalChars / 5 / elapsedMinutes : 0;

    // Calculate errors and accuracy
    let errors = 0;
    for (let i = 0; i < userInput.length; i++) {
      if (userInput[i] !== scenario.content[i]) {
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

    // Don't allow typing beyond content length
    if (value.length > scenario.content.length) return;

    setUserInput(value);

    // Auto-finish if content is complete
    if (value.length === scenario.content.length) {
      finishTest();
    }
  };

  // Render character with highlighting
  const renderCharacter = (char: string, index: number) => {
    if (index >= userInput.length) {
      return (
        <span key={index} className="text-gray-400">
          {char}
        </span>
      );
    }

    const isCorrect = userInput[index] === char;
    const className = isCorrect ? "text-green-600 bg-green-50" : "text-red-600 bg-red-50";

    return (
      <span key={index} className={className}>
        {char}
      </span>
    );
  };

  const getCategoryColor = () => {
    switch (scenario.category) {
      case 'email':
        return 'from-blue-600 to-indigo-600';
      case 'support':
        return 'from-green-600 to-emerald-600';
      case 'legal':
        return 'from-purple-600 to-violet-600';
      case 'data-entry':
        return 'from-orange-600 to-amber-600';
      default:
        return 'from-blue-600 to-indigo-600';
    }
  };

  const getCategoryIcon = () => {
    switch (scenario.category) {
      case 'email':
        return '📧';
      case 'support':
        return '💬';
      case 'legal':
        return '⚖️';
      case 'data-entry':
        return '📊';
      default:
        return '📝';
    }
  };

  const getCategoryName = () => {
    switch (scenario.category) {
      case 'email':
        return 'Email Response';
      case 'support':
        return 'Customer Support';
      case 'legal':
        return 'Legal & Contracts';
      case 'data-entry':
        return 'Data Entry';
      default:
        return 'Simulation';
    }
  };

  if (testState === "idle") {
    return (
      <div className="max-w-3xl mx-auto">
        {/* Scenario Header */}
        <div className={`bg-gradient-to-r ${getCategoryColor()} text-white p-6 rounded-lg shadow-lg mb-6`}>
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl">{getCategoryIcon()}</span>
            <h2 className="text-2xl font-bold">{getCategoryName()}</h2>
          </div>
          <h3 className="text-xl font-semibold">{scenario.title}</h3>
        </div>

        {/* Context Card */}
        <div className="bg-blue-50 border-l-4 border-blue-600 p-6 rounded-lg shadow-md mb-6">
          <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
            <span>📋</span>
            SCENARIO
          </h4>
          <p className="text-gray-700 leading-relaxed">{scenario.context}</p>
        </div>

        {/* Preview */}
        <div className="bg-white p-8 rounded-lg shadow-lg mb-6">
          <h4 className="text-sm font-semibold text-gray-600 mb-4 uppercase">Preview:</h4>
          <div className="text-gray-600 leading-relaxed whitespace-pre-wrap font-mono text-sm bg-gray-50 p-6 rounded-lg border border-gray-200">
            {scenario.content}
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <p className="text-gray-600 mb-4">
            You&apos;ll have 60 seconds to type the text above as accurately and quickly as possible.
            This simulates real-world typing scenarios you might encounter in this profession.
          </p>
          <div className="text-center">
            <button
              onClick={startTest}
              className={`bg-gradient-to-r ${getCategoryColor()} text-white font-semibold px-8 py-3 rounded-lg transition-all shadow-lg hover:shadow-xl transform hover:scale-105`}
            >
              Start Simulation
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (testState === "finished") {
    return (
      <SimulationResults
        wpm={metrics.wpm}
        accuracy={metrics.accuracy}
        errors={metrics.errors}
        category={scenario.category}
        onTryAgain={onTryAgain}
        onChangeCategory={onChangeCategory}
      />
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Stats Bar */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{getCategoryIcon()}</span>
            <div>
              <div className="font-bold text-gray-900">{getCategoryName()}</div>
              <div className="text-sm text-gray-600">{scenario.title}</div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-600">Time Left</div>
            <Timer seconds={timeLeft} />
          </div>
        </div>

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
            <div className="text-sm text-gray-600 mb-1">Characters</div>
            <div className="text-lg font-bold text-gray-700">
              {userInput.length}/{scenario.content.length}
            </div>
          </div>
        </div>
      </div>

      {/* Context Reminder */}
      <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded-lg shadow-md mb-6">
        <p className="text-sm text-gray-700">
          <span className="font-semibold">Context:</span> {scenario.context}
        </p>
      </div>

      {/* Content Display */}
      <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
        <div className="text-lg leading-relaxed font-mono mb-6 select-none whitespace-pre-wrap">
          {scenario.content.split("").map((char, index) => renderCharacter(char, index))}
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
        <button onClick={resetTest} className="text-gray-600 hover:text-gray-900 underline">
          Reset Test
        </button>
      </div>
    </div>
  );
}
