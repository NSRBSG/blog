import { Locale } from '@/lib/i18n/config';
import { getPostMarkdown, markdownToHtml } from '@/lib/post-manager/utils';
import { redirect } from 'next/navigation';

export default async function Page({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang, slug } = (await params) as { lang: Locale; slug: string };

  const post = getPostMarkdown(slug, lang);

  if (!post) redirect(`/${lang}`);

  const { data: metadata, content: markdown } = post;

  return (
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
  );
}
