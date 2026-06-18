import NextAuth from 'next-auth';
import { authConfig } from '@/lib/auth.config';

export default NextAuth(authConfig).auth;

export const config = {
  // Matcher to restrict middleware to only specific routes (ignoring static files, images, etc.)
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png|.*\\.jpg|.*\\.ico).*)'],
};
