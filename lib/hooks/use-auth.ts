'use client'

import { useState, useEffect, useCallback } from 'react'
import type { User } from '@/types'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.user) {
          setUser(mapApiUser(data.user))
        }
      })
      .catch(() => {})
      .finally(() => setIsLoading(false))
  }, [])

  const signOut = useCallback(async () => {
    await fetch('/api/auth/signout', { method: 'POST' })
    setUser(null)
  }, [])

  return { user, isLoading, setUser, signOut }
}

// Map API response to the frontend User type
function mapApiUser(apiUser: Record<string, unknown>): User {
  return {
    id: apiUser.id as string,
    name: `${apiUser.firstName} ${apiUser.lastName}`,
    avatar: (apiUser.avatar as string | null) ?? getInitials(apiUser.firstName as string, apiUser.lastName as string),
    email: apiUser.email as string,
    lifeStage: mapLifeStage(apiUser.lifeStage as string),
    satellite: (apiUser.satellite as string) ?? '',
  }
}

function getInitials(firstName: string, lastName: string): string {
  return `${firstName[0]}${lastName[0]}`.toUpperCase()
}

function mapLifeStage(stage: string): User['lifeStage'] {
  const map: Record<string, User['lifeStage']> = {
    SINGLE: 'Single',
    SINGLE_PROFESSIONAL: 'Single Professional',
    MARRIED: 'Married',
    PARENT: 'Parent',
  }
  return map[stage] ?? 'Single'
}
