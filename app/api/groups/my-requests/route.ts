import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getAuthenticatedUser, unauthorized } from '@/lib/api-auth'

export async function GET() {
  const user = await getAuthenticatedUser()
  if (!user) return unauthorized()

  // Get all groups where the user is a Leader or Apprentice
  const myLeaderships = await prisma.groupMember.findMany({
    where: {
      userId: user.id,
      role: { in: ['LEADER', 'APPRENTICE'] },
    },
    select: { groupId: true },
  })

  const groupIds = myLeaderships.map((m) => m.groupId)

  if (groupIds.length === 0) {
    return NextResponse.json({ requests: [] })
  }

  const requests = await prisma.joinRequest.findMany({
    where: {
      groupId: { in: groupIds },
      status: 'PENDING',
    },
    include: {
      user: { select: { id: true, firstName: true, lastName: true, avatar: true, satellite: true } },
      group: { select: { id: true, name: true } },
    },
    orderBy: { createdAt: 'asc' },
  })

  return NextResponse.json({ requests })
}
