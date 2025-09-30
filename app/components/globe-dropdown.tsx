'use client';

import GlobeIcon from '@/assets/globe.svg';
import { Locale, locales, localeToLabel } from '@/lib/i18n/config';
import { useRouter, usePathname } from 'next/navigation';

export default function GlobeDropDown() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLocaleChange = (locale: Locale) => {
    const segments = pathname.split('/');
    segments[1] = locale;
    const newPathname = segments.join('/');
    router.push(newPathname);
  };

  return (
    <div className='flex items-center group relative'>
      <button className='hover:scale-105 duration-100 cursor-pointer p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700'>
        <GlobeIcon className='h-5 w-5 text-slate-800 dark:text-white' />
      </button>
      <div className='absolute top-full left-1/2 -translate-x-1/2 hidden group-hover:block p-2'>
        <ul className='rounded-md border border-gray-200 bg-white shadow-lg'>
          {locales.map((locale) => (
            <li
              key={locale}
              className='cursor-pointer p-2 m-2 rounded-md flex justify-center hover:bg-gray-100 text-slate-800'
              onClick={() => handleLocaleChange(locale)}
            >
              {localeToLabel[locale]}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
