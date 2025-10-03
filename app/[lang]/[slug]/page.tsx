import { Locale, locales } from '@/lib/i18n/config';
import { getPostMarkdown, markdownToHtml } from '@/lib/post-manager/utils';
import { redirect } from 'next/navigation';
import type { Metadata } from 'next';
import { BlogPostJsonLd } from '../../components/json-ld';
import { getDictionary } from '../dictionaries';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: Locale; slug: string }>;
}): Promise<Metadata> {
  const { lang, slug } = await params;

  const dictionary = await getDictionary(lang);
  const post = getPostMarkdown(slug, lang);

  if (!dictionary || !post) return {};

  const { metadata } = dictionary;
  const { data: postMetadata } = post;

  return {
    title: postMetadata.title,
    description: postMetadata.description,
    keywords: postMetadata.tags,
    authors: [{ name: metadata.author }],

    openGraph: {
      title: postMetadata.title,
      description: postMetadata.description,
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/${lang}/${slug}`,
      type: 'article',
      publishedTime: postMetadata.date,
      authors: [metadata.author],
      tags: postMetadata.tags,
      ...(postMetadata.thumbnailUrl && {
        images: [
          {
            url: `${process.env.NEXT_PUBLIC_BASE_URL}${postMetadata.thumbnailUrl}`,
            width: 500,
            height: 300,
            alt: postMetadata.title,
          },
        ],
      }),
    },

    twitter: {
      card: 'summary_large_image',
      title: postMetadata.title,
      description: postMetadata.description,
      creator: `'@${metadata.author}'`,
      ...(postMetadata.thumbnailUrl && {
        images: [
          `${process.env.NEXT_PUBLIC_BASE_URL}${postMetadata.thumbnailUrl}`,
        ],
      }),
    },

    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_BASE_URL}/${lang}/${slug}`,
      languages: locales.reduce((acc, locale) => {
        acc[locale] = `${process.env.NEXT_PUBLIC_BASE_URL}/${locale}/${slug}`;
        return acc;
      }, {} as Record<Locale, string>),
    },

    category: postMetadata.categories[0],

    other: {
      'article:published_time': postMetadata.date,
      'article:author': metadata.author,
      'article:section': postMetadata.categories[0],
      'article:tag': postMetadata.tags.join(', '),
    },
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ lang: Locale; slug: string }>;
}) {
  const { lang, slug } = await params;

  const dictionary = await getDictionary(lang);
  const post = getPostMarkdown(slug, lang);

  if (!dictionary || !post) redirect(`/${lang}`);

  const { data: metadata, content: markdown } = post;

  return (
    <>
      <BlogPostJsonLd
        title={metadata.title}
        description={metadata.description}
        author='NSRBSG'
        datePublished={metadata.date}
        url={`${process.env.NEXT_PUBLIC_BASE_URL}/${lang}/${slug}`}
        imageUrl={`${process.env.NEXT_PUBLIC_BASE_URL}${metadata.thumbnailUrl}`}
        keywords={metadata.tags}
        publisher={dictionary.metadata.siteName}
      />
      <main className='flex flex-col flex-1 items-center mx-auto w-full px-[1.125rem] md:max-w-[43.125rem] md:px-[2.4375rem] xl:max-w-[67rem]'>
        <div className='flex flex-col flex-1 gap-16 md:gap-[6rem] w-full py-48'>
          <div className='flex flex-col gap-4 md:gap-6'>
            <h1 className='font-bold text-[1.5rem] leading-[140%] md:text-[2rem] xl:text-[3rem] text-slate-800 dark:text-gray-100'>
              {metadata.title}
            </h1>
            <span className='text-sm xl:text-[1rem] text-gray-600 dark:text-gray-400'>
              {new Date(metadata.date).toLocaleDateString(lang)}
            </span>
            <div className='flex gap-2 text-xs font-bold text-gray-500 dark:text-gray-200 flex-wrap'>
              {metadata.tags.map((tag) => (
                <span
                  className='bg-gray-200 dark:bg-gray-700 rounded-full px-2 py-1'
                  key={tag}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
          <div
            className='prose dark:prose-invert w-full max-w-none'
            dangerouslySetInnerHTML={{
              __html: await markdownToHtml(markdown),
            }}
          />
        </div>
      </main>
    </>
  );
}
