"use client";

interface TimerProps {
  seconds: number;
}

export default function Timer({ seconds }: TimerProps) {
  return (
    <div className="text-2xl font-bold text-gray-900">
      <span className="text-primary">{seconds}</span>s
    </div>
  );
}
