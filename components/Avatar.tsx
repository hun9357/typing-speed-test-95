import React from 'react';
import { getColorById, getFrameById, getPatternById } from '@/lib/avatar-items';

interface AvatarProps {
  initial: string;
  bgColor: string;
  frameId: string;
  patternId: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const SIZE_MAP = {
  sm: { container: 'w-8 h-8', text: 'text-xs' },
  md: { container: 'w-12 h-12', text: 'text-sm' },
  lg: { container: 'w-20 h-20', text: 'text-2xl' },
  xl: { container: 'w-32 h-32', text: 'text-4xl' },
};

/**
 * Pure CSS/Tailwind Avatar Component
 * Renders circular avatar with color, pattern, frame, and initials
 */
export default function Avatar({
  initial,
  bgColor,
  frameId,
  patternId,
  size = 'md',
  className = '',
}: AvatarProps) {
  const sizeStyles = SIZE_MAP[size];

  // Get frame border style
  const frame = getFrameById(frameId);
  const frameBorderStyle = frame?.borderStyle || 'border-2 border-white/30';

  // Get pattern
  const pattern = getPatternById(patternId);
  const patternValue = pattern?.pattern || 'none';

  // Parse hex color or use as-is if it's already a color
  const backgroundColor = bgColor.startsWith('#') ? bgColor : getColorById(bgColor)?.hex || bgColor;

  return (
    <div
      className={`
        ${sizeStyles.container}
        rounded-full
        flex items-center justify-center
        relative
        overflow-hidden
        ${frameBorderStyle}
        ${className}
      `}
      style={{
        backgroundColor,
      }}
    >
      {/* Pattern overlay */}
      {patternValue !== 'none' && (
        <div
          className="absolute inset-0 rounded-full"
          style={{
            backgroundImage: patternValue,
            backgroundSize: patternId === 'dots' ? '8px 8px' : patternId === 'grid' ? '8px 8px' : 'auto',
          }}
        />
      )}

      {/* Initial text */}
      <span
        className={`
          ${sizeStyles.text}
          font-bold
          text-white
          relative
          z-10
          select-none
        `}
      >
        {initial}
      </span>
    </div>
  );
}
