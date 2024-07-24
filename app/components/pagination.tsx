import Link from 'next/link';

export default function Pagination({
  currentPage,
  perPage,
  totalItem,
  leftText,
  rightText,
}: Readonly<{
  currentPage: number;
  perPage: number;
  totalItem: number;
  leftText: string;
  rightText: string;
}>) {
  const maxPage = Math.ceil(totalItem / perPage);
  const maxShowPage = 5;

  return (
    <div className='flex justify-center space-x-2 my-6'>
      {currentPage - Math.floor(maxShowPage / 2) > 1 && (
        <Link
          href={`?page=${
            currentPage > maxPage - Math.floor(maxShowPage / 2)
              ? maxPage - maxShowPage
              : currentPage - Math.ceil(maxShowPage / 2)
          }`}
          className='px-2 border'
        >
          {leftText}
        </Link>
      )}
      {Array.from({ length: Math.min(maxPage, maxShowPage) }, (_, i) => {
        const tentativeStartPage =
          Math.ceil(maxShowPage / 2) >= currentPage
            ? 1
            : currentPage - Math.floor(maxShowPage / 2);

        const finalStartPage =
          tentativeStartPage + maxShowPage > maxPage
            ? maxPage - Math.min(maxShowPage, maxPage) + 1
            : tentativeStartPage;

        const page = finalStartPage + i;

        return (
          <Link
            key={page}
            href={`?page=${page}`}
            className={`px-2 border ${page === currentPage ? 'accent' : ''}`}
          >
            {page}
          </Link>
        );
      })}
      {currentPage + Math.floor(maxShowPage / 2) < maxPage && (
        <Link
          href={`?page=${
            currentPage < Math.ceil(maxShowPage / 2)
              ? maxShowPage + 1
              : currentPage + Math.ceil(maxShowPage / 2)
          }`}
          className='px-2 border'
        >
          {rightText}
        </Link>
      )}
    </div>
  );
}
