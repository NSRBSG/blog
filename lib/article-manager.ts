import { locales, Locales } from '@/lib/i18n';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

type Category = 'hobby' | 'study' | 'work';

export interface Metadata {
  date: Date;
  category: Category;
}

interface FrontMatter {
  title: string;
  description: string;
  keywords: string[];
}

export interface ArticleMetadata extends Metadata, FrontMatter {
  slug: string;
}

export class ArticleManager {
  private locale: Locales;

  constructor(locale: Locales) {
    this.locale = locale;
  }

  static getSupportedLanguages(slug: string) {
    const supportedLanguages = fs.readdirSync(
      path.join('public', 'docs', slug)
    );
    const filteredLanguages = locales.filter((locale) =>
      supportedLanguages.includes(locale)
    );
    return filteredLanguages;
  }

  static getArticleFolderNames() {
    return fs.readdirSync(path.join('public', 'docs'));
  }

  static getArticleMetadata(slug: string) {
    const {
      metadata,
    }: { metadata: Metadata } = require(`@/public/docs/${slug}/metadata.ts`);
    return metadata;
  }

  getArticleList(articlesPerPage: number, page: number) {
    const articleFolderNames = ArticleManager.getArticleFolderNames();

    const localeArticleNames = articleFolderNames.filter(
      (articleFolderName) => {
        const locales = fs.readdirSync(
          path.join('public', 'docs', articleFolderName)
        );
        return locales.includes(this.locale);
      }
    );

    const totalArticleCount = localeArticleNames.length;

    const articles = localeArticleNames
      .map((articleFolderName) => {
        const metadata = ArticleManager.getArticleMetadata(articleFolderName);
        return {
          slug: articleFolderName,
          ...metadata,
        };
      })
      .sort((a, b) => b.date.getTime() - a.date.getTime())
      .slice((page - 1) * articlesPerPage, page * articlesPerPage)
      .map((metadata) => {
        const { slug } = metadata;
        const markdown = fs.readFileSync(
          path.join('public', 'docs', slug, this.locale, 'article.md'),
          'utf-8'
        );
        const { data } = matter(markdown);

        return {
          ...metadata,
          ...(data as FrontMatter),
        };
      });

    return { articles, totalArticleCount };
  }

  getArticle(slug: string) {
    try {
      const metadata = ArticleManager.getArticleMetadata(slug);
      const markdown = fs.readFileSync(
        path.join('public', 'docs', slug, this.locale, 'article.md'),
        'utf-8'
      );

      const { data, content } = matter(markdown);

      return {
        ...metadata,
        ...(data as FrontMatter),
        content,
      };
    } catch {
      return null;
      // Error Logging Code
    }
  }
}
