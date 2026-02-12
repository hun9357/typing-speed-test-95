"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import StreakDisplay from "@/components/StreakDisplay";

export default function Home() {
  const [currentStreak, setCurrentStreak] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load streak from localStorage
    try {
      const stored = localStorage.getItem("typing-test-streak-data");
      if (stored) {
        const data = JSON.parse(stored);
        setCurrentStreak(data.currentStreak || 0);
      }
    } catch (error) {
      console.error("Failed to load streak:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <div className="max-w-4xl mx-auto px-4 py-16 sm:py-24">
        <div className="text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Test Your Typing Speed - Free WPM Test
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Measure your words per minute (WPM) and accuracy with our free online typing test.
            No download or registration required.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/test"
              className="inline-block bg-primary hover:bg-blue-600 text-white font-semibold px-8 py-4 rounded-lg text-lg transition-colors shadow-lg hover:shadow-xl"
            >
              Start Typing Test
            </Link>

            <Link
              href="/test/code"
              className="inline-block bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold px-8 py-4 rounded-lg text-lg transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              &lt;/&gt; Coding Test
            </Link>

            <Link
              href="/daily"
              className="inline-block bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold px-8 py-4 rounded-lg text-lg transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              🔥 Daily Challenge
            </Link>

            <Link
              href="/test/simulation"
              className="inline-block bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold px-8 py-4 rounded-lg text-lg transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              🏢 Real-World Simulation
            </Link>
          </div>

          {!isLoading && currentStreak > 0 && (
            <div className="mt-6 inline-block">
              <StreakDisplay streak={currentStreak} size="medium" />
            </div>
          )}
        </div>

        {/* Feature Highlights */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Coding Test */}
          <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl shadow-xl p-8 border-2 border-purple-200">
            <div className="text-center">
              <div className="text-4xl mb-4">&lt;/&gt;</div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                Coding Typing Test
              </h2>
              <p className="text-gray-700 mb-6">
                Test your programming typing speed with JavaScript, Python, SQL, and React JSX. Perfect for developers!
              </p>
              <Link
                href="/test/code"
                className="inline-block bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold px-8 py-3 rounded-lg transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Start Coding Test
              </Link>
            </div>
          </div>

          {/* Daily Challenge */}
          <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-xl shadow-xl p-8 border-2 border-orange-200">
            <div className="text-center">
              <div className="text-4xl mb-4">🔥</div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                Daily Typing Challenge
              </h2>
              <p className="text-gray-700 mb-6">
                Test yourself with a new passage every day. Build streaks, track your progress, and compete with yourself!
              </p>
              <Link
                href="/daily"
                className="inline-block bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold px-8 py-3 rounded-lg transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Try Today&apos;s Challenge
              </Link>
            </div>
          </div>

          {/* Real-World Simulation */}
          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl shadow-xl p-8 border-2 border-emerald-200 md:col-span-2">
            <div className="text-center">
              <div className="text-4xl mb-4">🏢</div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                Real-World Job Simulations
              </h2>
              <p className="text-gray-700 mb-6">
                Practice typing for real job scenarios: emails, customer support, legal documents, and data entry.
                Get personalized feedback on your job readiness!
              </p>
              <Link
                href="/test/simulation"
                className="inline-block bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold px-8 py-3 rounded-lg transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Try Simulation Mode
              </Link>
            </div>
          </div>
        </div>

        {/* Trust Signals */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-16 text-center">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-3xl mb-2">✓</div>
            <h3 className="font-semibold text-gray-900 mb-2">100% Free</h3>
            <p className="text-gray-600 text-sm">
              No hidden fees or premium plans
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-3xl mb-2">✓</div>
            <h3 className="font-semibold text-gray-900 mb-2">No Registration</h3>
            <p className="text-gray-600 text-sm">
              Start testing immediately
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-3xl mb-2">✓</div>
            <h3 className="font-semibold text-gray-900 mb-2">Instant Results</h3>
            <p className="text-gray-600 text-sm">
              Get detailed metrics right away
            </p>
          </div>
        </div>

        {/* How It Works */}
        <div className="mt-20">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-primary text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Click Start</h3>
              <p className="text-gray-600">
                Click the start button to begin your 60-second typing challenge
              </p>
            </div>
            <div className="text-center">
              <div className="bg-primary text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Type the Text</h3>
              <p className="text-gray-600">
                Type the displayed passage as quickly and accurately as possible
              </p>
            </div>
            <div className="text-center">
              <div className="bg-primary text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">View Results</h3>
              <p className="text-gray-600">
                See your WPM, accuracy percentage, and error count instantly
              </p>
            </div>
          </div>
        </div>

        {/* AdSense Placeholder */}
        {/* AdSense ad unit - Homepage bottom */}

        {/* Footer */}
        <footer className="mt-20 pt-8 border-t border-gray-200 text-center text-gray-600 text-sm">
          <p>&copy; {new Date().getFullYear()} Typing Speed Test. All rights reserved.</p>
        </footer>
      </div>
    </main>
  );
}
