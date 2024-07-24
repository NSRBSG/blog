import { Locales } from '@/lib/i18n';
import Header from '@/app/components/header';
import { ArticleManager } from '@/lib/article-manager';
import { Marked } from 'marked';
import hljs from 'highlight.js';
import { markedHighlight } from 'marked-highlight';
import { redirect } from 'next/navigation';
import { Metadata } from 'next';
import { BASE_URL } from '@/lib/constants';

export async function generateMetadata({
  params: { lang, slug },
}: {
  params: { lang: Locales; slug: string };
}): Promise<Metadata> {
  const articleManager = new ArticleManager(lang);
  const article = articleManager.getArticle(slug);

  if (!article) return {};

  const supportedLanguages = ArticleManager.getSupportedLanguages(slug);

  return {
    title: article.title,
    description: article.description,
    keywords: article.keywords,
    alternates: {
      canonical: `/${lang}/${slug}`,
      languages: supportedLanguages.reduce((acc, locale) => {
        return { ...acc, [locale]: `/${locale}/${slug}` };
      }, {}),
    },

    openGraph: {
      type: 'article',
      locale: lang,
      siteName: article.title,
      title: article.title,
      description: article.description,
      url: `${BASE_URL}/${lang}/${slug}`,
      images: [
        {
          url: '/logo.png',
          width: 1200,
          height: 630,
          alt: article.title,
        },
      ],
      publishedTime: article.date.toISOString(),
      tags: article.keywords,
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.description,
      images: [
        {
          url: '/logo.png',
        },
      ],
    },
  };
}

export function generateStaticParams() {
  return ArticleManager.getArticleFolderNames().flatMap((articleSlug) => {
    const locales = ArticleManager.getSupportedLanguages(articleSlug);
    return locales.map((locale) => ({ lang: locale, slug: articleSlug }));
  });
}

async function getArticle(lang: Locales, slug: string) {
  const articleManager = new ArticleManager(lang);
  return articleManager.getArticle(slug);
}

export default async function Page({
  params: { lang, slug },
}: {
  params: { lang: Locales; slug: string };
}) {
  const article = await getArticle(lang, slug);

  if (!article) redirect(`/${lang}`);

  const marked = new Marked(
    markedHighlight({
      langPrefix: 'not-prose hljs language-',
      highlight: (code, lang) => {
        return hljs.highlightAuto(code, [lang]).value;
      },
    })
  );
  return (
    <>
      <Header language={lang} slug={slug} />
      <main className='flex flex-col flex-1'>
        <div className='flex flex-col flex-1 items-center mx-2 mb-16'>
          <article className='flex flex-col w-full max-w-[652px] items-center'>
            <div className='flex flex-col w-full py-6 border-b'>
              <h2 className='text-2xl md:text-3xl font-bold mb-2'>
                {article.title}
              </h2>
              <p className='md:text-lg mb-4'>{article.description}</p>
              <time className='text-sm md:text-base'>
                {article.date.toLocaleDateString(lang, {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </time>
            </div>
            <div className='my-6'>
              <div
                className='prose dark:prose-invert prose-sm md:prose-lg'
                dangerouslySetInnerHTML={{
                  __html: marked.parse(article.content),
                }}
              />
            </div>
          </article>
        </div>
      </main>
    </>
  );
}
