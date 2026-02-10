'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Group, JoinMode, GroupStatus } from '@/types';

interface GroupSettingsPanelProps {
  group: Group;
  onClose: () => void;
  onSave: (data: Record<string, unknown>) => Promise<void>;
  showToast: (message: string) => void;
}

export function GroupSettingsPanel({ group, onClose, onSave, showToast }: GroupSettingsPanelProps) {
  const [name, setName] = useState(group.name);
  const [description, setDescription] = useState(group.description);
  const [schedule, setSchedule] = useState(group.schedule);
  const [location, setLocation] = useState(group.location);
  const [type, setType] = useState(group.type);
  const [joinMode, setJoinMode] = useState<JoinMode>(group.joinMode);
  const [status, setStatus] = useState<GroupStatus>(group.status);
  const [maxMembers, setMaxMembers] = useState(group.maxMembers);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave({ name, description, schedule, location, type, joinMode, status, maxMembers });
      showToast('Settings updated');
      onClose();
    } catch {
      showToast('Failed to update settings');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
        >
          <X size={20} />
        </button>

        <h3 className="text-lg font-bold text-slate-900 mb-6">Group Settings</h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Group Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Schedule</label>
              <input
                type="text"
                value={schedule}
                onChange={(e) => setSchedule(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Location</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Group Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
              >
                <option value="B1G (Singles)">B1G (Singles)</option>
                <option value="Couples">Couples</option>
                <option value="Youth">Youth</option>
                <option value="Men">Men</option>
                <option value="Women">Women</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Max Members</label>
              <input
                type="number"
                min={2}
                max={50}
                value={maxMembers}
                onChange={(e) => setMaxMembers(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Visibility</label>
            <div className="flex gap-3">
              {(['PUBLIC', 'PRIVATE'] as const).map((v) => (
                <button
                  key={v}
                  onClick={() => setStatus(v)}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    status === v
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {v === 'PUBLIC' ? 'Public' : 'Private'}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Join Mode</label>
            <div className="flex gap-3">
              {(['AUTO_ACCEPT', 'REQUEST_TO_JOIN'] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => setJoinMode(m)}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    joinMode === m
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {m === 'AUTO_ACCEPT' ? 'Auto Accept' : 'Request to Join'}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-slate-100">
          <Button className="w-full" onClick={handleSave} disabled={saving}>
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>
    </div>
  );
}
