import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getAuthenticatedUser, unauthorized, notFound, badRequest } from '@/lib/api-auth'

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getAuthenticatedUser()
  if (!user) return unauthorized()

  const { id } = await params

  const membership = await prisma.groupMember.findUnique({
    where: { userId_groupId: { userId: user.id, groupId: id } },
  })

  if (!membership) return notFound('You are not a member of this group')

  // If user is a Leader, check if they're the only one
  if (membership.role === 'LEADER') {
    const leaderCount = await prisma.groupMember.count({
      where: { groupId: id, role: 'LEADER' },
    })

    if (leaderCount <= 1) {
      return badRequest('You are the only Leader. Promote someone before leaving.')
    }
  }

  await prisma.groupMember.delete({
    where: { id: membership.id },
  })

  return NextResponse.json({ left: true })
}
