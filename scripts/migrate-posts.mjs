/**
 * Chuyển 13 bài viết từ cú pháp Jekyll/kramdown sang Markdown chuẩn (GFM).
 * Chạy MỘT LẦN, ngay sau commit rename, rồi xoá file này.
 *
 *   node scripts/migrate-posts.mjs
 *
 * Toàn bộ thay đổi là cơ học và tất định — thứ đem đi review là `git diff`
 * mà nó sinh ra, không phải bản thân script.
 */
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const POSTS = 'src/content/posts';

/** Mô tả ngắn cho SEO / OpenGraph / RSS, viết dựa trên nội dung từng bài. */
const DESCRIPTIONS = {
  'leetcode-daily-280624': 'Lời giải bài LeetCode Daily 28-06-2024 về đồ thị và sắp xếp tham lam, kèm phân tích độ phức tạp.',
  'leetcode-daily-290624': 'Lời giải bài LeetCode Daily 29-06-2024 tìm tổ tiên của mọi node trong đồ thị có hướng bằng DFS.',
  'leetcode-daily-300624': 'Lời giải bài LeetCode Daily 30-06-2024 sử dụng cấu trúc dữ liệu Union Find.',
  'linear-algebra-intro': 'Mở đầu series Math4AI: đại số tuyến tính thực chất nghiên cứu điều gì, và nó được ứng dụng ra sao trong xử lý ảnh và hệ thống gợi ý.',
  'leetcode-daily-020724': 'Lời giải hai bài LeetCode Daily 01-07-2024 và 02-07-2024 về mảng và hash map.',
  'leetcode-daily-050724': 'Lời giải bài LeetCode Daily 05-07-2024 thao tác trên danh sách liên kết.',
  'leetcode-daily-060824': 'Lời giải bài LeetCode Daily 06-08-2024 đếm tần suất ký tự bằng Counter.',
  'leetcode-daily-230824': 'Lời giải bài LeetCode Daily 23-08-2024 xử lý chuỗi bằng biểu thức chính quy.',
  'leetcode-daily-240824': 'Lời giải bài LeetCode Daily 24-08-2024 tìm số palindrome gần nhất.',
  'llm-lora-qlora-170924': 'Giải thích LoRA và QLoRA: hai kỹ thuật fine-tuning hiệu quả tham số cho mô hình ngôn ngữ lớn.',
  'llm-llama-architecture-121024': 'Phân tích kiến trúc mô hình Llama: RMSNorm, RoPE, SwiGLU và Grouped Query Attention.',
  rlhf: 'RLHF - Reinforcement Learning from Human Feedback: ba giai đoạn huấn luyện LLM, reward model và thuật toán PPO.',
  'paper-explained-01': 'Papers Explained 01: bộ dữ liệu pretraining Dolma và quy trình xử lý dữ liệu quy mô lớn.',
};

/** Nhóm bài thành series có thứ tự. */
const SERIES = {
  'leetcode-daily-280624': ['LeetCode Daily', 1],
  'leetcode-daily-290624': ['LeetCode Daily', 2],
  'leetcode-daily-300624': ['LeetCode Daily', 3],
  'leetcode-daily-020724': ['LeetCode Daily', 4],
  'leetcode-daily-050724': ['LeetCode Daily', 5],
  'leetcode-daily-060824': ['LeetCode Daily', 6],
  'leetcode-daily-230824': ['LeetCode Daily', 7],
  'leetcode-daily-240824': ['LeetCode Daily', 8],
  'linear-algebra-intro': ['Math4AI', 1],
  'paper-explained-01': ['Papers Explained', 1],
};

