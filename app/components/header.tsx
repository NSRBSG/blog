import { locales, Locales } from '@/lib/i18n';
import Link from 'next/link';
import { getDictionary } from '@/app/[lang]/dictionaries';
import { ArticleManager } from '@/lib/article-manager';
import Image from 'next/image';

export default function Header({
  language,
  slug,
}: {
  language?: Locales;
  slug?: string;
}) {
  return (
    <header className='p-4 flex justify-between border-b border-black'>
      <Link
        className='text-2xl font-bold'
        href={language ? `/${language}` : '/'}
      >
        <Image src='/logo.png' alt='logo' width={125} height={35} />
      </Link>
      <nav className='flex items-center gap-2'>
        {language &&
          (slug
            ? ArticleManager.getSupportedLanguages(slug)
                .sort()
                .reverse()
                .map(async (locale, index) => (
                  <>
                    {index > 0 && <span>|</span>}
                    <Link
                      className={language === locale ? 'text-blue-700' : ''}
                      key={locale}
                      href={`/${locale}/${slug}`}
                    >
                      {(await getDictionary(locale))!.i18n}
                    </Link>
                  </>
                ))
            : [...locales]
                .sort()
                .reverse()
                .map(async (locale, index) => (
                  <>
                    {index > 0 && <span>|</span>}
                    <Link
                      className={language === locale ? 'text-blue-700' : ''}
                      key={locale}
                      href={`/${locale}`}
                    >
                      {(await getDictionary(locale))!.i18n}
                    </Link>
                  </>
                )))}
      </nav>
    </header>
  );
}
