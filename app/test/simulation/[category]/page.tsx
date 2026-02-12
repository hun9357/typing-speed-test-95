"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import SimulationTest from "@/components/SimulationTest";
import { SimulationScenario, SimulationCategory } from "@/types/simulation";
import simulationsData from "@/data/simulations.json";

export default function CategorySimulationPage() {
  const params = useParams();
  const router = useRouter();
  const category = params.category as SimulationCategory;

  const [currentScenario, setCurrentScenario] = useState<SimulationScenario | null>(null);
  const [availableScenarios, setAvailableScenarios] = useState<SimulationScenario[]>([]);

  useEffect(() => {
    // Filter scenarios by category
    const scenarios = (simulationsData as SimulationScenario[]).filter(
      (s) => s.category === category
    );

    if (scenarios.length === 0) {
      router.push('/test/simulation');
      return;
    }

    setAvailableScenarios(scenarios);

    // Select random scenario
    const randomScenario = scenarios[Math.floor(Math.random() * scenarios.length)];
    setCurrentScenario(randomScenario);
  }, [category, router]);

  const handleTryAgain = () => {
    // Select a different random scenario
    const otherScenarios = availableScenarios.filter(s => s.id !== currentScenario?.id);
    if (otherScenarios.length > 0) {
      const randomScenario = otherScenarios[Math.floor(Math.random() * otherScenarios.length)];
      setCurrentScenario(randomScenario);
    } else {
      // If only one scenario, reload the same one
      const randomScenario = availableScenarios[Math.floor(Math.random() * availableScenarios.length)];
      setCurrentScenario(randomScenario);
    }
  };

  const handleChangeCategory = () => {
    router.push('/test/simulation');
  };

  if (!currentScenario) {
    return (
      <main className="min-h-screen py-8 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-gray-600">Loading simulation...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Back Link */}
        <div className="text-center mb-6">
          <Link
            href="/test/simulation"
            className="inline-block text-primary hover:text-blue-600 font-semibold"
          >
            ← Back to Simulations
          </Link>
        </div>

        {/* Test Component */}
        <SimulationTest
          scenario={currentScenario}
          onChangeCategory={handleChangeCategory}
          onTryAgain={handleTryAgain}
        />

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-gray-200 text-center text-gray-600 text-sm">
          <p>&copy; {new Date().getFullYear()} Typing Speed Test. All rights reserved.</p>
        </footer>
      </div>
    </main>
  );
}
