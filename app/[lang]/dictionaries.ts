import 'server-only';
import { Locales } from '@/lib/i18n';

const dictionaries = {
  en: () => import('./dictionaries/en.json').then((module) => module.default),
  ko: () => import('./dictionaries/ko.json').then((module) => module.default),
};

export const getDictionary = async (locale: Locales) =>
  Object.hasOwn(dictionaries, locale) ? await dictionaries[locale]() : null;
