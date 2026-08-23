import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getPublishedPosts, excerpt, href } from '@/lib/posts';
import { SITE } from '@/config';

export async function GET(context: APIContext) {
  const posts = await getPublishedPosts();

  return rss({
    title: SITE.title,
    description: SITE.description,
    site: context.site ?? SITE.url,
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.date,
      description: excerpt(post, 280),
      // @astrojs/rss không áp dụng trailingSlash — phải tự thêm gạch chéo.
      link: href.post(post),
      categories: [...post.data.categories, ...post.data.tags],
      author: SITE.email,
    })),
    customData: `<language>${SITE.lang}</language>`,
  });
}
