'use client';

import { CheckCircle2 } from 'lucide-react';
import type { ToastProps } from '@/types';

export function Toast({ message }: ToastProps) {
  return (
    <div className="fixed top-6 left-1/2 transform -translate-x-1/2 bg-slate-900 text-white px-6 py-3 rounded-full shadow-2xl z-[60] text-sm animate-in fade-in slide-in-from-top-4 flex items-center gap-2">
      <CheckCircle2 size={16} className="text-emerald-400" /> {message}
    </div>
  );
}
