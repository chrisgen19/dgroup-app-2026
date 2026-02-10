'use client';

import { useRef, useEffect } from 'react';
import {
  ArrowLeft,
  Share2,
  Settings,
  CheckCircle2,
  Heart,
  MessageCircle,
  Hand,
  Plus,
  Send,
  MoreVertical,
  Users,
} from 'lucide-react';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Chip } from '@/components/ui/chip';
import type { GroupDetailViewProps, TabType } from '@/types';

interface TabItem {
  id: TabType;
  label: string;
}

const TABS: TabItem[] = [
  { id: 'feed', label: 'Feed' },
  { id: 'chat', label: 'Chat' },
  { id: 'prayer', label: 'Prayer Wall' },
  { id: 'members', label: 'People' },
];

const CURRENT_USER_ID = 'u1';

export function GroupDetailView({
  group,
  activeTab,
  onTabChange,
  onBack,
  onStartMeeting,
  showToast,
}: GroupDetailViewProps) {
  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (activeTab === 'chat' && chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [activeTab]);

  return (
    <div className="h-screen flex flex-col bg-slate-50 relative">
      {/* Sticky Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-30 shadow-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 -ml-2 hover:bg-slate-100 rounded-full transition-colors"
          >
            <ArrowLeft size={20} className="text-slate-600" />
          </button>
          <div>
            <h2 className="font-bold text-slate-900 leading-tight">
              {group.name}
            </h2>
            <p className="text-xs text-slate-500">
              {group.members.length} Members &bull; {group.location}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => {
              showToast('Invite link copied!');
            }}
            className="p-2 bg-indigo-50 text-indigo-600 rounded-full hover:bg-indigo-100 transition-colors"
          >
            <Share2 size={20} />
          </button>
          <button className="p-2 text-slate-400 hover:bg-slate-50 rounded-full">
            <Settings size={20} />
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white px-6 flex border-b border-slate-200 overflow-x-auto no-scrollbar">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
              activeTab === tab.id
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto pb-24">
        {/* FEED TAB */}
        {activeTab === 'feed' && (
          <div className="p-6 space-y-6">
            {/* Leader Action Card */}
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg shadow-indigo-200 relative overflow-hidden">
              <div className="relative z-10">
                <h3 className="font-bold text-lg mb-1">Weekly Meeting</h3>
                <p className="text-indigo-100 mb-4 text-sm">
                  Next session starts in 2 days. Get ready!
                </p>
                <Button
                  variant="secondary"
                  className="w-full bg-white text-indigo-600 hover:bg-indigo-50 border-0"
                  icon={CheckCircle2}
                  onClick={onStartMeeting}
                >
                  Start Meeting Mode
                </Button>
              </div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full transform translate-x-10 -translate-y-10" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full transform -translate-x-10 translate-y-10" />
            </div>

            {group.posts.map((post) => (
              <Card key={post.id} className="p-5">
                <div className="flex items-center gap-3 mb-3">
                  <Avatar name={post.author} size="sm" />
                  <div className="flex-1">
                    <p className="text-sm font-bold text-slate-900">
                      {post.author}
                    </p>
                    <p className="text-xs text-slate-500">{post.date}</p>
                  </div>
                  <Chip
                    label={post.type}
                    color={post.type === 'announcement' ? 'orange' : 'green'}
                  />
                </div>
                <h4 className="font-bold text-slate-800 mb-1">{post.title}</h4>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {post.content}
                </p>
                <div className="mt-4 pt-3 border-t border-slate-100 flex gap-4">
                  <button className="text-slate-400 hover:text-indigo-600 text-sm font-medium flex items-center gap-1">
                    <Heart size={16} /> Like
                  </button>
                  <button className="text-slate-400 hover:text-indigo-600 text-sm font-medium flex items-center gap-1">
                    <MessageCircle size={16} /> Comment
                  </button>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* CHAT TAB */}
        {activeTab === 'chat' && (
          <div className="flex flex-col h-full">
            <div className="flex-1 p-4 space-y-4" ref={chatRef}>
              <div className="text-center text-xs text-slate-400 my-4">
                Today
              </div>
              {group.chat.map((msg) => {
                const isMe = msg.userId === CURRENT_USER_ID;
                return (
                  <div
                    key={msg.id}
                    className={`flex gap-2 ${isMe ? 'flex-row-reverse' : ''}`}
                  >
                    {!isMe && (
                      <Avatar name={msg.name} size="sm" className="mt-1" />
                    )}
                    <div
                      className={`max-w-[75%] rounded-2xl px-4 py-2 text-sm ${
                        isMe
                          ? 'bg-indigo-600 text-white rounded-tr-none'
                          : 'bg-white border border-slate-100 text-slate-700 rounded-tl-none shadow-sm'
                      }`}
                    >
                      <p>{msg.message}</p>
                      <p
                        className={`text-[10px] mt-1 text-right ${isMe ? 'text-indigo-200' : 'text-slate-400'}`}
                      >
                        {msg.time}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="p-3 bg-white border-t border-slate-100 flex gap-2 items-center sticky bottom-0">
              <button className="p-2 text-slate-400 hover:bg-slate-50 rounded-full">
                <Plus size={20} />
              </button>
              <input
                type="text"
                placeholder="Type a message..."
                className="flex-1 bg-slate-50 border-0 rounded-full px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
              <button className="p-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-all">
                <Send size={18} />
              </button>
            </div>
          </div>
        )}

        {/* PRAYER WALL TAB */}
        {activeTab === 'prayer' && (
          <div className="p-6 space-y-4">
            <Button className="w-full mb-4" variant="outline" icon={Plus}>
              Add Prayer Request
            </Button>

            {group.prayers.map((prayer) => (
              <Card key={prayer.id} className="p-5 relative overflow-hidden">
                {prayer.answered && (
                  <div className="absolute top-0 right-0 bg-emerald-500 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl">
                    ANSWERED
                  </div>
                )}
                <div className="flex items-start gap-3 mb-2">
                  <Avatar name={prayer.userName} size="sm" />
                  <div>
                    <p className="text-sm font-bold">{prayer.userName}</p>
                    <p className="text-xs text-slate-400">{prayer.date}</p>
                  </div>
                </div>
                <p className="text-slate-700 text-sm mb-4 bg-slate-50 p-3 rounded-lg italic border-l-2 border-indigo-200">
                  &ldquo;{prayer.content}&rdquo;
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex -space-x-2">
                    {[...Array(3)].map((_, i) => (
                      <div
                        key={i}
                        className="w-6 h-6 rounded-full bg-slate-200 border-2 border-white"
                      />
                    ))}
                    <div className="w-6 h-6 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-[8px] text-slate-500">
                      +{prayer.count}
                    </div>
                  </div>
                  <button
                    onClick={() => showToast('You prayed for this request')}
                    className="px-3 py-1.5 rounded-full bg-indigo-50 text-indigo-600 text-xs font-bold hover:bg-indigo-100 transition-colors flex items-center gap-1"
                  >
                    <Hand size={14} /> Pray
                  </button>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* MEMBERS TAB */}
        {activeTab === 'members' && (
          <div className="p-4">
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm divide-y divide-slate-50">
              {group.members.map((member) => (
                <div
                  key={member.id}
                  className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Avatar name={member.name} />
                    <div>
                      <p className="font-bold text-slate-900 text-sm">
                        {member.name}
                      </p>
                      <p className="text-xs text-slate-500">{member.role}</p>
                    </div>
                  </div>
                  {member.role === 'Leader' && (
                    <div className="text-amber-500">
                      <Users size={16} />
                    </div>
                  )}
                  {member.role !== 'Leader' && (
                    <button className="text-slate-300 hover:text-slate-600">
                      <MoreVertical size={16} />
                    </button>
                  )}
                </div>
              ))}
            </div>
            <div className="mt-6 text-center">
              <p className="text-slate-400 text-sm mb-2">
                Invite others to join
              </p>
              <Button variant="outline" className="w-full" icon={Share2}>
                Share Invite Link
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
