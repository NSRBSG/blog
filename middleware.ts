import { NextRequest, NextResponse } from 'next/server';
import { getLocale, hasLocaleInPath } from './lib/i18n';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (hasLocaleInPath(pathname)) {
    return NextResponse.next();
  }

  const locale = getLocale(request);
  request.nextUrl.pathname = `/${locale}${pathname}`;
  return NextResponse.redirect(request.nextUrl);
}

export const config = {
  matcher: [
    '/((?!.well-known|api|_next/static|_next/image|favicon.ico|robots.txt|sitemap|sitemap.xml|.*\\.png$|.*\\.jpg$).*)',
  ],
};
