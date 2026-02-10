'use client';

import { Heart, Search, Plus, User, Users, LogOut } from 'lucide-react';
import { Avatar } from '@/components/ui/avatar';
import type { NavBarProps, ViewType } from '@/types';

interface NavItem {
  id: ViewType;
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'home', label: 'My Groups', icon: Heart },
  { id: 'discover', label: 'Discover', icon: Search },
  { id: 'create', label: 'Create', icon: Plus },
];

export function NavBar({ view, currentUser, onNavigate, onLogout }: NavBarProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 py-3 px-6 flex justify-between items-center z-40 md:static md:flex-col md:w-64 md:h-screen md:border-r md:border-t-0 md:justify-start md:py-8 md:px-6 md:space-y-8">
      {/* Desktop Logo */}
      <div className="hidden md:flex items-center gap-3 px-4 mb-4">
        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
          <Users className="text-white" size={18} />
        </div>
        <span className="font-bold text-xl tracking-tight">Dgroup</span>
      </div>

      <div className="flex justify-between w-full md:flex-col md:space-y-2">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = view === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex flex-col md:flex-row md:px-4 md:py-3 md:rounded-xl md:gap-3 items-center transition-colors ${
                isActive
                  ? 'text-indigo-600 md:bg-indigo-50'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <Icon
                size={24}
                className={isActive && item.id === 'home' ? 'fill-current' : ''}
              />
              <span className="text-[10px] md:text-sm font-medium mt-1 md:mt-0">
                {item.label}
              </span>
            </button>
          );
        })}
        <button className="flex flex-col md:flex-row md:px-4 md:py-3 md:rounded-xl md:gap-3 items-center text-slate-400 hover:text-slate-600">
          <User size={24} />
          <span className="text-[10px] md:text-sm font-medium mt-1 md:mt-0">
            Profile
          </span>
        </button>
      </div>

      {/* Desktop Profile at bottom */}
      <div className="hidden md:flex mt-auto pt-8 border-t border-slate-100 items-center gap-3 px-2">
        <Avatar name={currentUser.name} size="md" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold truncate">{currentUser.name}</p>
          <p className="text-xs text-slate-500 truncate">
            {currentUser.satellite}
          </p>
        </div>
        <LogOut
          size={16}
          className="text-slate-400 cursor-pointer hover:text-red-500"
          onClick={onLogout}
        />
      </div>
    </div>
  );
}
