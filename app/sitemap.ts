import { MetadataRoute } from 'next';
import { getAllPostForSitemap } from '@/lib/post-manager';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${process.env.NEXT_PUBLIC_BASE_URL}`,
      lastModified: new Date(),
      alternates: {
        languages: {
          ko: `${process.env.NEXT_PUBLIC_BASE_URL}/ko`,
          en: `${process.env.NEXT_PUBLIC_BASE_URL}/en`,
        },
      },
    },
    ...getAllPostForSitemap().map((slug) => {
      return {
        url: `${process.env.NEXT_PUBLIC_BASE_URL}/${Object.keys(slug)[0]}`,
        alternates: {
          languages: Object.values(slug)[0].reduce(
            (acc, locale) => ({
              ...acc,
              [locale]: `${process.env.NEXT_PUBLIC_BASE_URL}/${locale}/${
                Object.keys(slug)[0]
              }`,
            }),
            {}
          ),
        },
      };
    }),
  ];
}
