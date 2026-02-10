'use client'

import { useState, useEffect, useCallback } from 'react'
import type { Group } from '@/types'
import { mapApiGroup } from '@/lib/mappers'

export function useGroups() {
  const [myGroups, setMyGroups] = useState<Group[]>([])
  const [discoverGroups, setDiscoverGroups] = useState<Group[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchMyGroups = useCallback(async () => {
    const res = await fetch('/api/groups?filter=my')
    if (res.ok) {
      const data = await res.json()
      setMyGroups(data.groups.map(mapApiGroup))
    }
  }, [])

  const fetchDiscoverGroups = useCallback(async (search?: string) => {
    const params = new URLSearchParams({ filter: 'discover' })
    if (search) params.set('search', search)
    const res = await fetch(`/api/groups?${params}`)
    if (res.ok) {
      const data = await res.json()
      setDiscoverGroups(data.groups.map(mapApiGroup))
    }
  }, [])

  const fetchGroupDetail = useCallback(async (groupId: string): Promise<Group | null> => {
    const res = await fetch(`/api/groups/${groupId}`)
    if (!res.ok) return null
    const data = await res.json()
    return mapApiGroup(data.group)
  }, [])

  const createGroup = useCallback(async (input: Record<string, unknown>): Promise<Group | null> => {
    const res = await fetch('/api/groups', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    })
    if (!res.ok) return null
    const data = await res.json()
    const group = mapApiGroup(data.group)
    setMyGroups((prev) => [group, ...prev])
    return group
  }, [])

  const joinGroup = useCallback(async (group: Group): Promise<{ joined?: boolean; requested?: boolean }> => {
    const res = await fetch(`/api/groups/${group.id}/join`, { method: 'POST' })
    if (!res.ok) {
      const err = await res.json()
      throw new Error(err.error)
    }
    const data = await res.json()
    if (data.joined) {
      await fetchMyGroups()
      setDiscoverGroups((prev) => prev.filter((g) => g.id !== group.id))
    }
    return data
  }, [fetchMyGroups])

  const leaveGroup = useCallback(async (groupId: string) => {
    const res = await fetch(`/api/groups/${groupId}/leave`, { method: 'DELETE' })
    if (!res.ok) {
      const err = await res.json()
      throw new Error(err.error)
    }
    setMyGroups((prev) => prev.filter((g) => g.id !== groupId))
  }, [])

  useEffect(() => {
    let cancelled = false
    async function load() {
      const [myRes, discoverRes] = await Promise.all([
        fetch('/api/groups?filter=my'),
        fetch('/api/groups?filter=discover'),
      ])
      if (cancelled) return
      if (myRes.ok) {
        const data = await myRes.json()
        setMyGroups(data.groups.map(mapApiGroup))
      }
      if (discoverRes.ok) {
        const data = await discoverRes.json()
        setDiscoverGroups(data.groups.map(mapApiGroup))
      }
      setIsLoading(false)
    }
    load()
    return () => { cancelled = true }
  }, [])

  return {
    myGroups,
    discoverGroups,
    isLoading,
    fetchMyGroups,
    fetchDiscoverGroups,
    fetchGroupDetail,
    createGroup,
    joinGroup,
    leaveGroup,
  }
}
