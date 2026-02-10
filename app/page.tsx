'use client';

import { useState, useCallback } from 'react';
import type { ViewType, TabType, Group, User } from '@/types';
import { MOCK_GROUPS } from '@/lib/mock-data';
import { useAuth } from '@/lib/hooks/use-auth';
import { Toast } from '@/components/ui/toast';
import { MeetingAssistant } from '@/components/features/meeting-assistant';
import { NavBar } from '@/components/layout/nav-bar';
import { AuthView } from '@/components/views/auth-view';
import { HomeView } from '@/components/views/home-view';
import { DiscoverView } from '@/components/views/discover-view';
import { CreateGroupView } from '@/components/views/create-group-view';
import { GroupDetailView } from '@/components/views/group-detail-view';
import { Loader2 } from 'lucide-react';

export default function DgroupApp() {
  const { user, isLoading, setUser, signOut } = useAuth();
  const [view, setView] = useState<ViewType>('home');
  const [activeTab, setActiveTab] = useState<TabType>('feed');
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [myGroups, setMyGroups] = useState<Group[]>([MOCK_GROUPS[0]]);
  const [showMeetingMode, setShowMeetingMode] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = useCallback((message: string) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  }, []);

  const handleSelectGroup = useCallback((group: Group) => {
    setSelectedGroup(group);
    setActiveTab('feed');
    setView('group-detail');
  }, []);

  const handleJoinGroup = useCallback((group: Group) => {
    setMyGroups((prev) => [...prev, group]);
  }, []);

  const handleSignIn = useCallback(
    (signedInUser: User) => {
      setUser(signedInUser);
    },
    [setUser]
  );

  const handleLogout = useCallback(async () => {
    await signOut();
  }, [signOut]);

  const availableGroups = MOCK_GROUPS.filter(
    (g) => !myGroups.find((mg) => mg.id === g.id)
  );

  // Loading spinner while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 size={32} className="animate-spin text-indigo-600" />
      </div>
    );
  }

  // Auth view renders without nav
  if (!user) {
    return <AuthView onSignIn={handleSignIn} />;
  }

  return (
    <div className="flex h-screen w-full bg-slate-50 font-sans text-slate-900 overflow-hidden">
      {/* Toast Notification */}
      {toast && <Toast message={toast} />}

      {/* Meeting Mode Overlay */}
      {showMeetingMode && selectedGroup && (
        <MeetingAssistant
          groupName={selectedGroup.name}
          onClose={() => setShowMeetingMode(false)}
        />
      )}

      {/* Main Layout */}
      <div className="flex w-full h-full bg-white overflow-hidden">
        <NavBar
          view={view}
          currentUser={user}
          onNavigate={setView}
          onLogout={handleLogout}
        />

        <main className="flex-1 overflow-y-auto relative bg-slate-50">
          <div className="max-w-4xl">
          {view === 'home' && (
            <HomeView
              currentUser={user}
              myGroups={myGroups}
              onSelectGroup={handleSelectGroup}
              onNavigate={setView}
            />
          )}
          {view === 'discover' && (
            <DiscoverView
              availableGroups={availableGroups}
              onJoinGroup={handleJoinGroup}
              showToast={showToast}
            />
          )}
          {view === 'create' && (
            <CreateGroupView
              onCreated={() => setView('home')}
              showToast={showToast}
            />
          )}
          {view === 'group-detail' && selectedGroup && (
            <GroupDetailView
              group={selectedGroup}
              activeTab={activeTab}
              onTabChange={setActiveTab}
              onBack={() => setView('home')}
              onStartMeeting={() => setShowMeetingMode(true)}
              showToast={showToast}
            />
          )}
          </div>
        </main>
      </div>
    </div>
  );
}
