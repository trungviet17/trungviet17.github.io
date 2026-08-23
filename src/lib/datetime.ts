import { SITE } from '@/config';

/**
 * timeZone: 'UTC' là bắt buộc.
 *
 * YAML parse `date: 2024-07-02` (không giờ, không offset) thành
 * 2024-07-02T00:00:00Z. Format nó ở một múi giờ âm — CI runner chẳng hạn —
 * sẽ lùi về 01/07. Ghim UTC thì ngày hiển thị luôn khớp frontmatter.
 */
const full = new Intl.DateTimeFormat(SITE.lang, {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  timeZone: 'UTC',
});

const monthYear = new Intl.DateTimeFormat(SITE.lang, {
  month: 'long',
  year: 'numeric',
  timeZone: 'UTC',
});

export const formatDate = (date: Date) => full.format(date);
export const formatMonthYear = (date: Date) => monthYear.format(date);

/** Chuỗi cho thuộc tính datetime của <time>, luôn theo UTC. */
export const isoDate = (date: Date) => date.toISOString().slice(0, 10);

export const yearOf = (date: Date) => date.getUTCFullYear();
