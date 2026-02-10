import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getAuthenticatedUser, unauthorized, notFound, badRequest } from '@/lib/api-auth'

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getAuthenticatedUser()
  if (!user) return unauthorized()

  const { id } = await params

  const group = await prisma.group.findUnique({
    where: { id },
    include: { members: true },
  })

  if (!group) return notFound('Group not found')

  // Check if already a member
  const existingMember = group.members.find((m) => m.userId === user.id)
  if (existingMember) {
    return badRequest('You are already a member of this group')
  }

  // Check max members
  if (group.members.length >= group.maxMembers) {
    return badRequest('This group is full')
  }

  if (group.joinMode === 'AUTO_ACCEPT') {
    const member = await prisma.groupMember.create({
      data: { userId: user.id, groupId: id },
      include: { user: { select: { id: true, firstName: true, lastName: true, avatar: true } } },
    })

    return NextResponse.json({ joined: true, member }, { status: 201 })
  }

  // REQUEST_TO_JOIN mode
  const existingRequest = await prisma.joinRequest.findUnique({
    where: { userId_groupId: { userId: user.id, groupId: id } },
  })

  if (existingRequest) {
    if (existingRequest.status === 'PENDING') {
      return badRequest('You already have a pending request')
    }
    if (existingRequest.status === 'REJECTED') {
      // Allow re-requesting after rejection
      await prisma.joinRequest.update({
        where: { id: existingRequest.id },
        data: { status: 'PENDING', message: null },
      })
      return NextResponse.json({ requested: true }, { status: 201 })
    }
  }

  await prisma.joinRequest.create({
    data: { userId: user.id, groupId: id },
  })

  return NextResponse.json({ requested: true }, { status: 201 })
}
