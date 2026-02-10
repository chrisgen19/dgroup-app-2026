import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'

const COOKIE_NAME = 'dgroup-session'
const secret = new TextEncoder().encode(process.env.JWT_SECRET!)

// API routes that don't require authentication
const publicApiRoutes = [
  '/api/auth/signin',
  '/api/auth/signup',
  '/api/auth/signout',
]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Only protect API routes (except public auth routes)
  if (!pathname.startsWith('/api')) {
    return NextResponse.next()
  }

  if (publicApiRoutes.includes(pathname)) {
    return NextResponse.next()
  }

  const token = request.cookies.get(COOKIE_NAME)?.value
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    await jwtVerify(token, secret)
    return NextResponse.next()
  } catch {
    // Invalid token — clear it
    const response = NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    response.cookies.delete(COOKIE_NAME)
    return response
  }
}

export const config = {
  matcher: ['/api/:path*'],
}
