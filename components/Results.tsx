"use client";

interface ResultsProps {
  wpm: number;
  accuracy: number;
  errors: number;
  onReset: () => void;
}

export default function Results({ wpm, accuracy, errors, onReset }: ResultsProps) {
  return (
    <div className="max-w-2xl mx-auto text-center">
      {/* AdSense Placeholder - Above Results */}
      {/* AdSense ad unit - Test results top */}

      <h2 className="text-3xl font-bold text-gray-900 mb-8">Your Results</h2>

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

      <button
        onClick={onReset}
        className="bg-primary hover:bg-blue-600 text-white font-semibold px-8 py-3 rounded-lg transition-colors shadow-lg hover:shadow-xl"
      >
        Try Again
      </button>

      {/* AdSense Placeholder - Below Results */}
      {/* AdSense ad unit - Test results bottom */}
    </div>
  );
}
