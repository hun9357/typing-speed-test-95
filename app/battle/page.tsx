"use client";

import BattleMode from "@/components/battle/BattleMode";

export default function BattlePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/30 to-gray-900">
      <div className="container mx-auto py-8">
        <BattleMode />
      </div>
    </main>
  );
}
