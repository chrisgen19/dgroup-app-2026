'use client';

import { Check, X } from 'lucide-react';
import { Avatar } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import type { JoinRequest } from '@/types';

interface JoinRequestCardProps {
  request: JoinRequest;
  onApprove: (requestId: string, groupId: string) => void;
  onReject: (requestId: string, groupId: string) => void;
  showGroupName?: boolean;
}

export function JoinRequestCard({
  request,
  onApprove,
  onReject,
  showGroupName = false,
}: JoinRequestCardProps) {
  return (
    <Card className="p-4">
      <div className="flex items-center gap-3">
        <Avatar name={request.userName} size="sm" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-slate-900 truncate">{request.userName}</p>
          {showGroupName && (
            <p className="text-xs text-indigo-600 font-medium">{request.groupName}</p>
          )}
          {request.userSatellite && (
            <p className="text-xs text-slate-400">{request.userSatellite}</p>
          )}
        </div>
        <div className="flex gap-2 shrink-0">
          <button
            onClick={() => onApprove(request.id, request.groupId)}
            className="p-2 bg-emerald-50 text-emerald-600 rounded-full hover:bg-emerald-100 transition-colors"
          >
            <Check size={16} />
          </button>
          <button
            onClick={() => onReject(request.id, request.groupId)}
            className="p-2 bg-red-50 text-red-500 rounded-full hover:bg-red-100 transition-colors"
          >
            <X size={16} />
          </button>
        </div>
      </div>
    </Card>
  );
}
