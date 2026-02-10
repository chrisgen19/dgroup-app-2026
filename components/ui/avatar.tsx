'use client';

import type { AvatarProps, AvatarSize } from '@/types';

const sizeStyles: Record<AvatarSize, string> = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-14 h-14 text-base',
};

export function Avatar({ name, size = 'md', className = '' }: AvatarProps) {
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  return (
    <div
      className={`${sizeStyles[size]} rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center font-bold shadow-sm ${className}`}
    >
      {initials}
    </div>
  );
}
