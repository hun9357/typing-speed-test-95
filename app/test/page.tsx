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
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
            Typing Speed Test
          </h1>
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
