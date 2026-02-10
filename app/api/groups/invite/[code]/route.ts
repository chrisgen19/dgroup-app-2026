import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { notFound } from '@/lib/api-auth'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  const { code } = await params

  const group = await prisma.group.findUnique({
    where: { inviteCode: code },
    include: {
      members: {
        include: { user: { select: { id: true, firstName: true, lastName: true, avatar: true } } },
        orderBy: { joinedAt: 'asc' },
      },
    },
  })

  if (!group) return notFound('Invalid invite code')

  return NextResponse.json({ group })
}
