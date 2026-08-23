import { getCollection, type CollectionEntry } from 'astro:content';
import { slugify } from './slug';
import { lastModified } from './git';
import { readingMinutes } from './readingTime';
import { SITE } from '@/config';

export type Post = CollectionEntry<'posts'>;

/**
 * Dựng đường dẫn nội bộ. LUÔN dùng helper này thay vì nội suy chuỗi:
 * config đặt `trailingSlash: 'always'`, và Astro không tự sửa các <a href>
 * viết tay — thiếu gạch chéo cuối là GitHub Pages phải 301, tốn một vòng
 * request và làm rò URL không chuẩn tắc vào analytics.
 */
export const href = {
  home: () => '/',
  page: (n: number) => (n <= 1 ? '/' : `/page${n}/`),
  post: (post: Post | string) => `/posts/${typeof post === 'string' ? post : post.id}/`,
  category: (name: string) => `/categories/${slugify(name)}/`,
  tag: (name: string) => `/tags/${slugify(name)}/`,
  series: (name: string) => `/series/${slugify(name)}/`,
  categories: () => '/categories/',
  tags: () => '/tags/',
  seriesIndex: () => '/series/',
  archives: () => '/archives/',
  about: () => '/about/',
  search: () => '/search/',
  feed: () => '/feed.xml',
};

/** Bài đã xuất bản, mới nhất trước. Bài nháp bị ẩn khi build production. */
export async function getPublishedPosts(): Promise<Post[]> {
  const posts = await getCollection('posts', ({ data }) =>
    import.meta.env.PROD ? !data.draft : true,
  );
  return posts.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

/** Bài ghim lên đầu, phần còn lại theo thứ tự thời gian. */
export async function getListedPosts(): Promise<Post[]> {
  const posts = await getPublishedPosts();
  return [...posts.filter((p) => p.data.pinned), ...posts.filter((p) => !p.data.pinned)];
}

export const PAGE_SIZE = SITE.postsPerPage;

export const totalPages = (count: number) => Math.max(1, Math.ceil(count / PAGE_SIZE));

export const pageSlice = (posts: Post[], page: number) =>
  posts.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

/** Gom theo tên hiển thị, khoá bằng slug để "LLM" và "llm" không tách đôi. */
function groupBy(posts: Post[], pick: (p: Post) => readonly string[]) {
  const groups = new Map<string, { name: string; posts: Post[] }>();
  for (const post of posts) {
    for (const value of pick(post)) {
      const key = slugify(value);
      if (!key) continue;
      const existing = groups.get(key);
      if (existing) existing.posts.push(post);
      else groups.set(key, { name: value, posts: [post] });
    }
  }
  return groups;
}

export const groupByCategory = (posts: Post[]) => groupBy(posts, (p) => p.data.categories);
export const groupByTag = (posts: Post[]) => groupBy(posts, (p) => p.data.tags);

/** Chuỗi bài, sắp theo `order` rồi tới ngày. */
export function groupBySeries(posts: Post[]) {
  const groups = groupBy(posts, (p) => (p.data.series ? [p.data.series] : []));
  for (const group of groups.values()) {
    group.posts.sort((a, b) => {
      const byOrder = (a.data.order ?? Infinity) - (b.data.order ?? Infinity);
      return byOrder !== 0 ? byOrder : a.data.date.valueOf() - b.data.date.valueOf();
    });
  }
  return groups;
}

export const sortedGroups = (groups: ReturnType<typeof groupBy>) =>
  [...groups.entries()]
    .map(([slug, g]) => ({ slug, ...g }))
    .sort((a, b) => b.posts.length - a.posts.length || a.name.localeCompare(b.name, SITE.lang));

/** Ngày cập nhật: frontmatter thắng, sau đó tới git. Chỉ dùng khi muộn hơn ngày đăng. */
export function updatedDate(post: Post): Date | undefined {
  const candidate = post.data.updated ?? lastModified(`src/content/posts/${post.filePath?.split('/').pop() ?? ''}`);
  if (!candidate) return undefined;
  return candidate.valueOf() > post.data.date.valueOf() ? candidate : undefined;
}

export const minutesToRead = (post: Post) => readingMinutes(post.body ?? '');

/** Tóm tắt dự phòng khi bài chưa có `description`. */
export function excerpt(post: Post, length = 200): string {
  if (post.data.description) return post.data.description;
  const text = (post.body ?? '')
    .replace(/```[\s\S]*?```/g, '')
    .replace(/\$\$[\s\S]*?\$\$/g, '')
    .replace(/!\[[^\]]*\]\([^)]*\)(\{[^}]*\})?/g, '')
    .replace(/^#{1,6}\s+.*$/gm, '')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/[*_`>#]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  return text.length > length ? `${text.slice(0, length).trimEnd()}…` : text;
}
