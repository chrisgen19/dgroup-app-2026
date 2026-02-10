'use client';

import { Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { AuthViewProps } from '@/types';

export function AuthView({ onSignIn }: AuthViewProps) {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative BG */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-200 rounded-full blur-[100px] opacity-40" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-orange-200 rounded-full blur-[100px] opacity-40" />

      <div className="max-w-md w-full bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-xl border border-white z-10 text-center">
        <div className="w-16 h-16 bg-gradient-to-tr from-indigo-600 to-purple-600 rounded-2xl mx-auto flex items-center justify-center mb-6 shadow-lg shadow-indigo-200">
          <Users className="text-white" size={32} />
        </div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">
          Welcome to Dgroup
        </h1>
        <p className="text-slate-500 mb-8">
          Connect, grow, and do life together.
        </p>

        <div className="space-y-4">
          <input
            type="email"
            placeholder="Email Address"
            className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
          />
          <Button
            className="w-full shadow-lg shadow-indigo-200"
            onClick={onSignIn}
          >
            Sign In
          </Button>
          <p className="text-xs text-slate-400 mt-4">
            New here?{' '}
            <span className="text-indigo-600 font-semibold cursor-pointer">
              Create Account
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
