import { auth } from '@/configs/auth'
import { NextResponse } from 'next/server'

export default auth(async function middleware(req) {
  const { pathname } = req.nextUrl
  const session = await req.auth

  if (
    (pathname.startsWith('/bc') ||
      pathname.startsWith('/company') ||
      pathname.startsWith('/profile')) &&
    !session
  ) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  const authPages = ['/login', '/registration', '/forgot-password', '/reset-password', '/verify']
  if (authPages.some((page) => pathname.startsWith(page)) && session) {
    return NextResponse.redirect(new URL('/', req.url))
  }

  return NextResponse.next()
})

export const config = {
  matcher: [
    '/bc/:path*',
    '/login',
    '/registration',
    '/forgot-password',
    '/reset-password',
    '/verify',
    '/company',
    '/profile',
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
}
