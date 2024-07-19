import { ArticleManager } from '@/lib/article-manager';
import { BASE_URL } from '@/lib/constants';
import { locales } from '@/lib/i18n';
import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const articleFolderNames = ArticleManager.getArticleFolderNames();

  // Google's limit is 50,000 URLs per sitemap
  const totalSitemaps = Math.ceil(articleFolderNames.length / 50000);

  return {
    rules: {
      userAgent: '*',
      allow: locales.map((locale) => `/${locale}/`),
      disallow: ['/', '/api/'],
    },
    sitemap: Array.from({ length: totalSitemaps }).map(
      (_, id) => `${BASE_URL}/sitemap/${id}.xml`
    ),
  };
}
