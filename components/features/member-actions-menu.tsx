'use client';

import { useState, useRef, useEffect } from 'react';
import { MoreVertical, Shield, ShieldOff, UserMinus } from 'lucide-react';
import type { GroupMember, UserRole } from '@/types';

interface MemberActionsMenuProps {
  member: GroupMember;
  currentUserRole: UserRole;
  onUpdateRole: (memberId: string, role: UserRole) => void;
  onRemoveMember: (memberId: string) => void;
}

export function MemberActionsMenu({
  member,
  currentUserRole,
  onUpdateRole,
  onRemoveMember,
}: MemberActionsMenuProps) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  // Leaders can manage anyone except other Leaders
  // Apprentices can only remove Members
  if (member.role === 'Leader') return null;
  if (currentUserRole !== 'Leader' && currentUserRole !== 'Apprentice') return null;
  if (currentUserRole === 'Apprentice' && member.role !== 'Member') return null;

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setOpen(!open)}
        className="text-slate-300 hover:text-slate-600 p-1"
      >
        <MoreVertical size={16} />
      </button>

      {open && (
        <div className="absolute right-0 top-8 z-20 bg-white rounded-xl shadow-lg border border-slate-100 py-1 w-48">
          {currentUserRole === 'Leader' && member.role === 'Member' && (
            <button
              onClick={() => { onUpdateRole(member.id, 'Apprentice'); setOpen(false); }}
              className="w-full px-4 py-2.5 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
            >
              <Shield size={14} className="text-indigo-500" />
              Promote to Apprentice
            </button>
          )}

          {currentUserRole === 'Leader' && member.role === 'Apprentice' && (
            <>
              <button
                onClick={() => { onUpdateRole(member.id, 'Leader'); setOpen(false); }}
                className="w-full px-4 py-2.5 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
              >
                <Shield size={14} className="text-amber-500" />
                Promote to Leader
              </button>
              <button
                onClick={() => { onUpdateRole(member.id, 'Member'); setOpen(false); }}
                className="w-full px-4 py-2.5 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
              >
                <ShieldOff size={14} className="text-slate-400" />
                Demote to Member
              </button>
            </>
          )}

          <button
            onClick={() => { onRemoveMember(member.id); setOpen(false); }}
            className="w-full px-4 py-2.5 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
          >
            <UserMinus size={14} />
            Remove from Group
          </button>
        </div>
      )}
    </div>
  );
}
