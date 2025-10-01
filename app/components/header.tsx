import Link from 'next/link';
import LogoIcon from '@/assets/logo.svg';
import { Locale } from '@/lib/i18n/config';
import GlobeDropDown from './globe-dropdown';
import ToggleTheme from './toggle-theme';
import Menu from './menu';

export default function Header({
  lang,
}: Readonly<{
  lang: Locale;
}>) {
  return (
    <header className='fixed left-0 top-0 right-0 shadow-sm backdrop-blur-lg z-10'>
      <div className='mx-auto flex w-full items-center justify-between px-5 py-4 md:max-w-[43.125rem] xl:max-w-[80rem]'>
        <Link href={`/${lang}`} className='hover:scale-102 duration-100'>
          <LogoIcon className='h-[1.125rem] md:h-[1.5rem] dark:stroke-white dark:fill-white' />
        </Link>
        <div className='p-2 md:hidden'>
          <Menu />
        </div>
        <nav className='hidden items-center gap-[3.5625rem] md:flex'>
          <GlobeDropDown />
          <ToggleTheme />
        </nav>
      </div>
    </header>
  );
}
