import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getAuthenticatedUser, unauthorized, badRequest } from '@/lib/api-auth'
import { createGroupSchema } from '@/lib/validations/group'
import { generateInviteCode } from '@/lib/invite-code'

export async function POST(request: NextRequest) {
  const user = await getAuthenticatedUser()
  if (!user) return unauthorized()

  const body = await request.json()
  const result = createGroupSchema.safeParse(body)
  if (!result.success) {
    return badRequest(result.error.issues[0].message)
  }

  const data = result.data

  const group = await prisma.$transaction(async (tx) => {
    const newGroup = await tx.group.create({
      data: {
        name: data.name,
        description: data.description,
        schedule: data.schedule,
        location: data.location,
        type: data.type,
        joinMode: data.joinMode,
        status: data.status,
        maxMembers: data.maxMembers,
        inviteCode: generateInviteCode(),
        satellite: user.satellite,
      },
    })

    await tx.groupMember.create({
      data: {
        userId: user.id,
        groupId: newGroup.id,
        role: 'LEADER',
      },
    })

    return tx.group.findUnique({
      where: { id: newGroup.id },
      include: {
        members: {
          include: { user: { select: { id: true, firstName: true, lastName: true, avatar: true } } },
        },
      },
    })
  })

  return NextResponse.json({ group }, { status: 201 })
}

export async function GET(request: NextRequest) {
  const user = await getAuthenticatedUser()
  if (!user) return unauthorized()

  const { searchParams } = new URL(request.url)
  const filter = searchParams.get('filter') ?? 'my'
  const search = searchParams.get('search') ?? ''

  if (filter === 'my') {
    const groups = await prisma.group.findMany({
      where: {
        members: { some: { userId: user.id } },
      },
      include: {
        members: {
          include: { user: { select: { id: true, firstName: true, lastName: true, avatar: true } } },
        },
      },
      orderBy: { updatedAt: 'desc' },
    })

    return NextResponse.json({ groups })
  }

  // Discover: public groups the user is NOT a member of
  const where: Record<string, unknown> = {
    status: 'PUBLIC',
    members: { none: { userId: user.id } },
  }

  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
      { location: { contains: search, mode: 'insensitive' } },
    ]
  }

  const groups = await prisma.group.findMany({
    where,
    include: {
      members: {
        include: { user: { select: { id: true, firstName: true, lastName: true, avatar: true } } },
      },
    },
    orderBy: { createdAt: 'desc' },
  })

  // Sort: groups matching user's satellite first
  if (user.satellite) {
    groups.sort((a, b) => {
      const aMatch = a.satellite === user.satellite ? 0 : 1
      const bMatch = b.satellite === user.satellite ? 0 : 1
      return aMatch - bMatch
    })
  }

  return NextResponse.json({ groups })
}
