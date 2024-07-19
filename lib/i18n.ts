import { NextRequest, NextResponse } from 'next/server';
import { match } from '@formatjs/intl-localematcher';
import Negotiator, { Headers } from 'negotiator';

export const locales = ['ko', 'en'] as const;

export type Locales = (typeof locales)[number];

const defaultLocale = 'ko';

function getLocale(request: NextRequest) {
  const headers: Headers = {};
  request.headers.forEach((value, key) => {
    headers[key] = value;
  });

  const negotiator = new Negotiator({ headers });
  const languages = negotiator.languages();
  return match(languages, locales, defaultLocale);
}

export function i18n(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) return NextResponse.next();

  const locale = getLocale(request);
  request.nextUrl.pathname = `/${locale}${pathname}`;
  return NextResponse.redirect(request.nextUrl);
}
