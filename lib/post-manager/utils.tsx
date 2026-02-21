import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';
import { Locale } from '../i18n/config';
import { PostMetadata } from './config';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import remarkGfm from 'remark-gfm';
import rehypePrettyCode from 'rehype-pretty-code';

async function getPostNames() {
  return await fs.readdir(path.join(process.cwd(), 'docs'));
}

async function extractLocalePostNames(postNames: string[], locale: Locale) {
  const mask = await Promise.all(
    postNames.map(async (name) => {
      const locales = await fs.readdir(path.join(process.cwd(), 'docs', name));
      return locales.includes(locale);
    })
  );
  return postNames.filter((_, i) => mask[i]);
}

async function extractPostMetadata(name: string, locale: Locale) {
  const file = await fs.readFile(
    path.join(process.cwd(), 'docs', name, locale, 'post.md'),
    'utf-8'
  );
  const { data } = matter(file);
  return { ...data, slug: name } as PostMetadata;
}

export async function getPosts(postsPerPage: number, page: number, locale: Locale) {
  const postNames = await getPostNames();
  const localePostNames = await extractLocalePostNames(postNames, locale);
  const totalLocalePostsCount = localePostNames.length;

  const localePostsUnsorted = await Promise.all(
    localePostNames.map((name) => extractPostMetadata(name, locale))
  );

  const localePosts = localePostsUnsorted
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice((page - 1) * postsPerPage, page * postsPerPage);

  return { posts: localePosts, totalPostsCount: totalLocalePostsCount };
}

export async function getPostMarkdown(slug: string, locale: Locale) {
  try {
    const file = await fs.readFile(
      path.join(process.cwd(), 'docs', slug, locale, 'post.md'),
      'utf-8'
    );
    const { data, content } = matter(file);
    return { data, content } as { data: PostMetadata; content: string };
  } catch {
    return null;
  }
}

export async function markdownToHtml(markdown: string): Promise<string> {
  const result = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypePrettyCode, {
      theme: 'dracula',
      bypassInlineCode: false,
      defaultLang: {
        inline: 'token',
      },
    })
    .use(rehypeStringify)
    .process(markdown);
  return String(result);
}

export async function getAllPostForSitemap() {
  const postNames = await getPostNames();

  const allPosts = await Promise.all(
    postNames.map(async (name) => {
      const locales = await fs.readdir(path.join(process.cwd(), 'docs', name));
      return { [name]: locales };
    })
  );

  return allPosts;
}
