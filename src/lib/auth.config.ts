import type { NextAuthConfig } from 'next-auth';
import { NextResponse } from 'next/server';

export const authConfig = {
  pages: {
    signIn: '/auth',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role;
        (session.user as any).id = token.id;
      }
      return session;
    },
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isLaporanPath = nextUrl.pathname.startsWith('/laporan');
      const isAdminPath = nextUrl.pathname.startsWith('/admin');
      const isAuthPage = nextUrl.pathname === '/auth';

      if (isLaporanPath) {
        if (!isLoggedIn) return false; // Automatically redirects to /auth
        const userRole = (auth?.user as any)?.role;
        if (userRole === 'ADMIN') {
          return NextResponse.redirect(new URL('/admin', nextUrl));
        }
      }

      if (isAdminPath) {
        if (!isLoggedIn) return false; // Automatically redirects to /auth
        const userRole = (auth?.user as any)?.role;
        if (userRole !== 'ADMIN') {
          return NextResponse.redirect(new URL('/', nextUrl));
        }
      }

      if (isAuthPage && isLoggedIn) {
        const userRole = (auth?.user as any)?.role;
        if (userRole === 'ADMIN') {
          return NextResponse.redirect(new URL('/admin', nextUrl));
        }
        return NextResponse.redirect(new URL('/', nextUrl));
      }

      return true;
    },
  },
  providers: [], // Empty array to satisfy configuration type requirements
  session: {
    strategy: 'jwt',
  },
} satisfies NextAuthConfig;
