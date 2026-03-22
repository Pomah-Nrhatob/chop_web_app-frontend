import { authOptions } from '@/configs/auth'
import NextAuth from 'next-auth'
import { NextResponse } from 'next/server'

const { auth } = NextAuth(authOptions)

export default auth(async function middleware(req) {
  const pathname = req.nextUrl.pathname
  const isLoggedIn = !!req.auth

  if (pathname.startsWith('/bc') && !isLoggedIn) {
    return NextResponse.redirect(new URL('/', req.url))
  }

  const authPages = ['/login', '/registration', '/forgot-password', '/reset-password', '/verify']
  if (authPages.some((page) => pathname.startsWith(page)) && isLoggedIn) {
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
  ],
}
