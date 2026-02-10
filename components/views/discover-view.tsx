'use client';

import { Search, User, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Chip } from '@/components/ui/chip';
import type { DiscoverViewProps } from '@/types';

const FILTERS = ['All', 'B1G Singles', 'Couples', 'Youth', 'Men', 'Women'];

export function DiscoverView({
  availableGroups,
  onJoinGroup,
  showToast,
}: DiscoverViewProps) {
  return (
    <div className="p-6 pb-24 md:p-10 space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-slate-900">
          Find a Community
        </h1>
        <p className="text-slate-500">
          Search for a group that fits your life stage.
        </p>
      </header>

      <div className="relative">
        <Search className="absolute left-4 top-3.5 text-slate-400" size={20} />
        <input
          type="text"
          placeholder="Search by location, leader, or topic..."
          className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
        />
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
        {FILTERS.map((filter, i) => (
          <button
            key={filter}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              i === 0
                ? 'bg-slate-800 text-white'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {availableGroups.map((group) => (
          <Card key={group.id} className="p-5">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-bold text-lg text-slate-900">
                  {group.name}
                </h3>
                <p className="text-sm text-indigo-600 font-medium flex items-center gap-1">
                  <User size={14} /> Led by {group.leaderName}
                </p>
              </div>
              <div className="bg-slate-100 p-2 rounded-lg">
                <Users size={20} className="text-slate-500" />
              </div>
            </div>
            <p className="text-slate-500 text-sm mb-4">{group.description}</p>
            <div className="flex flex-wrap gap-2 mb-4">
              <Chip label={group.type} />
              <Chip label={group.location} color="slate" />
            </div>
            <Button
              className="w-full"
              variant="secondary"
              onClick={() => {
                onJoinGroup(group);
                showToast(`Request sent to ${group.leaderName}`);
              }}
            >
              Request to Join
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
}
