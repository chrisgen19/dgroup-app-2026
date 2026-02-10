'use client';

import {
  BookOpen,
  Share2,
  Clock,
  MapPin,
  ChevronRight,
  Plus,
  Bell,
} from 'lucide-react';
import { Avatar } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { Chip } from '@/components/ui/chip';
import { JoinRequestCard } from '@/components/features/join-request-card';
import type { HomeViewProps } from '@/types';

export function HomeView({
  currentUser,
  myGroups,
  pendingRequests,
  onSelectGroup,
  onNavigate,
  onApproveRequest,
  onRejectRequest,
}: HomeViewProps) {
  return (
    <div className="p-6 pb-24 md:p-10 space-y-6">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Good Evening, {currentUser.name.split(' ')[0]}.
          </h1>
          <p className="text-slate-500">Ready to grow today?</p>
        </div>
        <div className="md:hidden">
          <Avatar name={currentUser.name} />
        </div>
      </header>

      {/* Daily Verse Card */}
      <Card className="bg-gradient-to-br from-indigo-600 to-purple-700 text-white border-0 overflow-hidden relative">
        <div className="absolute top-0 right-0 p-12 bg-white/10 rounded-full blur-2xl transform translate-x-1/2 -translate-y-1/2" />
        <div className="p-6 relative z-10">
          <div className="flex items-center gap-2 mb-4 opacity-80">
            <BookOpen size={16} />
            <span className="text-sm font-medium uppercase tracking-wider">
              Daily Verse
            </span>
          </div>
          <p className="text-xl md:text-2xl font-serif italic leading-relaxed mb-4">
            &ldquo;But seek first his kingdom and his righteousness, and all
            these things will be given to you as well.&rdquo;
          </p>
          <div className="flex justify-between items-end">
            <span className="font-medium">Matthew 6:33</span>
            <button className="bg-white/20 hover:bg-white/30 p-2 rounded-lg transition-colors">
              <Share2 size={18} />
            </button>
          </div>
        </div>
      </Card>

      {/* Pending Join Requests */}
      {pendingRequests.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Bell size={18} className="text-indigo-600" />
            <h2 className="text-lg font-bold text-slate-900">Join Requests</h2>
            <span className="bg-indigo-100 text-indigo-700 text-xs font-bold px-2 py-0.5 rounded-full">
              {pendingRequests.length}
            </span>
          </div>
          <div className="space-y-3">
            {pendingRequests.map((request) => (
              <JoinRequestCard
                key={request.id}
                request={request}
                onApprove={onApproveRequest}
                onReject={onRejectRequest}
                showGroupName
              />
            ))}
          </div>
        </div>
      )}

      <div>
        <h2 className="text-lg font-bold text-slate-900 mb-4">My Dgroups</h2>
        <div className="space-y-4">
          {myGroups.map((group) => (
            <Card
              key={group.id}
              onClick={() => onSelectGroup(group)}
              className="group"
            >
              <div className="p-5 flex items-start gap-4">
                <div className="w-16 h-16 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 font-bold text-xl">
                  {group.name.substring(0, 2)}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                      {group.name}
                    </h3>
                    <Chip label={group.type} color="indigo" />
                  </div>
                  <p className="text-slate-500 text-sm mt-1 mb-3 line-clamp-1">
                    {group.description}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-slate-400">
                    <div className="flex items-center gap-1">
                      <Clock size={14} />
                      {group.schedule}
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin size={14} />
                      {group.location}
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-slate-50 p-3 px-5 border-t border-slate-100 flex justify-between items-center text-sm">
                <span className="text-slate-500">
                  {group.members.length} member{group.members.length !== 1 ? 's' : ''}
                </span>
                <ChevronRight size={16} className="text-slate-400" />
              </div>
            </Card>
          ))}

          {myGroups.length === 0 && (
            <p className="text-center text-slate-400 py-4">
              You haven&apos;t joined any groups yet.
            </p>
          )}

          <button
            onClick={() => onNavigate('discover')}
            className="w-full py-4 border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 font-medium hover:border-indigo-300 hover:text-indigo-600 transition-all flex items-center justify-center gap-2"
          >
            <Plus size={20} />
            Join another group
          </button>
        </div>
      </div>
    </div>
  );
}
