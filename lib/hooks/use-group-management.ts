'use client'

import { useCallback } from 'react'
import type { Group, JoinRequest, UserRole } from '@/types'
import { mapApiGroup } from '@/lib/mappers'

export function useGroupManagement(groupId: string) {
  const removeMember = useCallback(async (memberId: string) => {
    const res = await fetch(`/api/groups/${groupId}/members/${memberId}`, {
      method: 'DELETE',
    })
    if (!res.ok) {
      const err = await res.json()
      throw new Error(err.error)
    }
  }, [groupId])

  const updateRole = useCallback(async (memberId: string, role: UserRole) => {
    const roleMap: Record<string, string> = {
      Leader: 'LEADER',
      Apprentice: 'APPRENTICE',
      Member: 'MEMBER',
    }
    const res = await fetch(`/api/groups/${groupId}/members/${memberId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role: roleMap[role] }),
    })
    if (!res.ok) {
      const err = await res.json()
      throw new Error(err.error)
    }
  }, [groupId])

  const updateSettings = useCallback(async (data: Record<string, unknown>): Promise<Group | null> => {
    const res = await fetch(`/api/groups/${groupId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!res.ok) {
      const err = await res.json()
      throw new Error(err.error)
    }
    const result = await res.json()
    return mapApiGroup(result.group)
  }, [groupId])

  const fetchJoinRequests = useCallback(async (): Promise<JoinRequest[]> => {
    const res = await fetch(`/api/groups/${groupId}/join-requests`)
    if (!res.ok) return []
    const data = await res.json()
    return data.requests.map((r: Record<string, unknown>) => ({
      id: r.id,
      status: r.status,
      message: r.message,
      userId: r.userId ?? (r.user as Record<string, unknown>)?.id,
      userName: `${(r.user as Record<string, unknown>)?.firstName} ${(r.user as Record<string, unknown>)?.lastName}`,
      userAvatar: (r.user as Record<string, unknown>)?.avatar ?? null,
      userSatellite: (r.user as Record<string, unknown>)?.satellite ?? null,
      groupId: r.groupId ?? groupId,
      groupName: '',
      createdAt: r.createdAt,
    }))
  }, [groupId])

  const approveRequest = useCallback(async (requestId: string) => {
    const res = await fetch(`/api/groups/${groupId}/join-requests/${requestId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'APPROVED' }),
    })
    if (!res.ok) {
      const err = await res.json()
      throw new Error(err.error)
    }
  }, [groupId])

  const rejectRequest = useCallback(async (requestId: string) => {
    const res = await fetch(`/api/groups/${groupId}/join-requests/${requestId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'REJECTED' }),
    })
    if (!res.ok) {
      const err = await res.json()
      throw new Error(err.error)
    }
  }, [groupId])

  return {
    removeMember,
    updateRole,
    updateSettings,
    fetchJoinRequests,
    approveRequest,
    rejectRequest,
  }
}
