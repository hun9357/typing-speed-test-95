import type { Metadata } from "next";
import Link from "next/link";
import SimulationSelector from "@/components/SimulationSelector";

export const metadata: Metadata = {
  title: "Real-World Typing Simulation - Practice Job-Ready Skills",
  description: "Practice typing for real job scenarios: emails, customer support, legal documents, and data entry. Get job readiness feedback.",
};

export default function SimulationPage() {
  return (
    <main className="min-h-screen py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Back Link */}
        <div className="text-center mb-6">
          <Link href="/test" className="inline-block text-primary hover:text-blue-600 font-semibold">
            ← Back to Tests
          </Link>
        </div>

        {/* Simulation Selector */}
        <SimulationSelector />

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-gray-200 text-center text-gray-600 text-sm">
          <p>&copy; {new Date().getFullYear()} Typing Speed Test. All rights reserved.</p>
        </footer>
      </div>
    </main>
  );
}
