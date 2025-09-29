import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Locale } from '@/lib/i18n/config';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Nonsense Developer Blog',
};

export default async function RootLayout({
  params,
  children,
}: Readonly<{
  params: Promise<{ lang: Locale }>;
  children: React.ReactNode;
}>) {
  const { lang } = await params;
  return (
    <html lang={lang}>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
