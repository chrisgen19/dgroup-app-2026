import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getAuthenticatedUser, unauthorized, notFound, forbidden, badRequest } from '@/lib/api-auth'
import { updateGroupSchema } from '@/lib/validations/group'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getAuthenticatedUser()
  if (!user) return unauthorized()

  const { id } = await params

  const group = await prisma.group.findUnique({
    where: { id },
    include: {
      members: {
        include: { user: { select: { id: true, firstName: true, lastName: true, avatar: true } } },
        orderBy: { joinedAt: 'asc' },
      },
    },
  })

  if (!group) return notFound('Group not found')

  return NextResponse.json({ group })
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getAuthenticatedUser()
  if (!user) return unauthorized()

  const { id } = await params

  // Check if user is a Leader of this group
  const membership = await prisma.groupMember.findUnique({
    where: { userId_groupId: { userId: user.id, groupId: id } },
  })

  if (!membership || membership.role !== 'LEADER') {
    return forbidden()
  }

  const body = await request.json()
  const result = updateGroupSchema.safeParse(body)
  if (!result.success) {
    return badRequest(result.error.issues[0].message)
  }

  const group = await prisma.group.update({
    where: { id },
    data: result.data,
    include: {
      members: {
        include: { user: { select: { id: true, firstName: true, lastName: true, avatar: true } } },
        orderBy: { joinedAt: 'asc' },
      },
    },
  })

  return NextResponse.json({ group })
}
