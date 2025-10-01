export const postsPerPage = 10;

export interface PostMetadata {
  id: number;
  slug: string;
  title: string;
  description: string;
  categories: string[];
  tags: string[];
  date: string;
  thumbnailUrl: string;
}
