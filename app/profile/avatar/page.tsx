"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useProfile } from '@/hooks/useProfile';
import { useXP } from '@/hooks/useXP';
import { useAchievements } from '@/hooks/useAchievements';
import { useAvatarInventory } from '@/hooks/useAvatarInventory';
import Avatar from '@/components/Avatar';
import {
  AVATAR_COLORS,
  AVATAR_FRAMES,
  AVATAR_PATTERNS,
  getUnlockDescription,
} from '@/lib/avatar-items';

type Tab = 'initials' | 'color' | 'frame' | 'pattern';

export default function AvatarCustomizationPage() {
  const router = useRouter();
  const { profile, updateProfile } = useProfile();
  const { level } = useXP();
  const { achievements } = useAchievements();

  // Get unlocked achievement IDs
  const unlockedAchievementIds = achievements
    .filter(a => a.unlocked)
    .map(a => a.def.id);

  const { isColorUnlocked, isFrameUnlocked, isPatternUnlocked } = useAvatarInventory(
    level,
    unlockedAchievementIds
  );

  const [activeTab, setActiveTab] = useState<Tab>('color');
  const [hasChanges, setHasChanges] = useState(false);

  // Preview state
  const [previewInitial, setPreviewInitial] = useState('');
  const [previewColor, setPreviewColor] = useState('');
  const [previewFrame, setPreviewFrame] = useState('');
  const [previewPattern, setPreviewPattern] = useState('');

  // Initialize preview from profile
  useEffect(() => {
    if (profile) {
      setPreviewInitial(profile.avatar.initial);
      setPreviewColor(profile.avatar.bgColor);
      setPreviewFrame(profile.avatar.frameId);
      setPreviewPattern(profile.avatar.patternId);
    }
  }, [profile]);

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  const handleSave = () => {
    const success = updateProfile({
      avatar: {
        initial: previewInitial,
        bgColor: previewColor,
        frameId: previewFrame,
        patternId: previewPattern,
      },
    });

    if (success) {
      setHasChanges(false);
      router.push('/profile');
    }
  };

  const handleColorSelect = (colorId: string) => {
    if (!isColorUnlocked(colorId)) return;
    setPreviewColor(colorId);
    setHasChanges(true);
  };

  const handleFrameSelect = (frameId: string) => {
    if (!isFrameUnlocked(frameId)) return;
    setPreviewFrame(frameId);
    setHasChanges(true);
  };

  const handlePatternSelect = (patternId: string) => {
    if (!isPatternUnlocked(patternId)) return;
    setPreviewPattern(patternId);
    setHasChanges(true);
  };

  const handleInitialChange = (value: string) => {
    const sanitized = value.toUpperCase().slice(0, 2);
    setPreviewInitial(sanitized);
    setHasChanges(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => router.push('/profile')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="font-medium">Profile</span>
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Customize Avatar</h1>
          <div className="w-20" /> {/* Spacer for balance */}
        </div>

        {/* Preview */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-6">
          <div className="flex flex-col items-center gap-4">
            <Avatar
              initial={previewInitial}
              bgColor={previewColor}
              frameId={previewFrame}
              patternId={previewPattern}
              size="xl"
            />
            <div className="text-center">
              <p className="text-lg font-semibold text-gray-900">{profile.nickname}</p>
              <p className="text-sm text-gray-500">Level {level}</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('initials')}
              className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
                activeTab === 'initials'
                  ? 'bg-indigo-50 text-indigo-600 border-b-2 border-indigo-600'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              Initials
            </button>
            <button
              onClick={() => setActiveTab('color')}
              className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
                activeTab === 'color'
                  ? 'bg-indigo-50 text-indigo-600 border-b-2 border-indigo-600'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              Color
            </button>
            <button
              onClick={() => setActiveTab('frame')}
              className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
                activeTab === 'frame'
                  ? 'bg-indigo-50 text-indigo-600 border-b-2 border-indigo-600'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              Frame
            </button>
            <button
              onClick={() => setActiveTab('pattern')}
              className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
                activeTab === 'pattern'
                  ? 'bg-indigo-50 text-indigo-600 border-b-2 border-indigo-600'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              Pattern
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {/* Initials Tab */}
            {activeTab === 'initials' && (
              <div className="space-y-4">
                <label className="block">
                  <span className="text-sm font-medium text-gray-700 mb-2 block">
                    Avatar Initials (1-2 characters)
                  </span>
                  <input
                    type="text"
                    value={previewInitial}
                    onChange={(e) => handleInitialChange(e.target.value)}
                    maxLength={2}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-center text-xl font-bold uppercase"
                    placeholder="JK"
                  />
                </label>
                <p className="text-xs text-gray-500">
                  This will be displayed in the center of your avatar. By default, it uses your nickname initials.
                </p>
              </div>
            )}

            {/* Color Tab */}
            {activeTab === 'color' && (
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Select Background Color</h3>
                <div className="grid grid-cols-5 gap-3">
                  {AVATAR_COLORS.map((color) => {
                    const unlocked = isColorUnlocked(color.id);
                    const selected = previewColor === color.id;

                    return (
                      <button
                        key={color.id}
                        onClick={() => handleColorSelect(color.id)}
                        disabled={!unlocked}
                        className={`
                          relative aspect-square rounded-xl transition-all
                          ${unlocked ? 'cursor-pointer hover:scale-105' : 'cursor-not-allowed opacity-50'}
                          ${selected ? 'ring-4 ring-indigo-500 ring-offset-2' : 'hover:ring-2 hover:ring-gray-300'}
                        `}
                        style={{ backgroundColor: color.hex }}
                        title={unlocked ? color.name : getUnlockDescription(color.unlockCondition)}
                      >
                        {!unlocked && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-xl">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                          </div>
                        )}
                        {selected && unlocked && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <svg className="w-8 h-8 text-white drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
                <div className="grid grid-cols-5 gap-3 text-xs text-center text-gray-600 mt-2">
                  {AVATAR_COLORS.map((color) => {
                    const unlocked = isColorUnlocked(color.id);
                    return (
                      <div key={color.id} className={unlocked ? '' : 'text-gray-400'}>
                        {unlocked ? color.name : getUnlockDescription(color.unlockCondition).replace('Unlock at Level ', 'Lv')}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Frame Tab */}
            {activeTab === 'frame' && (
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Select Frame Style</h3>
                <div className="grid grid-cols-3 gap-4">
                  {AVATAR_FRAMES.map((frame) => {
                    const unlocked = isFrameUnlocked(frame.id);
                    const selected = previewFrame === frame.id;

                    return (
                      <button
                        key={frame.id}
                        onClick={() => handleFrameSelect(frame.id)}
                        disabled={!unlocked}
                        className={`
                          p-4 rounded-xl border-2 transition-all
                          ${unlocked ? 'cursor-pointer hover:scale-105' : 'cursor-not-allowed opacity-50'}
                          ${selected ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200 hover:border-gray-300'}
                        `}
                      >
                        <div className="flex flex-col items-center gap-3">
                          <Avatar
                            initial={previewInitial}
                            bgColor={previewColor}
                            frameId={frame.id}
                            patternId={previewPattern}
                            size="lg"
                          />
                          <div className="text-center">
                            <p className="text-sm font-medium text-gray-900">{frame.name}</p>
                            {!unlocked && (
                              <p className="text-xs text-gray-500 mt-1">
                                {getUnlockDescription(frame.unlockCondition)}
                              </p>
                            )}
                          </div>
                          {!unlocked && (
                            <div className="absolute top-2 right-2">
                              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                              </svg>
                            </div>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Pattern Tab */}
            {activeTab === 'pattern' && (
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Select Pattern Overlay</h3>
                <div className="grid grid-cols-3 gap-4">
                  {AVATAR_PATTERNS.map((pattern) => {
                    const unlocked = isPatternUnlocked(pattern.id);
                    const selected = previewPattern === pattern.id;

                    return (
                      <button
                        key={pattern.id}
                        onClick={() => handlePatternSelect(pattern.id)}
                        disabled={!unlocked}
                        className={`
                          p-4 rounded-xl border-2 transition-all
                          ${unlocked ? 'cursor-pointer hover:scale-105' : 'cursor-not-allowed opacity-50'}
                          ${selected ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200 hover:border-gray-300'}
                        `}
                      >
                        <div className="flex flex-col items-center gap-3">
                          <Avatar
                            initial={previewInitial}
                            bgColor={previewColor}
                            frameId={previewFrame}
                            patternId={pattern.id}
                            size="lg"
                          />
                          <div className="text-center">
                            <p className="text-sm font-medium text-gray-900">{pattern.name}</p>
                            {!unlocked && (
                              <p className="text-xs text-gray-500 mt-1">
                                {getUnlockDescription(pattern.unlockCondition)}
                              </p>
                            )}
                          </div>
                          {!unlocked && (
                            <div className="absolute top-2 right-2">
                              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                              </svg>
                            </div>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Save Button */}
        <div className="mt-6">
          <button
            onClick={handleSave}
            disabled={!hasChanges}
            className={`
              w-full py-4 rounded-xl font-semibold text-white transition-all
              ${
                hasChanges
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg shadow-indigo-500/30'
                  : 'bg-gray-300 cursor-not-allowed'
              }
            `}
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
