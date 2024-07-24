import Card from '@/app/components/card';
import { ArticleManager, ArticleMetadata } from '@/lib/article-manager';
import { locales, Locales } from '@/lib/i18n';
import Header from '@/app/components/header';
import Pagination from '@/app/components/pagination';
import { getDictionary } from '@/app/[lang]/dictionaries';
import { redirect } from 'next/navigation';

export async function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

async function getArticles(
  lang: Locales,
  articlesPerPage: number,
  page: number
) {
  const articleManager = new ArticleManager(lang);
  return articleManager.getArticleList(articlesPerPage, page);
}

export default async function Page({
  params: { lang },
  searchParams: { page },
}: {
  params: { lang: Locales };
  searchParams: { page?: string };
}) {
  const dictionary = await getDictionary(lang);
  if (!dictionary) return redirect('/');

  const articlesPerPage = 10;
  const { articles, totalArticleCount } = await getArticles(
    lang,
    articlesPerPage,
    Number(page ?? 1)
  );

  return (
    <>
      <Header language={lang} />
      <main className='flex flex-col flex-1'>
        <div className='flex flex-col flex-1 items-center mx-2'>
          {articles.map((article: ArticleMetadata) => (
            <article
              className='flex flex-col items-center w-full'
              key={article.slug}
            >
              <Card
                href={`/${lang}/${article.slug}`}
                title={article.title}
                description={article.description}
                date={article.date.toLocaleDateString(lang, {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              />
            </article>
          ))}
          <Pagination
            currentPage={Number(page ?? 1)}
            perPage={articlesPerPage}
            totalItem={totalArticleCount}
            leftText={dictionary.previous}
            rightText={dictionary.next}
          />
        </div>
      </main>
    </>
  );
}
