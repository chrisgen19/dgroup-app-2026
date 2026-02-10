import type { Group, GroupMember } from '@/types'

interface ApiUser {
  id: string
  firstName: string
  lastName: string
  avatar: string | null
}

interface ApiGroupMember {
  id: string
  role: string
  user: ApiUser
}

interface ApiGroup {
  id: string
  name: string
  description: string
  schedule: string
  location: string
  type: string
  status: string
  joinMode: string
  inviteCode: string
  satellite: string | null
  maxMembers: number
  members?: ApiGroupMember[]
}

export function mapApiGroup(g: ApiGroup): Group {
  const members = (g.members ?? []).map(mapApiGroupMember)
  const leader = members.find((m) => m.role === 'Leader')

  return {
    id: g.id,
    name: g.name,
    description: g.description,
    leaderId: leader?.userId ?? '',
    leaderName: leader?.name ?? 'Unknown',
    schedule: g.schedule,
    location: g.location,
    type: g.type,
    status: g.status as Group['status'],
    joinMode: g.joinMode as Group['joinMode'],
    inviteCode: g.inviteCode,
    maxMembers: g.maxMembers,
    members,
    prayers: [],
    posts: [],
    chat: [],
  }
}

export function mapApiGroupMember(m: ApiGroupMember): GroupMember {
  const name = `${m.user.firstName} ${m.user.lastName}`
  return {
    id: m.id,
    userId: m.user.id,
    name,
    role: mapRole(m.role),
    avatar: m.user.avatar ?? getInitials(m.user.firstName, m.user.lastName),
  }
}

function mapRole(role: string): GroupMember['role'] {
  const map: Record<string, GroupMember['role']> = {
    LEADER: 'Leader',
    APPRENTICE: 'Apprentice',
    MEMBER: 'Member',
  }
  return map[role] ?? 'Member'
}

function getInitials(firstName: string, lastName: string): string {
  return `${firstName[0]}${lastName[0]}`.toUpperCase()
}
