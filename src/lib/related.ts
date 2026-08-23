import type { Post } from './posts';
import { slugify } from './slug';

const overlap = (a: readonly string[], b: readonly string[]) => {
  const set = new Set(b.map(slugify));
  return a.filter((v) => set.has(slugify(v))).length;
};

/**
 * Bài liên quan: chung chuyên mục nặng hơn chung thẻ, cùng chuỗi bài được
 * cộng thêm. Hoà điểm thì bài mới hơn thắng.
 */
export function relatedPosts(current: Post, all: Post[], limit = 3): Post[] {
  return all
    .filter((p) => p.id !== current.id)
    .map((post) => {
      let score =
        3 * overlap(current.data.categories, post.data.categories) +
        overlap(current.data.tags, post.data.tags);
      if (current.data.series && post.data.series === current.data.series) score += 1;
      return { post, score };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score || b.post.data.date.valueOf() - a.post.data.date.valueOf())
    .slice(0, limit)
    .map((x) => x.post);
}
