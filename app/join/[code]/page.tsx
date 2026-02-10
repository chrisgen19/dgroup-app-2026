'use client';

import { useState, useEffect, use } from 'react';
import { Users, MapPin, Clock, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar } from '@/components/ui/avatar';
import { Chip } from '@/components/ui/chip';
import { mapApiGroup } from '@/lib/mappers';
import type { Group } from '@/types';

export default function InvitePage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = use(params);
  const [group, setGroup] = useState<Group | null>(null);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [joined, setJoined] = useState(false);

  useEffect(() => {
    fetch(`/api/groups/invite/${code}`)
      .then((res) => {
        if (!res.ok) throw new Error('Invalid invite link');
        return res.json();
      })
      .then((data) => setGroup(mapApiGroup(data.group)))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [code]);

  const handleJoin = async () => {
    setJoining(true);
    setError(null);
    try {
      const res = await fetch(`/api/groups/invite/${code}/join`, { method: 'POST' });
      if (!res.ok) {
        const data = await res.json();
        if (res.status === 401) {
          // Redirect to sign in
          window.location.href = '/';
          return;
        }
        throw new Error(data.error ?? 'Failed to join');
      }
      setJoined(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setJoining(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 size={32} className="animate-spin text-indigo-600" />
      </div>
    );
  }

  if (!group) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 max-w-md w-full text-center">
          <h1 className="text-xl font-bold text-slate-900 mb-2">Invalid Invite</h1>
          <p className="text-slate-500 mb-6">{error ?? 'This invite link is not valid or has expired.'}</p>
          <Button onClick={() => (window.location.href = '/')}>Go Home</Button>
        </div>
      </div>
    );
  }

  if (joined) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users size={32} className="text-emerald-600" />
          </div>
          <h1 className="text-xl font-bold text-slate-900 mb-2">You&apos;re In!</h1>
          <p className="text-slate-500 mb-6">
            You&apos;ve joined <span className="font-medium text-slate-700">{group.name}</span>.
          </p>
          <Button onClick={() => (window.location.href = '/')} className="w-full">
            Go to My Groups
          </Button>
        </div>
      </div>
    );
  }

  const leader = group.members.find((m) => m.role === 'Leader');

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 max-w-md w-full">
        <div className="text-center mb-6">
          <div className="w-20 h-20 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto font-bold text-2xl mb-4">
            {group.name.substring(0, 2)}
          </div>
          <h1 className="text-xl font-bold text-slate-900">{group.name}</h1>
          {leader && (
            <p className="text-sm text-indigo-600 font-medium mt-1">Led by {leader.name}</p>
          )}
        </div>

        <p className="text-slate-600 text-sm text-center mb-6">{group.description}</p>

        <div className="flex flex-wrap justify-center gap-2 mb-6">
          <Chip label={group.type} />
          <Chip label={group.location} color="slate" />
        </div>

        <div className="flex justify-center gap-6 text-sm text-slate-500 mb-6">
          <div className="flex items-center gap-1">
            <Clock size={14} />
            {group.schedule}
          </div>
          <div className="flex items-center gap-1">
            <MapPin size={14} />
            {group.location}
          </div>
        </div>

        {group.members.length > 0 && (
          <div className="flex justify-center mb-6">
            <div className="flex -space-x-2">
              {group.members.slice(0, 5).map((m) => (
                <Avatar key={m.id} name={m.name} size="sm" className="border-2 border-white" />
              ))}
              {group.members.length > 5 && (
                <div className="w-8 h-8 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-xs text-slate-500">
                  +{group.members.length - 5}
                </div>
              )}
            </div>
            <span className="ml-3 text-sm text-slate-500 self-center">
              {group.members.length} member{group.members.length !== 1 ? 's' : ''}
            </span>
          </div>
        )}

        {error && (
          <p className="text-red-500 text-sm text-center mb-4">{error}</p>
        )}

        <Button className="w-full" onClick={handleJoin} disabled={joining}>
          {joining ? 'Joining...' : 'Join Group'}
        </Button>

        <p className="text-center text-xs text-slate-400 mt-4">
          You&apos;ll be added to the group immediately.
        </p>
      </div>
    </div>
  );
}
