import { generateRssFeed } from '@/lib/rss';

export async function GET() {
    const feedXml = await generateRssFeed();

    return new Response(feedXml, {
        headers: {
            'Content-Type': 'application/rss+xml; charset=utf-8',
        },
    });
}
