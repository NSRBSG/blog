import { MetadataRoute } from 'next';
import { getAllPostForSitemap } from '@/lib/post-manager';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const allPosts = await getAllPostForSitemap();
  return [
    {
      url: `${process.env.NEXT_PUBLIC_BASE_URL}`,
      lastModified: new Date(),
      alternates: {
        languages: {
          ko: `${process.env.NEXT_PUBLIC_BASE_URL}/ko`,
          en: `${process.env.NEXT_PUBLIC_BASE_URL}/en`,
          'x-default': `${process.env.NEXT_PUBLIC_BASE_URL}`,
        },
      },
    },
    ...allPosts.map((slug) => {
      return {
        url: `${process.env.NEXT_PUBLIC_BASE_URL}/${Object.keys(slug)[0]}`,
        alternates: {
          languages: Object.values(slug)[0].reduce(
            (acc, locale) => ({
              ...acc,
              [locale]: `${process.env.NEXT_PUBLIC_BASE_URL}/${locale}/${Object.keys(slug)[0]
                }`,
            }),
            {
              'x-default': `${process.env.NEXT_PUBLIC_BASE_URL}/${Object.keys(slug)[0]}`,
            } as Record<string, string>
          ),
        },
      };
    }),
  ];
}
