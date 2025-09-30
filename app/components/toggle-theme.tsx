'use client';

import SunIcon from '@/assets/sun.svg';
import MoonIcon from '@/assets/moon.svg';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export default function ToggleTheme() {
  const { theme, systemTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  function isDark() {
    if (theme === 'system') {
      return systemTheme === 'dark';
    }
    return theme === 'dark';
  }

  if (!mounted) return null;

  return (
    <button
      className='relative hover:scale-105 duration-100 cursor-pointer p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700'
      onClick={() => setTheme(isDark() ? 'light' : 'dark')}
    >
      <div className='relative h-5 w-5'>
        <SunIcon
          className={`absolute h-5 w-5 text-slate-800 transition-all duration-300 ${
            isDark()
              ? 'opacity-0 rotate-45 scale-50'
              : 'opacity-100 rotate-0 scale-100'
          }`}
        />
        <MoonIcon
          className={`absolute h-5 w-5 text-white transition-all duration-300 ${
            isDark()
              ? 'opacity-100 rotate-0 scale-100'
              : 'opacity-0 -rotate-45 scale-50'
          }`}
        />
      </div>
    </button>
  );
}
