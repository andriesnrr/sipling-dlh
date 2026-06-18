import NextAuth from 'next-auth';
import { authConfig } from '@/lib/auth.config';
import { NextResponse } from 'next/server';

const { auth: nextAuthMiddleware } = NextAuth(authConfig);

export default nextAuthMiddleware((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  const user = req.auth?.user as any;
  const role = user?.role;

  const isLaporanPath = nextUrl.pathname.startsWith('/laporan');
  const isAdminPath = nextUrl.pathname.startsWith('/admin');
  const isAuthPage = nextUrl.pathname === '/auth';

  // 1. If trying to access /laporan as an ADMIN, redirect to /admin
  if (isLaporanPath && isLoggedIn && role === 'ADMIN') {
    return NextResponse.redirect(new URL('/admin', nextUrl));
  }

  // 2. If trying to access /admin as a non-ADMIN, redirect to /
  if (isAdminPath && isLoggedIn && role !== 'ADMIN') {
    return NextResponse.redirect(new URL('/', nextUrl));
  }

  // 3. If logged in and trying to access /auth page, redirect appropriately
  if (isAuthPage && isLoggedIn) {
    if (role === 'ADMIN') {
      return NextResponse.redirect(new URL('/admin', nextUrl));
    }
    return NextResponse.redirect(new URL('/', nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  // Matcher to restrict middleware to only specific routes (ignoring static files, images, etc.)
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png|.*\\.jpg|.*\\.ico).*)'],
};
