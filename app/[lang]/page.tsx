import { Locale } from '@/lib/i18n/config';
import { getDictionary } from './dictionaries';
import { redirect } from 'next/navigation';
import { postsPerPage } from '@/lib/post-manager/config';
import { getPosts } from '@/lib/post-manager';
import Link from 'next/link';
import Image from 'next/image';

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ lang: Locale }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const { lang } = await params;
  const { page } = await searchParams;

  const dictionary = await getDictionary(lang);

  if (!dictionary) return redirect('/');

  const { posts, totalPostsCount } = getPosts(
    postsPerPage,
    Number(page ?? 1),
    lang
  );

  return (
    <>
      <div className='flex flex-col items-center pt-48 mx-auto w-full px-[1.125rem] md:max-w-[43.125rem] md:px-[2.4375rem] xl:max-w-[67rem]'>
        <ul className='flex flex-col gap-16 md:gap-[6rem] w-full'>
          {posts.map((post) => (
            <li key={post.id} className='hover:scale-[1.02] duration-300'>
              <Link
                href={`/${lang}/${post.slug}`}
                className='flex gap-4 md:gap-[2.5rem] md:items-center w-full'
              >
                <div className='flex flex-col gap-[1rem] md:gap-9 w-full'>
                  <div className='flex flex-col gap-2 md:gap-4'>
                    <span className='md:text-lg font-bold line-clamp-2'>
                      {post.title}
                    </span>
                    <span className='text-sm md:text-base text-gray-600 dark:text-gray-400 line-clamp-2'>
                      {post.description}
                    </span>
                  </div>
                  <span className='text-xs md:text-sm text-slate-700 dark:text-gray-300'>
                    {new Date(post.date).toLocaleDateString(lang)}
                  </span>
                </div>
                <Image
                  src={post.thumbnailUrl}
                  alt={post.title}
                  width={500}
                  height={300}
                  priority={true}
                  className='object-cover aspect-[13/9] rounded-xl h-[5rem] w-[8.25rem] md:h-[10rem] md:w-[16.3rem]'
                />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
