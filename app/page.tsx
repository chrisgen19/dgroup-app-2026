'use client';

import { useState, useCallback } from 'react';
import type { ViewType, TabType, Group, User, UserRole, JoinRequest } from '@/types';
import { useAuth } from '@/lib/hooks/use-auth';
import { useGroups } from '@/lib/hooks/use-groups';
import { useGroupManagement } from '@/lib/hooks/use-group-management';
import { useJoinRequests } from '@/lib/hooks/use-join-requests';
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
  const { user, isLoading: authLoading, setUser, signOut } = useAuth();
  const {
    myGroups,
    discoverGroups,
    fetchMyGroups,
    fetchDiscoverGroups,
    fetchGroupDetail,
    joinGroup,
    leaveGroup,
  } = useGroups();
  const {
    requests: dashboardRequests,
    approveRequest: dashboardApprove,
    rejectRequest: dashboardReject,
    fetchRequests: fetchDashboardRequests,
  } = useJoinRequests();

  const [view, setView] = useState<ViewType>('home');
  const [activeTab, setActiveTab] = useState<TabType>('feed');
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [showMeetingMode, setShowMeetingMode] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [groupJoinRequests, setGroupJoinRequests] = useState<JoinRequest[]>([]);

  // Management hook for the currently selected group
  const management = useGroupManagement(selectedGroup?.id ?? '');

  const showToast = useCallback((message: string) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  }, []);

  const handleSelectGroup = useCallback(async (group: Group) => {
    // Fetch fresh detail from API
    const detail = await fetchGroupDetail(group.id);
    if (detail) {
      setSelectedGroup(detail);
    } else {
      setSelectedGroup(group);
    }
    setActiveTab('feed');
    setView('group-detail');
  }, [fetchGroupDetail]);

  const handleJoinGroup = useCallback(async (group: Group) => {
    return await joinGroup(group);
  }, [joinGroup]);

  const handleSignIn = useCallback(
    (signedInUser: User) => {
      setUser(signedInUser);
    },
    [setUser]
  );

  const handleLogout = useCallback(async () => {
    await signOut();
  }, [signOut]);

  const handleCreated = useCallback(() => {
    fetchMyGroups();
    setView('home');
  }, [fetchMyGroups]);

  const handleLeaveGroup = useCallback(async () => {
    if (!selectedGroup) return;
    try {
      await leaveGroup(selectedGroup.id);
      showToast('You left the group');
      setSelectedGroup(null);
      setView('home');
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Failed to leave group');
    }
  }, [selectedGroup, leaveGroup, showToast]);

  const handleRemoveMember = useCallback(async (memberId: string) => {
    try {
      await management.removeMember(memberId);
      // Refresh group detail
      if (selectedGroup) {
        const updated = await fetchGroupDetail(selectedGroup.id);
        if (updated) setSelectedGroup(updated);
      }
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Failed to remove member');
    }
  }, [management, selectedGroup, fetchGroupDetail, showToast]);

  const handleUpdateRole = useCallback(async (memberId: string, role: UserRole) => {
    try {
      await management.updateRole(memberId, role);
      if (selectedGroup) {
        const updated = await fetchGroupDetail(selectedGroup.id);
        if (updated) setSelectedGroup(updated);
      }
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Failed to update role');
    }
  }, [management, selectedGroup, fetchGroupDetail, showToast]);

  const handleUpdateSettings = useCallback(async (data: Record<string, unknown>) => {
    const updated = await management.updateSettings(data);
    if (updated) {
      setSelectedGroup(updated);
      fetchMyGroups();
    }
  }, [management, fetchMyGroups]);

  // Load join requests when entering group detail (for leaders)
  const handleTabChange = useCallback(async (tab: TabType) => {
    setActiveTab(tab);
    if (tab === 'members' && selectedGroup) {
      try {
        const requests = await management.fetchJoinRequests();
        setGroupJoinRequests(requests);
      } catch {
        // Not a leader, no access
        setGroupJoinRequests([]);
      }
    }
  }, [selectedGroup, management]);

  const handleApproveGroupRequest = useCallback(async (requestId: string) => {
    try {
      await management.approveRequest(requestId);
      setGroupJoinRequests((prev) => prev.filter((r) => r.id !== requestId));
      showToast('Request approved');
      if (selectedGroup) {
        const updated = await fetchGroupDetail(selectedGroup.id);
        if (updated) setSelectedGroup(updated);
      }
      fetchDashboardRequests();
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Failed to approve');
    }
  }, [management, showToast, selectedGroup, fetchGroupDetail, fetchDashboardRequests]);

  const handleRejectGroupRequest = useCallback(async (requestId: string) => {
    try {
      await management.rejectRequest(requestId);
      setGroupJoinRequests((prev) => prev.filter((r) => r.id !== requestId));
      showToast('Request rejected');
      fetchDashboardRequests();
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Failed to reject');
    }
  }, [management, showToast, fetchDashboardRequests]);

  const handleDashboardApprove = useCallback(async (requestId: string, groupId: string) => {
    await dashboardApprove(requestId, groupId);
    showToast('Request approved');
    fetchMyGroups();
  }, [dashboardApprove, showToast, fetchMyGroups]);

  const handleDashboardReject = useCallback(async (requestId: string, groupId: string) => {
    await dashboardReject(requestId, groupId);
    showToast('Request rejected');
  }, [dashboardReject, showToast]);

  const handleNavigate = useCallback((newView: ViewType) => {
    setView(newView);
    if (newView === 'discover') {
      fetchDiscoverGroups();
    }
  }, [fetchDiscoverGroups]);

  // Loading spinner while checking auth
  if (authLoading) {
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
          onNavigate={handleNavigate}
          onLogout={handleLogout}
        />

        <main className="flex-1 overflow-y-auto relative bg-slate-50">
          <div className="max-w-4xl">
          {view === 'home' && (
            <HomeView
              currentUser={user}
              myGroups={myGroups}
              pendingRequests={dashboardRequests}
              onSelectGroup={handleSelectGroup}
              onNavigate={handleNavigate}
              onApproveRequest={handleDashboardApprove}
              onRejectRequest={handleDashboardReject}
            />
          )}
          {view === 'discover' && (
            <DiscoverView
              availableGroups={discoverGroups}
              currentUser={user}
              onJoinGroup={handleJoinGroup}
              showToast={showToast}
            />
          )}
          {view === 'create' && (
            <CreateGroupView
              onCreated={handleCreated}
              showToast={showToast}
            />
          )}
          {view === 'group-detail' && selectedGroup && (
            <GroupDetailView
              group={selectedGroup}
              currentUserId={user.id}
              activeTab={activeTab}
              onTabChange={handleTabChange}
              onBack={() => { setView('home'); fetchMyGroups(); }}
              onStartMeeting={() => setShowMeetingMode(true)}
              showToast={showToast}
              onRemoveMember={handleRemoveMember}
              onUpdateRole={handleUpdateRole}
              onLeaveGroup={handleLeaveGroup}
              onUpdateSettings={handleUpdateSettings}
              pendingRequests={groupJoinRequests}
              onApproveRequest={handleApproveGroupRequest}
              onRejectRequest={handleRejectGroupRequest}
            />
          )}
          </div>
        </main>
      </div>
    </div>
  );
}
