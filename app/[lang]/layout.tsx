import type { Metadata } from 'next';
import { Nanum_Gothic } from 'next/font/google';
import { Locale } from '@/lib/i18n/config';
import Header from '../components/header';
import '../globals.css';
import { ThemeProvider } from '../components/theme-provider';

const nanumGothic = Nanum_Gothic({
  subsets: ['latin'],
  weight: ['400', '700'],
});

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
    <html lang={lang} suppressHydrationWarning>
      <body className={nanumGothic.className}>
        <ThemeProvider attribute='class' defaultTheme='system' enableSystem>
          <Header lang={lang} />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
