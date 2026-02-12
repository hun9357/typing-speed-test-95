import type { Metadata } from "next";
import Link from "next/link";
import TypingTest from "@/components/TypingTest";
import passages from "@/data/passages.json";

export const metadata: Metadata = {
  title: "Take the Typing Test - 1 Minute WPM Challenge",
  description: "Start your 1-minute typing speed test now. Type real words and get instant WPM and accuracy results.",
};

export default function TestPage() {
  // Select random passage
  const randomPassage = passages[Math.floor(Math.random() * passages.length)];

  return (
    <main className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block text-primary hover:text-blue-600 font-semibold mb-4">
            ← Back to Home
          </Link>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Typing Speed Test
          </h1>

          {/* Test Type Links */}
          <div className="flex flex-wrap justify-center gap-4 mb-6">
            <Link
              href="/test/code"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <span>&lt;/&gt;</span>
              <span>Try Coding Test</span>
            </Link>
            <Link
              href="/test/simulation"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold px-6 py-3 rounded-lg transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <span>🏢</span>
              <span>Real-World Simulation</span>
            </Link>
          </div>
        </div>

        {/* Test Component */}
        <TypingTest passage={randomPassage} />

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-gray-200 text-center text-gray-600 text-sm">
          <p>&copy; {new Date().getFullYear()} Typing Speed Test. All rights reserved.</p>
        </footer>
      </div>
    </main>
  );
}
