import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getAuthenticatedUser, unauthorized, forbidden, notFound, badRequest } from '@/lib/api-auth'
import { handleJoinRequestSchema } from '@/lib/validations/group'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; requestId: string }> }
) {
  const user = await getAuthenticatedUser()
  if (!user) return unauthorized()

  const { id, requestId } = await params

  // Check if user is Leader or Apprentice
  const membership = await prisma.groupMember.findUnique({
    where: { userId_groupId: { userId: user.id, groupId: id } },
  })

  if (!membership || (membership.role !== 'LEADER' && membership.role !== 'APPRENTICE')) {
    return forbidden()
  }

  const body = await request.json()
  const result = handleJoinRequestSchema.safeParse(body)
  if (!result.success) {
    return badRequest(result.error.issues[0].message)
  }

  const joinRequest = await prisma.joinRequest.findUnique({
    where: { id: requestId },
  })

  if (!joinRequest || joinRequest.groupId !== id) {
    return notFound('Join request not found')
  }

  if (joinRequest.status !== 'PENDING') {
    return badRequest('This request has already been handled')
  }

  const { action } = result.data

  if (action === 'APPROVED') {
    // Check max members
    const memberCount = await prisma.groupMember.count({ where: { groupId: id } })
    const group = await prisma.group.findUnique({ where: { id } })
    if (group && memberCount >= group.maxMembers) {
      return badRequest('Group is full')
    }

    await prisma.$transaction([
      prisma.joinRequest.update({
        where: { id: requestId },
        data: { status: 'APPROVED' },
      }),
      prisma.groupMember.create({
        data: { userId: joinRequest.userId, groupId: id },
      }),
    ])

    return NextResponse.json({ approved: true })
  }

  // REJECTED
  await prisma.joinRequest.update({
    where: { id: requestId },
    data: { status: 'REJECTED' },
  })

  return NextResponse.json({ rejected: true })
}
