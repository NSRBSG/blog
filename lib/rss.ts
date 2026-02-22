import RSS from 'rss';
import { getPosts } from './post-manager';

export async function generateRssFeed() {
    const siteUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.nsrbsg.dev';

    const feedOptions = {
        title: 'Nonsense Blog',
        description: 'Tech blog by Nonsense',
        site_url: siteUrl,
        feed_url: `${siteUrl}/rss.xml`,
        image_url: `${siteUrl}/favicon.ico`,
        pubDate: new Date(),
        copyright: `All rights reserved ${new Date().getFullYear()}, Nonsense`,
    };

    const feed = new RSS(feedOptions);

    const { locales } = await import('./i18n/config');

    for (const locale of locales) {
        const { posts } = await getPosts(1000, 1, locale);

        posts.forEach((post) => {
            feed.item({
                title: `[${locale.toUpperCase()}] ${post.title}`,
                description: post.description,
                url: `${siteUrl}/${locale}/${post.slug}`,
                date: new Date(post.date),
                categories: post.categories,
                author: 'Nonsense',
            });
        });
    }

    return feed.xml({ indent: true });
}
