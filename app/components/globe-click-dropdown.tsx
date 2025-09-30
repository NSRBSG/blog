'use client';

import GlobeIcon from '@/assets/globe.svg';
import { Locale, locales, localeToLabel } from '@/lib/i18n/config';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';

export default function GlobeClickDropDown() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const handleLocaleChange = (locale: Locale) => {
    const segments = pathname.split('/');
    segments[1] = locale;
    const newPathname = segments.join('/');
    router.push(newPathname);
  };

  return (
    <>
      <li
        className={`p-2 cursor-pointer border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 ${
          isOpen ? 'border-b' : 'border-b-0'
        }`}
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <div className='flex justify-center p-2'>
          <button className='hover:scale-105 duration-100 cursor-pointer p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700'>
            <GlobeIcon className='h-5 w-5 text-slate-800 dark:text-white' />
          </button>
        </div>
      </li>
      <ul
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen
            ? `max-h-[${locales.length * 56}px] opacity-100`
            : 'max-h-0 opacity-0'
        }`}
      >
        {locales.map((locale) => (
          <li
            key={locale}
            onClick={() => {
              handleLocaleChange(locale);
            }}
            className='cursor-pointer p-2 m-2 rounded-md flex justify-center hover:bg-gray-100 text-slate-800 dark:hover:bg-gray-700 dark:text-white'
          >
            {localeToLabel[locale]}
          </li>
        ))}
      </ul>
    </>
  );
}
