import Link from 'next/link';
import LeftIcon from '@/assets/left.svg';
import RightIcon from '@/assets/right.svg';

export default function Pagination({
  currentPage,
  postsPerPage,
  totalPostsCount,
}: {
  currentPage: number;
  postsPerPage: number;
  totalPostsCount: number;
}) {
  const totalPages = Math.ceil(totalPostsCount / postsPerPage);
  const maxVisiblePages = 5;
  const floorOffset = Math.floor(maxVisiblePages / 2);
  const ceilOffset = Math.ceil(maxVisiblePages / 2);

  return (
    <div className='flex justify-center space-x-2 my-6'>
      {currentPage - floorOffset > 1 && (
        <Link
          href={`?page=${
            currentPage > totalPages - floorOffset
              ? totalPages - maxVisiblePages
              : currentPage - ceilOffset
          }`}
          className='flex items-center justify-center w-8 h-8 rounded hover:bg-gray-200 dark:hover:bg-gray-700 duration-200'
        >
          <LeftIcon className='w-4 h-4 text-gray-500 dark:text-gray-400' />
        </Link>
      )}
      {Array.from({ length: Math.min(totalPages, maxVisiblePages) }, (_, i) => {
        const tentativeStartPage =
          ceilOffset >= currentPage ? 1 : currentPage - floorOffset;

        const finalStartPage =
          tentativeStartPage + maxVisiblePages > totalPages
            ? totalPages - Math.min(maxVisiblePages, totalPages) + 1
            : tentativeStartPage;

        const page = finalStartPage + i;

        return (
          <Link
            key={page}
            href={`?page=${page}`}
            className={`flex items-center text-gray-500 dark:text-gray-400 justify-center w-8 h-8 rounded ${
              page === currentPage
                ? 'bg-slate-600 text-white dark:bg-slate-800 font-bold cursor-default'
                : 'hover:bg-gray-200 dark:hover:bg-gray-700 duration-200'
            }`}
          >
            {page}
          </Link>
        );
      })}
      {currentPage + floorOffset < totalPages && (
        <Link
          href={`?page=${
            currentPage < ceilOffset
              ? maxVisiblePages + 1
              : currentPage + ceilOffset
          }`}
          className='flex items-center justify-center w-8 h-8 rounded hover:bg-gray-200 dark:hover:bg-gray-700 duration-200'
        >
          <RightIcon className='w-4 h-4 text-gray-500 dark:text-gray-400' />
        </Link>
      )}
    </div>
  );
}
