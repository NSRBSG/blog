'use client';

import { useEffect, useState } from 'react';

import MenuIcon from '@/assets/menu.svg';
import GlobeClickDropDown from './globe-click-dropdown';
import ToggleTheme from './toggle-theme';
import { useTheme } from 'next-themes';

export default function Menu() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { theme, systemTheme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  function isDark() {
    if (theme === 'system') {
      return systemTheme === 'dark';
    }
    return theme === 'dark';
  }

  return (
    <div className='flex items-center'>
      <button
        className='hover:scale-105 duration-100 cursor-pointer p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700'
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <MenuIcon className='h-5 w-5 text-slate-800 dark:text-white' />
      </button>
      {isOpen && (
        <ul
          className={`absolute top-full left-0 right-0 border-t border-gray-200 dark:border-gray-700 dark:divide-gray-700 bg-white dark:bg-gray-800 shadow-lg`}
        >
          <GlobeClickDropDown />
          <li
            className='p-2 border-t border-gray-200 dark:border-gray-700 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700'
            onClick={() => setTheme(isDark() ? 'light' : 'dark')}
          >
            <div className='flex justify-center p-2'>
              <ToggleTheme />
            </div>
          </li>
        </ul>
      )}
    </div>
  );
}
