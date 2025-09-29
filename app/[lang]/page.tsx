import { Locale } from '@/lib/i18n/config';
import { getDictionary } from './dictionaries';
import { redirect } from 'next/navigation';
import { postsPerPage } from '@/lib/post-manager/config';
import { getPosts } from '@/lib/post-manager';

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
      <p>총 게시물 수: {totalPostsCount}개</p>
      <ul>
        {posts.map((post) => (
          <li key={post.id}>
            <h2>{post.title}</h2>
            <p>{post.content}</p>
          </li>
        ))}
      </ul>
    </>
  );
}
