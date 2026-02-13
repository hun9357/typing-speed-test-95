"use client";

import { useEffect, useState } from 'react';
import { Quest } from '@/lib/daily-quests';

interface QuestCompleteToastProps {
  quest: Quest;
  onDismiss: () => void;
}

export default function QuestCompleteToast({ quest, onDismiss }: QuestCompleteToastProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Slide in animation
    const showTimer = setTimeout(() => setIsVisible(true), 100);

    // Auto-dismiss after 3 seconds
    const dismissTimer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onDismiss, 300); // Wait for fade out animation
    }, 3000);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(dismissTimer);
    };
  }, [onDismiss]);

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 transform transition-all duration-300 ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
      }`}
    >
      <div className="bg-green-600 text-white rounded-xl shadow-2xl px-6 py-4 min-w-[300px]">
        <div className="flex items-center gap-3">
          <span className="text-2xl">✅</span>
          <div>
            <div className="font-bold text-lg">Quest Complete!</div>
            <div className="text-sm opacity-90">{quest.title}</div>
            <div className="text-yellow-200 font-bold text-sm mt-1">+{quest.xpReward} XP</div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface QuestCompleteToastContainerProps {
  quests: Quest[];
  onDismiss: (questId: string) => void;
}

export function QuestCompleteToastContainer({
  quests,
  onDismiss,
}: QuestCompleteToastContainerProps) {
  return (
    <div className="fixed bottom-0 right-0 z-50 pointer-events-none">
      <div className="flex flex-col-reverse gap-3 p-6 pointer-events-auto">
        {quests.map((quest, index) => (
          <div
            key={quest.id}
            style={{
              transform: `translateY(-${index * 10}px)`,
            }}
          >
            <QuestCompleteToast quest={quest} onDismiss={() => onDismiss(quest.id)} />
          </div>
        ))}
      </div>
    </div>
  );
}
