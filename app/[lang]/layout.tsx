import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';

import type { Metadata } from 'next';
import { Nanum_Gothic } from 'next/font/google';
import { Locale, localeMap, locales } from '@/lib/i18n/config';
import Header from '../components/header';
import '../globals.css';
import { ThemeProvider } from '../components/theme-provider';
import Footer from '../components/footer';
import { getDictionary } from './dictionaries';

const nanumGothic = Nanum_Gothic({
  subsets: ['latin'],
  weight: ['400', '700'],
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = (await params) as { lang: Locale };

  const dictionary = await getDictionary(lang);

  if (!dictionary) return {};

  const { metadata } = dictionary;

  return {
    title: {
      default: metadata.title,
      template: `%s | ${metadata.title}`,
    },
    description: metadata.description,
    keywords: metadata.keywords,
    authors: [{ name: metadata.author }],
    creator: metadata.author,
    publisher: metadata.author,

    openGraph: {
      type: 'website',
      locale: localeMap[lang],
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/${lang}`,
      title: metadata.title,
      description: metadata.description,
      siteName: metadata.siteName,
    },

    twitter: {
      card: 'summary_large_image',
      title: metadata.title,
      description: metadata.description,
      creator: `@${metadata.author}`,
    },

    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_BASE_URL}/${lang}`,
      languages: locales.reduce((acc, locale) => {
        acc[locale] = `${process.env.NEXT_PUBLIC_BASE_URL}/${locale}`;
        return acc;
      }, {} as Record<Locale, string>),
    },

    metadataBase: new URL(`${process.env.NEXT_PUBLIC_BASE_URL}`),

    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

export default async function RootLayout({
  params,
  children,
}: {
  params: Promise<{ lang: string }>;
  children: React.ReactNode;
}) {
  const { lang } = (await params) as { lang: Locale };
  return (
    <html lang={lang} suppressHydrationWarning>
      <body className={nanumGothic.className}>
        <ThemeProvider attribute='class' defaultTheme='system' enableSystem>
          <div className='flex flex-col flex-1'>
            <Header lang={lang} />
            {children}
            <Footer />
          </div>
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
