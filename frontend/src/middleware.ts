import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const token = req.cookies.get('__Secure-next-auth.session-token') || req.cookies.get('next-auth.session-token');

  const protectedPaths = ['/admin', '/sales', '/users'];
  const pathname = req.nextUrl.pathname;

  const isProtected = protectedPaths.some(path => pathname.startsWith(path));
  if (isProtected && !token) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/sales/:path*', '/users/:path*'],
};
