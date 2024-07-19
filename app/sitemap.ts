import { ArticleManager } from '@/lib/article-manager';
import { BASE_URL } from '@/lib/constants';
import { MetadataRoute } from 'next';

export async function generateSitemaps() {
  const articleFolderNames = ArticleManager.getArticleFolderNames();
  const totalSitemaps = Math.ceil(articleFolderNames.length / 50000);

  return Array.from({ length: totalSitemaps }).map((_, index) => ({
    id: index,
  }));
}

export default async function sitemap({
  id,
}: {
  id: number;
}): Promise<MetadataRoute.Sitemap> {
  // Google's limit is 50,000 URLs per sitemap
  const start = id * 50000;
  const end = start + 50000;

  const articleFolderNames = ArticleManager.getArticleFolderNames();
  const articleSlugs = articleFolderNames.slice(start, end);

  return articleSlugs.map((slug) => ({
    url: `${BASE_URL}/${slug}`,
    lastModified: ArticleManager.getArticleMetadata(slug).date.toISOString(),
    alternates: {
      languages: ArticleManager.getSupportedLanguages(slug).reduce(
        (acc, locale) => ({
          ...acc,
          [locale]: `${BASE_URL}/${locale}/${slug}`,
        }),
        {}
      ),
    },
  }));
}
