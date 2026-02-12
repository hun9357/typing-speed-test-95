"use client";

import { useState, useEffect } from "react";
import confetti from "canvas-confetti";
import CertificateGenerator from "./CertificateGenerator";
import { qualifiesForCertificate } from "@/lib/certificate";

interface ResultsProps {
  wpm: number;
  accuracy: number;
  errors: number;
  onReset: () => void;
}

export default function Results({ wpm, accuracy, errors, onReset }: ResultsProps) {
  const [userName, setUserName] = useState("");
  const [showCertificate, setShowCertificate] = useState(false);
  const qualifies = qualifiesForCertificate(accuracy);

  // Trigger confetti animation when user qualifies
  useEffect(() => {
    if (qualifies) {
      // Celebration confetti burst
      const duration = 3000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

      const randomInRange = (min: number, max: number) => {
        return Math.random() * (max - min) + min;
      };

      const interval = setInterval(() => {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);

        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        });
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        });
      }, 250);

      return () => clearInterval(interval);
    }
  }, [qualifies]);

  return (
    <div className="max-w-4xl mx-auto">
      {/* AdSense Placeholder - Above Results */}
      {/* AdSense ad unit - Test results top */}

      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Your Results</h2>

        {/* Qualification Badge */}
        {qualifies && (
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-2 rounded-full font-semibold shadow-lg animate-pulse">
            🎉 Certificate Qualified!
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-lg border-2 border-primary">
          <div className="text-4xl font-bold text-primary mb-2">{Math.round(wpm)}</div>
          <div className="text-gray-600 font-semibold">Words Per Minute</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <div className="text-4xl font-bold text-green-600 mb-2">{accuracy.toFixed(1)}%</div>
          <div className="text-gray-600 font-semibold">Accuracy</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <div className="text-4xl font-bold text-red-600 mb-2">{errors}</div>
          <div className="text-gray-600 font-semibold">Errors</div>
        </div>
      </div>

      {/* Certificate Section */}
      {qualifies ? (
        <div className="bg-gradient-to-br from-blue-50 to-green-50 rounded-xl shadow-xl p-8 mb-8 border-2 border-green-200">
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              🏆 Congratulations!
            </h3>
            <p className="text-gray-700 mb-4">
              You&apos;ve achieved 95%+ accuracy and qualified for an official typing certificate!
            </p>
          </div>

          {!showCertificate ? (
            <div className="max-w-md mx-auto space-y-4">
              {/* Name Input */}
              <div>
                <label htmlFor="userName" className="block text-sm font-semibold text-gray-700 mb-2">
                  Your Name (Optional)
                </label>
                <input
                  id="userName"
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="Enter your name for the certificate"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none transition-colors"
                  maxLength={50}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Leave blank for &quot;Anonymous Typist&quot;
                </p>
              </div>

              {/* Generate Certificate Button */}
              <button
                onClick={() => setShowCertificate(true)}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-4 px-8 rounded-lg transition-all duration-200 transform hover:scale-102 shadow-lg hover:shadow-xl"
              >
                🎓 Generate Certificate
              </button>
            </div>
          ) : (
            <div className="animate-fadeIn">
              <CertificateGenerator wpm={wpm} accuracy={accuracy} userName={userName} />

              {/* Edit Name Button */}
              <button
                onClick={() => setShowCertificate(false)}
                className="w-full mt-4 text-gray-600 hover:text-gray-900 underline text-sm"
              >
                ← Edit Name
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-blue-50 rounded-lg p-6 mb-8 border border-blue-200 text-center">
          <p className="text-gray-700">
            <span className="font-semibold">Good effort!</span> Keep practicing to reach 95% accuracy and unlock your official typing certificate.
          </p>
          <p className="text-sm text-gray-600 mt-2">
            💡 Tip: Focus on accuracy over speed for better results
          </p>
        </div>
      )}

      {/* Try Again Button */}
      <div className="text-center">
        <button
          onClick={onReset}
          className="bg-primary hover:bg-blue-600 text-white font-semibold px-8 py-3 rounded-lg transition-colors shadow-lg hover:shadow-xl"
        >
          Try Again
        </button>
      </div>

      {/* AdSense Placeholder - Below Results */}
      {/* AdSense ad unit - Test results bottom */}
    </div>
  );
}
