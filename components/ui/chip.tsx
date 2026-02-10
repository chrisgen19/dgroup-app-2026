'use client';

import type { ChipProps, ChipColor } from '@/types';

const colorStyles: Record<ChipColor, string> = {
  slate: 'bg-slate-100 text-slate-700',
  indigo: 'bg-indigo-100 text-indigo-700',
  green: 'bg-emerald-100 text-emerald-700',
  orange: 'bg-orange-100 text-orange-700',
};

export function Chip({ label, color = 'slate' }: ChipProps) {
  return (
    <span
      className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${colorStyles[color]}`}
    >
      {label}
    </span>
  );
}
