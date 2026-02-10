'use client';

import {
  BookOpen,
  Share2,
  Clock,
  MapPin,
  ChevronRight,
  Plus,
} from 'lucide-react';
import { Avatar } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { Chip } from '@/components/ui/chip';
import type { HomeViewProps } from '@/types';

export function HomeView({
  currentUser,
  myGroups,
  onSelectGroup,
  onNavigate,
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
                  Next Meeting:{' '}
                  <span className="text-indigo-600 font-medium">
                    This Friday
                  </span>
                </span>
                <ChevronRight size={16} className="text-slate-400" />
              </div>
            </Card>
          ))}

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
