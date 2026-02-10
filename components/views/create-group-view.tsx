'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { createGroupSchema, type CreateGroupInput } from '@/lib/validations/group';
import type { CreateGroupViewProps } from '@/types';

export function CreateGroupView({ onCreated, showToast }: CreateGroupViewProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateGroupInput>({
    resolver: zodResolver(createGroupSchema),
    defaultValues: {
      joinMode: 'AUTO_ACCEPT',
      status: 'PUBLIC',
      maxMembers: 12,
    },
  });

  const onSubmit = async (data: CreateGroupInput) => {
    try {
      const res = await fetch('/api/groups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = await res.json();
        showToast(err.error ?? 'Failed to create group');
        return;
      }
      showToast('Group created successfully!');
      onCreated();
    } catch {
      showToast('Something went wrong');
    }
  };

  return (
    <div className="p-6 pb-24 md:p-10">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Start a Dgroup</h1>
        <p className="text-slate-500">
          &ldquo;Go and make disciples of all nations.&rdquo;
        </p>
      </header>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6 bg-white p-8 rounded-3xl shadow-sm border border-slate-100"
      >
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Group Name
          </label>
          <input
            type="text"
            placeholder="e.g. Wednesday Warriors"
            {...register('name')}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
          />
          {errors.name && (
            <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Life Stage
            </label>
            <select
              {...register('type')}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
            >
              <option value="">Select type</option>
              <option value="B1G (Singles)">B1G (Singles)</option>
              <option value="Couples">Couples</option>
              <option value="Youth">Youth</option>
              <option value="Men">Men</option>
              <option value="Women">Women</option>
            </select>
            {errors.type && (
              <p className="text-red-500 text-xs mt-1">{errors.type.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Location / Meeting Type
            </label>
            <input
              type="text"
              placeholder="e.g. Ortigas / Hybrid"
              {...register('location')}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
            />
            {errors.location && (
              <p className="text-red-500 text-xs mt-1">{errors.location.message}</p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Schedule
          </label>
          <input
            type="text"
            placeholder="e.g. Fridays at 7PM"
            {...register('schedule')}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
          />
          {errors.schedule && (
            <p className="text-red-500 text-xs mt-1">{errors.schedule.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Description
          </label>
          <textarea
            rows={3}
            placeholder="Briefly describe your group's focus..."
            {...register('description')}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
          />
          {errors.description && (
            <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Join Mode
            </label>
            <select
              {...register('joinMode')}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
            >
              <option value="AUTO_ACCEPT">Auto Accept</option>
              <option value="REQUEST_TO_JOIN">Request to Join</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Max Members
            </label>
            <input
              type="number"
              min={2}
              max={50}
              {...register('maxMembers', { valueAsNumber: true })}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Visibility
          </label>
          <select
            {...register('status')}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
          >
            <option value="PUBLIC">Public</option>
            <option value="PRIVATE">Private</option>
          </select>
        </div>

        <div className="pt-4">
          <Button className="w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Creating...' : 'Create Group'}
          </Button>
        </div>
      </form>
    </div>
  );
}
