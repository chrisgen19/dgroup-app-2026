'use client';

import type { ButtonProps, ButtonVariant } from '@/types';

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md shadow-indigo-200 px-6 py-3',
  secondary: 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100 px-5 py-2.5',
  outline:
    'border border-slate-200 text-slate-600 hover:bg-slate-50 px-5 py-2.5',
  ghost: 'text-slate-600 hover:bg-slate-100 px-3 py-2',
  danger: 'bg-red-50 text-red-600 hover:bg-red-100 px-5 py-2.5',
};

export function Button({
  children,
  onClick,
  variant = 'primary',
  className = '',
  icon: Icon,
  disabled = false,
}: ButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`flex items-center justify-center font-medium rounded-full transition-all duration-200 active:scale-95 ${variantStyles[variant]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
    >
      {Icon && <Icon size={18} className="mr-2" />}
      {children}
    </button>
  );
}
