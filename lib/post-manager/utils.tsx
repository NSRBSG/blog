import fs from 'fs';
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

function getPostNames() {
  return fs.readdirSync(path.join(process.cwd(), 'docs'));
}

function extractLocalePostNames(postNames: string[], locale: Locale) {
  return postNames.filter((name) => {
    const locales = fs.readdirSync(path.join(process.cwd(), 'docs', name));
    return locales.includes(locale);
  });
}

function extractPostMetadata(name: string, locale: Locale) {
  const file = fs.readFileSync(
    path.join(process.cwd(), 'docs', name, locale, 'post.md'),
    'utf-8'
  );
  const { data } = matter(file);
  return { ...data, slug: name } as PostMetadata;
}

export function getPosts(postsPerPage: number, page: number, locale: Locale) {
  const localePostNames = extractLocalePostNames(getPostNames(), locale);
  const totalLocalePostsCount = localePostNames.length;

  const localePosts = localePostNames
    .map((name) => extractPostMetadata(name, locale))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice((page - 1) * postsPerPage, page * postsPerPage);

  return { posts: localePosts, totalPostsCount: totalLocalePostsCount };
}

export function getPostMarkdown(slug: string, locale: Locale) {
  try {
    const file = fs.readFileSync(
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

export function getAllPostForSitemap() {
  const postNames = getPostNames();

  const allPosts = postNames.map((name) => {
    const locales = fs.readdirSync(path.join(process.cwd(), 'docs', name));

    return { [name]: locales };
  });

  return allPosts;
}
