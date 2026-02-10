import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getSessionToken, verifyToken, clearSessionCookie } from '@/lib/auth'

export async function GET() {
  try {
    const token = await getSessionToken()
    if (!token) {
      return NextResponse.json({ user: null }, { status: 401 })
    }

    const payload = await verifyToken(token)
    if (!payload) {
      await clearSessionCookie()
      return NextResponse.json({ user: null }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        gender: true,
        lifeStage: true,
        church: true,
        satellite: true,
        country: true,
        avatar: true,
      },
    })

    if (!user) {
      await clearSessionCookie()
      return NextResponse.json({ user: null }, { status: 401 })
    }

    return NextResponse.json({ user })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
