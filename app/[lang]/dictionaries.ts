import 'server-only';
import { Locale } from '@/lib/i18n/config';

const dictionaries = {
  ko: () => import('./dictionaries/ko.json').then((module) => module.default),
  en: () => import('./dictionaries/en.json').then((module) => module.default),
};

export const getDictionary = async (locale: Locale) =>
  Object.hasOwn(dictionaries, locale) ? await dictionaries[locale]() : null;
