'use client';

import { useState } from 'react';
import { Search, User, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Chip } from '@/components/ui/chip';
import type { DiscoverViewProps, Group } from '@/types';

const FILTERS = ['All', 'B1G (Singles)', 'Couples', 'Youth', 'Men', 'Women'];

export function DiscoverView({
  availableGroups,
  currentUser,
  onJoinGroup,
  showToast,
}: DiscoverViewProps) {
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [joiningId, setJoiningId] = useState<string | null>(null);

  const filtered = availableGroups.filter((group) => {
    const matchesFilter = activeFilter === 'All' || group.type === activeFilter;
    const matchesSearch =
      !search ||
      group.name.toLowerCase().includes(search.toLowerCase()) ||
      group.description.toLowerCase().includes(search.toLowerCase()) ||
      group.location.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Sort: satellite match first
  const sorted = [...filtered].sort((a, b) => {
    const userSat = currentUser.satellite;
    if (!userSat) return 0;
    // Groups with members from same satellite go first (based on group's satellite field from API)
    const aLeaderName = a.leaderName;
    const bLeaderName = b.leaderName;
    // Simple: just use the group name/location for now, real satellite matching happens server-side
    const aMatch = a.location.toLowerCase().includes(userSat.toLowerCase()) ? 0 : 1;
    const bMatch = b.location.toLowerCase().includes(userSat.toLowerCase()) ? 0 : 1;
    return aMatch - bMatch;
  });

  const handleJoin = async (group: Group) => {
    setJoiningId(group.id);
    try {
      const result = await onJoinGroup(group);
      if (result.joined) {
        showToast(`Joined ${group.name}!`);
      } else if (result.requested) {
        showToast(`Request sent to ${group.leaderName}`);
      }
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Failed to join');
    } finally {
      setJoiningId(null);
    }
  };

  return (
    <div className="p-6 pb-24 md:p-10 space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-slate-900">Find a Community</h1>
        <p className="text-slate-500">
          Search for a group that fits your life stage.
        </p>
      </header>

      <div className="relative">
        <Search className="absolute left-4 top-3.5 text-slate-400" size={20} />
        <input
          type="text"
          placeholder="Search by location, leader, or topic..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
        />
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
        {FILTERS.map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              activeFilter === filter
                ? 'bg-slate-800 text-white'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {sorted.length === 0 && (
          <p className="text-center text-slate-400 py-8">No groups found.</p>
        )}
        {sorted.map((group) => (
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
              {group.members.length > 0 && (
                <Chip label={`${group.members.length}/${group.maxMembers}`} color="green" />
              )}
            </div>
            <Button
              className="w-full"
              variant="secondary"
              disabled={joiningId === group.id}
              onClick={() => handleJoin(group)}
            >
              {joiningId === group.id
                ? 'Joining...'
                : group.joinMode === 'AUTO_ACCEPT'
                  ? 'Join Group'
                  : 'Request to Join'}
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
}
