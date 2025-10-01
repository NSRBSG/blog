import { Locale } from '@/lib/i18n/config';
import { getDictionary } from './dictionaries';
import { redirect } from 'next/navigation';
import { postsPerPage } from '@/lib/post-manager/config';
import { getPosts } from '@/lib/post-manager';
import Card from '../components/card';
import Pagination from '../components/pagination';

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
      <div className='flex flex-col flex-1 items-center mx-auto w-full px-[1.125rem] md:max-w-[43.125rem] md:px-[2.4375rem] xl:max-w-[67rem]'>
        <ul className='flex flex-col flex-1 gap-16 md:gap-[6rem] w-full py-48'>
          {posts.map((post) => (
            <Card key={post.id} post={post} lang={lang} />
          ))}
        </ul>
        <Pagination
          currentPage={Number(page ?? 1)}
          postsPerPage={postsPerPage}
          totalPostsCount={totalPostsCount}
        />
      </div>
    </>
  );
}
