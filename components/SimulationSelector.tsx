"use client";

import Link from "next/link";
import { CategoryInfo } from "@/types/simulation";

const categories: CategoryInfo[] = [
  {
    id: 'email',
    name: 'Email Response',
    icon: '📧',
    description: 'Practice professional business emails',
    gradient: 'from-blue-600 to-indigo-600',
    color: 'blue'
  },
  {
    id: 'support',
    name: 'Customer Support',
    icon: '💬',
    description: 'Handle customer inquiries with care',
    gradient: 'from-green-600 to-emerald-600',
    color: 'green'
  },
  {
    id: 'legal',
    name: 'Legal & Contracts',
    icon: '⚖️',
    description: 'Type formal documents with precision',
    gradient: 'from-purple-600 to-violet-600',
    color: 'purple'
  },
  {
    id: 'data-entry',
    name: 'Data Entry',
    icon: '📊',
    description: 'Speed and accuracy for data tasks',
    gradient: 'from-orange-600 to-amber-600',
    color: 'orange'
  }
];

const useCases: Record<string, string[]> = {
  email: ['reply to colleagues, clients, and managers'],
  support: ['help desk, chat support, ticket responses'],
  legal: ['agreements, terms, disclaimers'],
  'data-entry': ['records, forms, structured information']
};

export default function SimulationSelector() {
  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="text-5xl mb-4">🏢</div>
        <h1 className="text-4xl font-bold text-gray-900 mb-3">
          REAL-WORLD TYPING SIMULATION
        </h1>
        <div className="w-32 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto mb-6"></div>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Practice typing in real job scenarios
        </p>
      </div>

      {/* Category Selection */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          SELECT YOUR SIMULATION
        </h2>

        <div className="space-y-4">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/test/simulation/${category.id}`}
              className="block group"
            >
              <div className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 border-2 border-gray-100 hover:border-transparent hover:scale-[1.02]">
                <div className="flex items-center gap-4">
                  {/* Icon */}
                  <div className={`text-4xl bg-gradient-to-br ${category.gradient} bg-opacity-10 p-4 rounded-lg`}>
                    {category.icon}
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <h3 className={`text-xl font-bold text-gray-900 mb-1 group-hover:bg-gradient-to-r group-hover:${category.gradient} group-hover:bg-clip-text group-hover:text-transparent transition-all`}>
                      {category.name}
                    </h3>
                    <p className="text-gray-600 mb-2">{category.description}</p>
                    <p className="text-sm text-gray-500">
                      → {useCases[category.id].join(', ')}
                    </p>
                  </div>

                  {/* Arrow */}
                  <div className="text-gray-400 group-hover:text-gray-900 group-hover:translate-x-2 transition-all">
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Info Banner */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border-2 border-blue-200 shadow-md">
        <div className="flex items-start gap-3">
          <div className="text-2xl">💡</div>
          <div>
            <h3 className="font-bold text-gray-900 mb-2">Tip</h3>
            <p className="text-gray-700">
              These simulations prepare you for real-world job typing scenarios like call centers
              and office work. Each category provides practical feedback on your readiness for
              professional roles.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
