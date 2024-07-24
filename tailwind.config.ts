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
            '--tw-prose-body': '#1E2022',
            '--tw-prose-headings': '#1E2022',
            '--tw-prose-lead': '#3E4C59',
            '--tw-prose-links': '#2C7BE5',
            '--tw-prose-bold': '#1E2022',
            '--tw-prose-counters': '#3E4C59',
            '--tw-prose-bullets': '#3E4C59',
            '--tw-prose-hr': '#3E4C59',
            '--tw-prose-quotes': '#1E2022',
            '--tw-prose-quote-borders': '#3E4C59',
            '--tw-prose-captions': '#3E4C59',
            '--tw-prose-code': '#1E2022',
            '--tw-prose-pre-code': '#F0F5F9',
            '--tw-prose-pre-bg': '#1E2022',
            '--tw-prose-th-borders': '#3E4C59',
            '--tw-prose-td-borders': '#3E4C59',
            '--tw-prose-invert-body': '#E5E7EB',
            '--tw-prose-invert-headings': '#FFFFFF',
            '--tw-prose-invert-lead': '#9CA3AF',
            '--tw-prose-invert-links': '#60A5FA',
            '--tw-prose-invert-bold': '#FFFFFF',
            '--tw-prose-invert-counters': '#9CA3AF',
            '--tw-prose-invert-bullets': '#9CA3AF',
            '--tw-prose-invert-hr': '#374151',
            '--tw-prose-invert-quotes': '#E5E7EB',
            '--tw-prose-invert-quote-borders': '#374151',
            '--tw-prose-invert-captions': '#9CA3AF',
            '--tw-prose-invert-code': '#FFFFFF',
            '--tw-prose-invert-pre-code': '#E5E7EB',
            '--tw-prose-invert-pre-bg': 'rgba(0, 0, 0, 0.5)',
            '--tw-prose-invert-th-borders': '#374151',
            '--tw-prose-invert-td-borders': '#374151',
          },
        },
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
export default config;
