import Link from 'next/link';
import Image from 'next/image';
import { PostMetadata } from '@/lib/post-manager/config';
import { Locale } from '@/lib/i18n/config';

export default function Card({
  post,
  lang,
}: {
  post: PostMetadata;
  lang: Locale;
}) {
  return (
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
  );
}
