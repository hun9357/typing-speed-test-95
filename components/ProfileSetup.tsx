"use client";

import { useState } from 'react';
import Avatar from './Avatar';

interface ProfileSetupProps {
  onComplete: (nickname: string) => void;
  onSkip: () => void;
}

export default function ProfileSetup({ onComplete, onSkip }: ProfileSetupProps) {
  const [nickname, setNickname] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete(nickname.trim() || 'Anonymous');
  };

  // Generate preview initials
  const getInitials = () => {
    const name = nickname.trim() || 'Anonymous';
    const words = name.split(/\s+/);
    if (words.length === 1) {
      return words[0].substring(0, 2).toUpperCase();
    }
    return (words[0][0] + words[words.length - 1][0]).toUpperCase();
  };

  // Generate preview color (matches useProfile logic)
  const getPreviewColor = () => {
    const colors = [
      '#3B82F6', // blue
      '#8B5CF6', // purple
      '#EC4899', // pink
      '#F59E0B', // amber
      '#10B981', // emerald
      '#06B6D4', // cyan
      '#F97316', // orange
      '#6366F1', // indigo
    ];
    // Use nickname length to determine color (will be random in actual implementation)
    return colors[nickname.length % colors.length];
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 animate-fadeIn">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-5xl mb-4">⌨️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Welcome to Typing Speed Test!
          </h2>
          <p className="text-gray-600">
            Set up your profile to track your progress and earn achievements.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label htmlFor="nickname" className="block text-sm font-semibold text-gray-700 mb-2">
              What should we call you?
            </label>
            <input
              id="nickname"
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="Enter your nickname..."
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none transition-colors text-lg"
              maxLength={30}
              autoFocus
            />
            <p className="text-xs text-gray-500 mt-1">
              Leave blank for &quot;Anonymous&quot;
            </p>
          </div>

          {/* Preview */}
          <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-lg p-6 mb-6 border border-gray-200">
            <p className="text-sm font-semibold text-gray-700 mb-3">Preview:</p>
            <div className="flex items-center gap-4">
              {/* Avatar */}
              <Avatar
                initial={getInitials()}
                bgColor={getPreviewColor()}
                frameId="default"
                patternId="solid"
                size="lg"
              />
              {/* Info */}
              <div>
                <div className="font-bold text-gray-900 text-lg">
                  {nickname.trim() || 'Anonymous'}
                </div>
                <div className="text-sm text-gray-600">Level 1</div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-primary to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-4 px-6 rounded-lg transition-all shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
            >
              Get Started
            </button>
            <button
              type="button"
              onClick={onSkip}
              className="w-full text-gray-500 hover:text-gray-700 text-sm transition-colors"
            >
              Skip for now
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
