'use client';

import { Button } from '@/components/ui/button';
import type { CreateGroupViewProps } from '@/types';

export function CreateGroupView({ onCreated, showToast }: CreateGroupViewProps) {
  return (
    <div className="p-6 pb-24 md:p-10">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Start a Dgroup</h1>
        <p className="text-slate-500">
          &ldquo;Go and make disciples of all nations.&rdquo;
        </p>
      </header>

      <div className="space-y-6 bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Group Name
          </label>
          <input
            type="text"
            placeholder="e.g. Wednesday Warriors"
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Life Stage
            </label>
            <select className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none bg-white">
              <option>B1G (Singles)</option>
              <option>Couples</option>
              <option>Youth</option>
              <option>Men</option>
              <option>Women</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Meeting Type
            </label>
            <select className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none bg-white">
              <option>Face to Face</option>
              <option>Online (Zoom)</option>
              <option>Hybrid</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Schedule
          </label>
          <input
            type="text"
            placeholder="e.g. Fridays at 7PM"
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Description
          </label>
          <textarea
            rows={3}
            placeholder="Briefly describe your group's focus..."
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>

        <div className="pt-4">
          <Button
            className="w-full"
            onClick={() => {
              showToast('Group created successfully!');
              onCreated();
            }}
          >
            Create Group
          </Button>
        </div>
      </div>
    </div>
  );
}
