import { execFileSync } from 'node:child_process';

/**
 * Các commit trong đợt chuyển từ Jekyll/Chirpy sang Astro. Chúng sửa cả 13
 * bài cùng một ngày nhưng chỉ đổi cú pháp, không đổi nội dung — nếu tính vào
 * thì mọi bài đều mang nhãn "Cập nhật" cùng một ngày, hoàn toàn vô nghĩa với
 * người đọc. Loại theo hash để `git log` vẫn là nguồn chân lý cho MỌI lần sửa
 * về sau, thay vì phải ghi cứng ngày vào frontmatter.
 */
const MIGRATION_COMMITS = new Set([
  'b43e273', // Move content to Astro layout (rename thuần)
  'b4f629a', // Convert post bodies from kramdown to standard Markdown
]);

export interface GitHistory {
  /** Lần sửa nội dung gần nhất, đã bỏ qua rename và các commit migration. */
  date: Date;
  /** Số lần sửa nội dung. 1 nghĩa là đăng xong chưa từng sửa lại. */
  revisions: number;
}

const cache = new Map<string, GitHistory | undefined>();

/**
 * Ngày sửa nội dung gần nhất của một file, lấy từ lịch sử git.
 *
 * `--follow` đi xuyên qua lần đổi tên khi migrate. `--diff-filter=AM` bỏ qua
 * các commit chỉ đổi tên — kể cả commit "change url" hồi 2024-09 vốn là
 * rename R100 chứ không sửa gì.
 *
 * Cần `fetch-depth: 0` trên CI; clone nông sẽ trả về rỗng mà không báo lỗi.
 */
export function gitHistory(relPath: string): GitHistory | undefined {
  if (cache.has(relPath)) return cache.get(relPath);

  let result: GitHistory | undefined;
  try {
    const log = execFileSync(
      'git',
      ['log', '--follow', '--diff-filter=AM', '--format=%h %cI', '--', relPath],
      { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] },
    ).trim();

    const commits = log
      .split('\n')
      .map((line) => line.split(' '))
      .filter(([hash, iso]) => hash && iso && !MIGRATION_COMMITS.has(hash))
      .map(([, iso]) => new Date(iso!))
      .filter((d) => !Number.isNaN(d.valueOf()));

    if (commits[0]) result = { date: commits[0], revisions: commits.length };
  } catch {
    result = undefined;
  }

  cache.set(relPath, result);
  return result;
}
