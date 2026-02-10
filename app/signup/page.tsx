'use client';

import { useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Users, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { signupSchema, type SignupInput } from '@/lib/validations/auth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const CCF_SATELLITES = [
  'CCF Main',
  'CCF Alabang',
  'CCF Eastwood',
  'CCF Pasig',
  'CCF Makati',
  'CCF Center North',
  'CCF South Metro',
];

const inputClass =
  'w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all';

const selectClass =
  'w-full px-5 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all appearance-none';

export default function SignupPage() {
  const router = useRouter();
  const [serverError, setServerError] = useState('');
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<SignupInput>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      church: '',
      gender: undefined,
      lifeStage: undefined,
    },
  });

  const church = useWatch({ control, name: 'church' });

  const onSubmit = async (data: SignupInput) => {
    setServerError('');
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) {
        setServerError(json.error || 'Signup failed');
        return;
      }
      router.push('/');
    } catch {
      setServerError('Something went wrong. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative BG */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-200 rounded-full blur-[100px] opacity-40" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-orange-200 rounded-full blur-[100px] opacity-40" />

      <div className="max-w-lg w-full bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-xl border border-white z-10">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-tr from-indigo-600 to-purple-600 rounded-2xl mx-auto flex items-center justify-center mb-6 shadow-lg shadow-indigo-200">
            <Users className="text-white" size={32} />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Create Account</h1>
          <p className="text-slate-500">Join the Dgroup community today.</p>
        </div>

        {serverError && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 text-red-600 text-sm">
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Personal Info */}
          <div>
            <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wider mb-3">
              Personal Info
            </h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <input
                    type="text"
                    placeholder="First Name"
                    {...register('firstName')}
                    className={inputClass}
                  />
                  {errors.firstName && (
                    <p className="text-red-500 text-xs mt-1">{errors.firstName.message}</p>
                  )}
                </div>
                <div>
                  <input
                    type="text"
                    placeholder="Last Name"
                    {...register('lastName')}
                    className={inputClass}
                  />
                  {errors.lastName && (
                    <p className="text-red-500 text-xs mt-1">{errors.lastName.message}</p>
                  )}
                </div>
              </div>
              <div>
                <input
                  type="email"
                  placeholder="Email Address"
                  {...register('email')}
                  className={inputClass}
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
                )}
              </div>
              <div>
                <input
                  type="password"
                  placeholder="Password"
                  {...register('password')}
                  className={inputClass}
                />
                {errors.password && (
                  <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
                )}
              </div>
              <div>
                <input
                  type="password"
                  placeholder="Confirm Password"
                  {...register('confirmPassword')}
                  className={inputClass}
                />
                {errors.confirmPassword && (
                  <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* About You */}
          <div>
            <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wider mb-3">
              About You
            </h2>
            <div className="space-y-4">
              <div>
                <select {...register('gender')} className={selectClass} defaultValue="">
                  <option value="" disabled>
                    Select Gender
                  </option>
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                </select>
                {errors.gender && (
                  <p className="text-red-500 text-xs mt-1">{errors.gender.message}</p>
                )}
              </div>
              <div>
                <select {...register('lifeStage')} className={selectClass} defaultValue="">
                  <option value="" disabled>
                    Select Life Stage
                  </option>
                  <option value="SINGLE">Single</option>
                  <option value="SINGLE_PROFESSIONAL">Single Professional</option>
                  <option value="MARRIED">Married</option>
                  <option value="PARENT">Parent</option>
                </select>
                {errors.lifeStage && (
                  <p className="text-red-500 text-xs mt-1">{errors.lifeStage.message}</p>
                )}
              </div>
              <div>
                <select {...register('church')} className={selectClass} defaultValue="">
                  <option value="" disabled>
                    Select Church
                  </option>
                  <option value="CCF">CCF (Christ&apos;s Commission Fellowship)</option>
                  <option value="Other">Other Church</option>
                </select>
                {errors.church && (
                  <p className="text-red-500 text-xs mt-1">{errors.church.message}</p>
                )}
              </div>
              {church === 'CCF' && (
                <div>
                  <select {...register('satellite')} className={selectClass} defaultValue="">
                    <option value="" disabled>
                      Select CCF Satellite
                    </option>
                    {CCF_SATELLITES.map((sat) => (
                      <option key={sat} value={sat}>
                        {sat}
                      </option>
                    ))}
                  </select>
                  {errors.satellite && (
                    <p className="text-red-500 text-xs mt-1">{errors.satellite.message}</p>
                  )}
                </div>
              )}
              <div>
                <input
                  type="text"
                  placeholder="Country"
                  {...register('country')}
                  className={inputClass}
                />
                {errors.country && (
                  <p className="text-red-500 text-xs mt-1">{errors.country.message}</p>
                )}
              </div>
            </div>
          </div>

          <Button className="w-full shadow-lg shadow-indigo-200" disabled={isSubmitting}>
            {isSubmitting ? (
              <Loader2 size={18} className="animate-spin mr-2" />
            ) : null}
            {isSubmitting ? 'Creating Account...' : 'Create Account'}
          </Button>

          <p className="text-xs text-slate-400 text-center">
            Already have an account?{' '}
            <Link href="/" className="text-indigo-600 font-semibold hover:underline">
              Sign In
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
