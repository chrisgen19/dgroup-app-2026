import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getAuthenticatedUser, unauthorized, notFound, badRequest } from '@/lib/api-auth'

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  const user = await getAuthenticatedUser()
  if (!user) return unauthorized()

  const { code } = await params

  const group = await prisma.group.findUnique({
    where: { inviteCode: code },
    include: { members: true },
  })

  if (!group) return notFound('Invalid invite code')

  // Check if already a member
  const existingMember = group.members.find((m) => m.userId === user.id)
  if (existingMember) {
    return badRequest('You are already a member of this group')
  }

  // Check max members
  if (group.members.length >= group.maxMembers) {
    return badRequest('This group is full')
  }

  // Invite link always auto-accepts
  const member = await prisma.groupMember.create({
    data: { userId: user.id, groupId: group.id },
    include: { user: { select: { id: true, firstName: true, lastName: true, avatar: true } } },
  })

  return NextResponse.json({ joined: true, member, groupId: group.id }, { status: 201 })
}
