import { NextRequest } from 'next/server';
import Negotiator, { Headers } from 'negotiator';
import { match } from '@formatjs/intl-localematcher';
import { defaultLocale, locales } from './config';

export function hasLocaleInPath(pathname: string): boolean {
  return locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );
}

export function getLocale(request: NextRequest) {
  const headers: Headers = {};

  request.headers.forEach((value, key) => {
    headers[key] = value;
  });

  const negotiator = new Negotiator({ headers });
  const languages = negotiator.languages();
  return match(languages, locales, defaultLocale);
}
