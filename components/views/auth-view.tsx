'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Users, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { signinSchema, type SigninInput } from '@/lib/validations/auth';
import type { AuthViewProps, User } from '@/types';
import Link from 'next/link';

function mapApiUser(apiUser: Record<string, unknown>): User {
  const firstName = apiUser.firstName as string;
  const lastName = apiUser.lastName as string;
  const lifeStageMap: Record<string, User['lifeStage']> = {
    SINGLE: 'Single',
    SINGLE_PROFESSIONAL: 'Single Professional',
    MARRIED: 'Married',
    PARENT: 'Parent',
  };
  return {
    id: apiUser.id as string,
    name: `${firstName} ${lastName}`,
    avatar: (apiUser.avatar as string | null) ?? `${firstName[0]}${lastName[0]}`.toUpperCase(),
    email: apiUser.email as string,
    lifeStage: lifeStageMap[apiUser.lifeStage as string] ?? 'Single',
    satellite: (apiUser.satellite as string) ?? '',
  };
}

export function AuthView({ onSignIn }: AuthViewProps) {
  const [serverError, setServerError] = useState('');
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SigninInput>({
    resolver: zodResolver(signinSchema),
  });

  const onSubmit = async (data: SigninInput) => {
    setServerError('');
    try {
      const res = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) {
        setServerError(json.error || 'Sign in failed');
        return;
      }
      onSignIn(mapApiUser(json.user));
    } catch {
      setServerError('Something went wrong. Please try again.');
    }
  };

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

        {serverError && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 text-red-600 text-sm">
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <input
              type="email"
              placeholder="Email Address"
              {...register('email')}
              className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1 text-left">{errors.email.message}</p>
            )}
          </div>
          <div>
            <input
              type="password"
              placeholder="Password"
              {...register('password')}
              className="w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            />
            {errors.password && (
              <p className="text-red-500 text-xs mt-1 text-left">{errors.password.message}</p>
            )}
          </div>
          <Button
            className="w-full shadow-lg shadow-indigo-200"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <Loader2 size={18} className="animate-spin mr-2" />
            ) : null}
            {isSubmitting ? 'Signing in...' : 'Sign In'}
          </Button>
          <p className="text-xs text-slate-400 mt-4">
            New here?{' '}
            <Link href="/signup" className="text-indigo-600 font-semibold hover:underline">
              Create Account
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
