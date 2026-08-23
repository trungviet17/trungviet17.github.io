import readingTime from 'reading-time';

/**
 * Tính từ `entry.body` chứ không qua remark plugin: trang danh sách không
 * render từng bài nên không có `remarkPluginFrontmatter`, trong khi glob
 * loader luôn giữ sẵn body thô.
 *
 * 220 wpm thay vì mặc định 200: `reading-time` tách từ theo khoảng trắng,
 * mà tiếng Việt viết rời từng âm tiết nên số "từ" đếm được cao hơn thực tế.
 */
export function readingMinutes(body: string): number {
  const prose = body
    .replace(/```[\s\S]*?```/g, '')  // bỏ code block
    .replace(/\$\$[\s\S]*?\$\$/g, '') // bỏ công thức toán
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ''); // bỏ ảnh
  return Math.max(1, Math.round(readingTime(prose, { wordsPerMinute: 220 }).minutes));
}
