"use client";

import { SimulationCategory } from "@/types/simulation";
import { generateSimulationFeedback } from "@/lib/simulation-feedback";

interface SimulationResultsProps {
  wpm: number;
  accuracy: number;
  errors: number;
  category: SimulationCategory;
  onTryAgain: () => void;
  onChangeCategory: () => void;
}

export default function SimulationResults({
  wpm,
  accuracy,
  errors,
  category,
  onTryAgain,
  onChangeCategory,
}: SimulationResultsProps) {
  const feedback = generateSimulationFeedback(category, Math.round(wpm), accuracy);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'excellent':
        return '✅';
      case 'good':
        return '✓';
      case 'needs-improvement':
        return '⚠️';
      default:
        return '';
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="text-5xl mb-4">✅</div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">SIMULATION COMPLETE!</h2>
      </div>

      {/* Results Card */}
      <div className="bg-white rounded-lg shadow-xl p-8 mb-6">
        <h3 className="text-xl font-bold text-gray-900 mb-6 border-b pb-3">Your Results</h3>
        <div className="grid grid-cols-3 gap-6 text-center mb-8">
          <div>
            <div className="text-sm text-gray-600 mb-2">Speed</div>
            <div className="text-3xl font-bold text-primary">{Math.round(wpm)} WPM</div>
          </div>
          <div>
            <div className="text-sm text-gray-600 mb-2">Accuracy</div>
            <div className="text-3xl font-bold text-green-600">{accuracy.toFixed(1)}%</div>
          </div>
          <div>
            <div className="text-sm text-gray-600 mb-2">Errors</div>
            <div className="text-3xl font-bold text-red-600">{errors}</div>
          </div>
        </div>

        {/* Feedback Title */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 mb-6">
          <h4 className="text-xl font-bold text-gray-900 mb-2">{feedback.title}</h4>
          <p className="text-gray-700">{feedback.message}</p>
        </div>

        {/* Practical Insights */}
        <div className="mb-6">
          <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            💼 REAL-WORLD INSIGHT
          </h4>
          <div className="space-y-2">
            {feedback.practicalInsights.map((insight, index) => (
              <div key={index} className="flex items-start gap-2">
                <span className="text-primary font-bold mt-1">•</span>
                <p className="text-gray-700">{insight}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Job Readiness */}
        {feedback.jobReadiness.length > 0 && (
          <div>
            <h4 className="text-lg font-bold text-gray-900 mb-4">Job Readiness Assessment</h4>
            <div className="space-y-3">
              {feedback.jobReadiness.map((job, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <span className="font-medium text-gray-900">{job.role}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{getStatusIcon(job.status)}</span>
                    <span
                      className={`text-sm font-semibold ${
                        job.status === 'excellent'
                          ? 'text-green-600'
                          : job.status === 'good'
                          ? 'text-blue-600'
                          : 'text-orange-600'
                      }`}
                    >
                      {job.status === 'excellent'
                        ? 'Excellent'
                        : job.status === 'good'
                        ? 'Good'
                        : 'Needs Improvement'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          onClick={onTryAgain}
          className="bg-primary hover:bg-blue-600 text-white font-semibold px-8 py-3 rounded-lg transition-colors shadow-lg hover:shadow-xl"
        >
          Try Another Scenario
        </button>
        <button
          onClick={onChangeCategory}
          className="bg-white hover:bg-gray-50 text-gray-900 font-semibold px-8 py-3 rounded-lg transition-colors shadow-lg hover:shadow-xl border-2 border-gray-300"
        >
          Change Category
        </button>
      </div>
    </div>
  );
}
