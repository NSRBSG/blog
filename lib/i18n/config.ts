export const locales = ['ko', 'en'] as const;

export type Locale = (typeof locales)[number];

export const localeToLabel: Record<Locale, string> = {
  ko: '한국어',
  en: 'English',
};

export const defaultLocale: Locale = 'ko';
