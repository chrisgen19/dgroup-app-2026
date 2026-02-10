import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getAuthenticatedUser, unauthorized, forbidden, notFound, badRequest } from '@/lib/api-auth'
import { updateMemberRoleSchema } from '@/lib/validations/group'

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string; memberId: string }> }
) {
  const user = await getAuthenticatedUser()
  if (!user) return unauthorized()

  const { id, memberId } = await params

  // Check if requester is Leader or Apprentice
  const requesterMembership = await prisma.groupMember.findUnique({
    where: { userId_groupId: { userId: user.id, groupId: id } },
  })

  if (!requesterMembership || (requesterMembership.role !== 'LEADER' && requesterMembership.role !== 'APPRENTICE')) {
    return forbidden()
  }

  const targetMember = await prisma.groupMember.findUnique({
    where: { id: memberId },
  })

  if (!targetMember || targetMember.groupId !== id) {
    return notFound('Member not found')
  }

  // Cannot remove a Leader
  if (targetMember.role === 'LEADER') {
    return badRequest('Cannot remove a Leader')
  }

  // Apprentice can only remove Members
  if (requesterMembership.role === 'APPRENTICE' && targetMember.role !== 'MEMBER') {
    return forbidden()
  }

  await prisma.groupMember.delete({ where: { id: memberId } })

  return NextResponse.json({ removed: true })
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; memberId: string }> }
) {
  const user = await getAuthenticatedUser()
  if (!user) return unauthorized()

  const { id, memberId } = await params

  // Only Leaders can promote/demote
  const requesterMembership = await prisma.groupMember.findUnique({
    where: { userId_groupId: { userId: user.id, groupId: id } },
  })

  if (!requesterMembership || requesterMembership.role !== 'LEADER') {
    return forbidden()
  }

  const body = await request.json()
  const result = updateMemberRoleSchema.safeParse(body)
  if (!result.success) {
    return badRequest(result.error.issues[0].message)
  }

  const targetMember = await prisma.groupMember.findUnique({
    where: { id: memberId },
  })

  if (!targetMember || targetMember.groupId !== id) {
    return notFound('Member not found')
  }

  const updated = await prisma.groupMember.update({
    where: { id: memberId },
    data: { role: result.data.role },
    include: { user: { select: { id: true, firstName: true, lastName: true, avatar: true } } },
  })

  return NextResponse.json({ member: updated })
}
