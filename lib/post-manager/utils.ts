import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { Locale } from '../i18n/config';

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
  return data;
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
