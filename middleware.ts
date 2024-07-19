import { NextRequest } from 'next/server';
import { isAuthRequiredPaths, auth } from '@/lib/auth';
import { i18n } from '@/lib/i18n';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (isAuthRequiredPaths(pathname)) {
    return auth(request);
  }

  return i18n(request);
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap|sitemap.xml|.*\\.png$).*)',
  ],
};
