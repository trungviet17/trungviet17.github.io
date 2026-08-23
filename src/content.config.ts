import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

/** Tiền tố ngày trong tên file — bị cắt khỏi slug để URL không đổi so với Jekyll. */
const DATE_PREFIX = /^\d{4}-\d{2}-\d{2}-/;

const postSchema = z
  .object({
    /* ── Có sẵn trên cả 13 bài migrate từ Chirpy ── */
    title: z.string().trim().min(1),
    date: z.coerce.date(),
    categories: z.array(z.string().trim()).default([]),
    tags: z.array(z.string().trim()).default([]),
    author: z.string().trim().default('Trung Việt'),
    math: z.boolean().default(false),

    /* ── Field mới: đều optional hoặc có default ── */
    updated: z.coerce.date().optional(),
    description: z.string().trim().max(300).optional(),

    cover: z
      .object({
        src: z.string(),
        alt: z.string().default(''),
        width: z.number().int().positive().optional(),
        height: z.number().int().positive().optional(),
      })
      .optional(),

    draft: z.boolean().default(false),
    pinned: z.boolean().default(false),

    /** Gom bài thành chuỗi có thứ tự, ví dụ "LeetCode Daily". */
    series: z.string().trim().optional(),
    order: z.number().int().nonnegative().optional(),

    toc: z.boolean().default(true),
    comments: z.boolean().default(true),

    /** Ghi đè slug thủ công khi muốn tên file và URL khác nhau. */
    slug: z.string().trim().optional(),
  })
  .refine((d) => !d.updated || d.updated >= d.date, {
    message: '`updated` không được sớm hơn `date`',
    path: ['updated'],
  })
  .refine((d) => d.order === undefined || d.series !== undefined, {
    message: '`order` chỉ có nghĩa khi đã đặt `series`',
    path: ['order'],
  });

export type PostData = z.infer<typeof postSchema>;

const posts = defineCollection({
  loader: glob({
    base: './src/content/posts',
    pattern: '**/*.md',
    // Cắt tiền tố ngày để `2025-03-18-rlhf.md` → id `rlhf` → URL /posts/rlhf/
    generateId: ({ entry, data }) => {
      const override = typeof data.slug === 'string' ? data.slug.trim() : '';
      if (override) return override;
      return entry
        .replace(/\.mdx?$/, '')
        .split('/')
        .pop()!
        .replace(DATE_PREFIX, '');
    },
  }),
  schema: postSchema,
});

const pages = defineCollection({
  loader: glob({ base: './src/content/pages', pattern: '**/*.md' }),
  schema: z.object({
    title: z.string().trim().min(1),
    description: z.string().trim().max(300).optional(),
    toc: z.boolean().default(false),
  }),
});

export const collections = { posts, pages };
