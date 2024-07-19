import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      typography: {
        DEFAULT: {
          css: {
            '--tw-prose-body': 'black',
            '--tw-prose-headings': 'black',
            '--tw-prose-lead': 'black',
            '--tw-prose-links': 'darkblue',
            '--tw-prose-bold': 'red',
            '--tw-prose-counters': 'black',
            '--tw-prose-bullets': 'black',
            '--tw-prose-hr': 'black',
            '--tw-prose-quotes': 'black',
            '--tw-prose-quote-borders': 'black',
            '--tw-prose-captions': 'black',
            '--tw-prose-code': 'black',
            '--tw-prose-pre-code': 'white',
            '--tw-prose-pre-bg': 'black',
            '--tw-prose-th-borders': 'black',
            '--tw-prose-td-borders': 'black',
          },
        },
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
export default config;
