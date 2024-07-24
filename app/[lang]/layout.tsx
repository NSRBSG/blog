import Footer from '@/app/components/footer';
import { Metadata, Viewport } from 'next';
import { locales, Locales } from '@/lib/i18n';

import { Inter } from 'next/font/google';
import '@/app/globals.css';
import { getDictionary } from '@/app/[lang]/dictionaries';
import { BASE_URL } from '@/lib/constants';

const inter = Inter({ subsets: ['latin'] });

export const viewport: Viewport = {
  themeColor: 'rgb(255, 255, 255)',
};

export async function generateMetadata({
  params: { lang },
}: {
  params: { lang: Locales };
}): Promise<Metadata> {
  const dictionary = await getDictionary(lang);

  if (!dictionary) return {};

  const { metadata } = dictionary;

  return {
    metadataBase: new URL(BASE_URL),
    title: metadata.title,
    description: metadata.description,
    keywords: metadata.keywords,
    authors: {
      name: 'NSRBSG',
    },
    robots: {
      index: true,
      follow: true,
      nocache: true,
      googleBot: {
        index: true,
        follow: true,
        noimageindex: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    alternates: {
      canonical: `/${lang}`,
      languages: locales.reduce((acc, locale) => {
        return { ...acc, [locale]: `/${locale}` };
      }, {}),
    },
    openGraph: {
      type: 'website',
      locale: lang,
      siteName: metadata.title,
      title: metadata.title,
      description: metadata.description,
      url: `${BASE_URL}/${lang}`,
      images: [
        {
          url: '/logo.png',
          width: 1200,
          height: 630,
          alt: metadata.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: metadata.title,
      description: metadata.description,
      images: [
        {
          url: '/logo.png',
        },
      ],
    },
  };
}

export async function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export default async function RootLayout({
  params: { lang },
  children,
}: {
  params: { lang: Locales };
  children: Readonly<React.ReactNode>;
}) {
  return (
    <html lang={lang}>
      <body className={inter.className}>
        <div className='flex flex-col flex-1'>
          {children}
          <Footer />
        </div>
      </body>
    </html>
  );
}
