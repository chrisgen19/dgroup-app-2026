import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getAuthenticatedUser, unauthorized, forbidden } from '@/lib/api-auth'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getAuthenticatedUser()
  if (!user) return unauthorized()

  const { id } = await params

  // Check if user is Leader or Apprentice
  const membership = await prisma.groupMember.findUnique({
    where: { userId_groupId: { userId: user.id, groupId: id } },
  })

  if (!membership || (membership.role !== 'LEADER' && membership.role !== 'APPRENTICE')) {
    return forbidden()
  }

  const requests = await prisma.joinRequest.findMany({
    where: { groupId: id, status: 'PENDING' },
    include: {
      user: { select: { id: true, firstName: true, lastName: true, avatar: true, satellite: true } },
    },
    orderBy: { createdAt: 'asc' },
  })

  return NextResponse.json({ requests })
}
