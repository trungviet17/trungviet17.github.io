// @ts-check
import { defineConfig } from 'astro/config';
import { unified, rehypeHeadingIds } from '@astrojs/markdown-remark';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import expressiveCode from 'astro-expressive-code';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import remarkImageFigure from './src/plugins/remark-image-figure.mjs';
import rehypeKatexSearch from './src/plugins/rehype-katex-search.mjs';

export default defineConfig({
  site: 'https://trungviet17.github.io',

  // Giữ nguyên hình dạng URL của Jekyll: /posts/rlhf/ có gạch chéo cuối.
  trailingSlash: 'always',
  build: { format: 'directory' },

  // Astro 7 mặc định 'jsx' (quy tắc khoảng trắng kiểu JSX) — dễ nuốt mất
  // space giữa các thẻ inline trong prose tiếng Việt.
  compressHTML: true,

  integrations: [
    expressiveCode({
      themes: ['github-light', 'github-dark'],
      // Bám theo attribute do nút chuyển theme đặt, thay vì prefers-color-scheme.
      themeCssSelector: (theme) => `[data-code-theme='${theme.name}']`,
      styleOverrides: { codeFontSize: '0.85rem', borderRadius: '0.5rem' },
    }),
    sitemap({ changefreq: 'weekly' }),
  ],

  vite: { plugins: [tailwindcss()] },

  markdown: {
    // Astro 7 chuyển mặc định sang Sätteri, vốn KHÔNG chạy được plugin
    // remark/rehype. Blog này cần remark-math + rehype-katex và một plugin
    // tự viết cho cú pháp kramdown, nên quay lại pipeline unified.
    processor: unified({
      gfm: true,
      smartypants: false,
      remarkPlugins: [remarkMath, remarkImageFigure],
      rehypePlugins: [
        rehypeHeadingIds,
        [rehypeKatex, { strict: false, throwOnError: false }],
        rehypeKatexSearch,
      ],
    }),
  },
});
