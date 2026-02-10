'use client'

import { useState, useEffect, useCallback } from 'react'
import type { JoinRequest } from '@/types'

export function useJoinRequests() {
  const [requests, setRequests] = useState<JoinRequest[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchRequests = useCallback(async () => {
    const res = await fetch('/api/groups/my-requests')
    if (res.ok) {
      const data = await res.json()
      setRequests(
        data.requests.map((r: Record<string, unknown>) => ({
          id: r.id,
          status: r.status,
          message: r.message,
          userId: (r.user as Record<string, unknown>)?.id,
          userName: `${(r.user as Record<string, unknown>)?.firstName} ${(r.user as Record<string, unknown>)?.lastName}`,
          userAvatar: (r.user as Record<string, unknown>)?.avatar ?? null,
          userSatellite: (r.user as Record<string, unknown>)?.satellite ?? null,
          groupId: (r.group as Record<string, unknown>)?.id,
          groupName: (r.group as Record<string, unknown>)?.name,
          createdAt: r.createdAt,
        }))
      )
    }
    setIsLoading(false)
  }, [])

  const approveRequest = useCallback(async (requestId: string, groupId: string) => {
    const res = await fetch(`/api/groups/${groupId}/join-requests/${requestId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'APPROVED' }),
    })
    if (res.ok) {
      setRequests((prev) => prev.filter((r) => r.id !== requestId))
    }
  }, [])

  const rejectRequest = useCallback(async (requestId: string, groupId: string) => {
    const res = await fetch(`/api/groups/${groupId}/join-requests/${requestId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'REJECTED' }),
    })
    if (res.ok) {
      setRequests((prev) => prev.filter((r) => r.id !== requestId))
    }
  }, [])

  useEffect(() => {
    let cancelled = false
    async function load() {
      const res = await fetch('/api/groups/my-requests')
      if (cancelled) return
      if (res.ok) {
        const data = await res.json()
        setRequests(
          data.requests.map((r: Record<string, unknown>) => ({
            id: r.id,
            status: r.status,
            message: r.message,
            userId: (r.user as Record<string, unknown>)?.id,
            userName: `${(r.user as Record<string, unknown>)?.firstName} ${(r.user as Record<string, unknown>)?.lastName}`,
            userAvatar: (r.user as Record<string, unknown>)?.avatar ?? null,
            userSatellite: (r.user as Record<string, unknown>)?.satellite ?? null,
            groupId: (r.group as Record<string, unknown>)?.id,
            groupName: (r.group as Record<string, unknown>)?.name,
            createdAt: r.createdAt,
          }))
        )
      }
      setIsLoading(false)
    }
    load()
    return () => { cancelled = true }
  }, [])

  return { requests, isLoading, fetchRequests, approveRequest, rejectRequest }
}