/** YAML cần nháy kép khi giá trị mở đầu bằng ký tự đặc biệt hoặc chứa `: `. */
const quote = (s) => (/^[\s>|@`&*!%#{}[\],]|: |\s$|^$/.test(s) ? JSON.stringify(s) : s);

const stats = { attrs: 0, fences: 0, math: 0, sigma: 0, tables: 0 };

function migrateFrontmatter(raw, slug) {
  const lines = raw.split('\n');
  const out = [];

  for (const line of lines) {
    if (/^title:/.test(line)) {
      out.push(`title: ${quote(line.replace(/^title:\s*/, '').trim().replace(/^"(.*)"$/, '$1'))}`);
    } else if (/^author:/.test(line)) {
      out.push('author: Trung Việt'); // chuẩn hoá "Trung Viet " → có dấu
    } else {
      out.push(line);
    }
  }

  const description = DESCRIPTIONS[slug];
  if (description && !raw.includes('description:')) out.push(`description: ${quote(description)}`);

  const series = SERIES[slug];
  if (series && !raw.includes('series:')) {
    out.push(`series: ${quote(series[0])}`);
    out.push(`order: ${series[1]}`);
  }

  return out.filter((l, i, a) => l !== '' || i !== a.length - 1).join('\n');
}

function migrateBody(body, slug) {
  let s = body;

  // 1. Chuẩn hoá attribute list kramdown về đúng một dạng.
  //    Bốn biến thể có thật: chuẩn / xuống dòng / space quanh `=` / thiếu space sau `{:`.
  s = s.replace(/\{:?\s*w\s*=\s*"(\d+)"\s+h\s*=\s*"(\d+)"\s*\}/gs, (_, w, h) => {
    stats.attrs++;
    return `{: w="${w}" h="${h}" }`;
  });

  // 2. Gán ngôn ngữ cho fence mở. Đã kiểm thủ công: cả 11 block đều là Python.
  let inBlock = false;
  s = s
    .split('\n')
    .map((line) => {
      if (!/^\s*```/.test(line)) return line;
      inBlock = !inBlock;
      if (inBlock && /^\s*```\s*$/.test(line)) {
        stats.fences++;
        return line.replace(/```\s*$/, '```python');
      }
      return line;
    })
    .join('\n');

  // 3. `$$ ... $$` trên một dòng bị micromark parse thành math INLINE.
  //    MathJax của Chirpy render nó dạng display → bung ra 3 dòng.
  s = s.replace(/^[ \t]*\$\$[ \t]*(.+?)[ \t]*\$\$[ \t]*$/gm, (_, expr) => {
    stats.math++;
    return `$$\n${expr.trim()}\n$$`;
  });

  // 4. KaTeX với strict:false vẫn render được σ, nhưng \sigma mới là cách đúng.
  if (slug === 'rlhf') {
    s = s.replace(/σ/g, () => {
      stats.sigma++;
      return '\\sigma ';
    });
  }

  // 5. Bảng thiếu dòng phân cách: kramdown chấp nhận, GFM thì không.
  s = s.replace(/^(\| Biến \| Vai trò \|)\n(?!\|\s*-)/m, (_, header) => {
    stats.tables++;
    return `${header}\n| --- | --- |\n`;
  });

  return s;
}

function migrate(path, slug) {
  const text = readFileSync(path, 'utf8');
  const match = text.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) throw new Error(`Không tách được frontmatter: ${path}`);

  const [, frontmatter, body] = match;
  const next = `---\n${migrateFrontmatter(frontmatter, slug)}\n---\n${migrateBody(body, slug)}`;
  if (next !== text) writeFileSync(path, next);
  return next !== text;
}

let changed = 0;
for (const file of readdirSync(POSTS).filter((f) => f.endsWith('.md'))) {
  const slug = file.replace(/^\d{4}-\d{2}-\d{2}-/, '').replace(/\.md$/, '');
  if (migrate(join(POSTS, file), slug)) changed++;
}

// Trang about dùng chung cú pháp ảnh của kramdown.
const about = 'src/content/pages/about.md';
const aboutText = readFileSync(about, 'utf8');
const [, aboutFm, aboutBody] = aboutText.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
writeFileSync(
  about,
  `---\ntitle: Giới thiệu\ndescription: ${quote('Đôi lời về Trung Việt và blog này.')}\n---\n${migrateBody(aboutBody, 'about')}`,
);
void aboutFm;

console.log(`Đã sửa ${changed}/13 bài + about.md`);
console.table(stats);
