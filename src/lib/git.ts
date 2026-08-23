import { execFileSync } from 'node:child_process';

const cache = new Map<string, Date | undefined>();

/**
 * Ngày sửa nội dung gần nhất của một file, lấy từ lịch sử git.
 *
 * `--follow` để đi xuyên qua lần đổi tên khi migrate từ Jekyll sang Astro.
 * `--diff-filter=AM` để BỎ QUA các commit chỉ đổi tên: nếu không, mọi bài
 * đều mang ngày của commit migration và lịch sử thật bị xoá sạch. Lọc này
 * cũng loại luôn commit "change url" hồi 2024-09 vốn chỉ rename R100.
 *
 * Cần `fetch-depth: 0` trên CI, nếu không clone nông sẽ trả về rỗng.
 */
export function lastModified(relPath: string): Date | undefined {
  if (!cache.has(relPath)) {
    let result: Date | undefined;
    try {
      const out = execFileSync(
        'git',
        ['log', '--follow', '--diff-filter=AM', '-1', '--format=%cI', '--', relPath],
        { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] },
      ).trim();
      if (out) {
        const parsed = new Date(out);
        if (!Number.isNaN(parsed.valueOf())) result = parsed;
      }
    } catch {
      result = undefined;
    }
    cache.set(relPath, result);
  }
  return cache.get(relPath);
}
