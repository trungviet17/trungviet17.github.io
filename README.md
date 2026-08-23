# trungviet17.github.io

Blog cá nhân của Trung Việt — <https://trungviet17.github.io>

Xây bằng [Astro](https://astro.build) + TypeScript + Tailwind CSS, tự viết toàn bộ
component (không dùng theme có sẵn), deploy tĩnh lên GitHub Pages.

## Viết bài mới

Tạo một file `.md` trong `src/content/posts/` theo tên `YYYY-MM-DD-slug.md`:

```markdown
---
title: Tiêu đề bài viết
date: 2026-08-23
categories: [LLM]
tags: [llama, fine-tuning]
math: true
description: Một câu tóm tắt, dùng cho SEO và RSS.
---

## Mở đầu

Nội dung viết bằng Markdown chuẩn (GFM).
```

**URL của bài lấy từ tên file sau khi cắt tiền tố ngày** — `2026-08-23-rlhf.md`
sẽ nằm ở `/posts/rlhf/`. Đổi tên file là đổi URL.

### Các trường frontmatter

| Trường | Bắt buộc | Mặc định | Ý nghĩa |
|---|---|---|---|
| `title` | ✅ | — | Tiêu đề |
| `date` | ✅ | — | Ngày đăng, `YYYY-MM-DD` |
| `categories` | | `[]` | Chuyên mục, sinh ra `/categories/<slug>/` |
| `tags` | | `[]` | Thẻ, sinh ra `/tags/<slug>/` |
| `description` | | — | Tóm tắt cho SEO/OG/RSS. Không có thì tự cắt từ nội dung |
| `math` | | `false` | Bật KaTeX cho bài |
| `author` | | `Trung Việt` | |
| `updated` | | từ git | Ngày cập nhật. Bỏ trống thì lấy từ lịch sử git |
| `cover` | | — | `{ src, alt, width, height }` — ảnh cho thẻ OpenGraph |
| `series` | | — | Gom bài thành chuỗi, ví dụ `LeetCode Daily` |
| `order` | | — | Thứ tự trong chuỗi (cần có `series`) |
| `pinned` | | `false` | Ghim lên đầu trang chủ |
| `draft` | | `false` | Ẩn khi build production |
| `toc` | | `true` | Hiện mục lục |
| `comments` | | `true` | Hiện khung bình luận |
| `slug` | | tên file | Ghi đè URL thủ công |

Schema được kiểm tra lúc build bằng Zod (`src/content.config.ts`) — sai trường
nào là build báo lỗi ngay, không phải đợi xem trang mới biết.

### Ảnh

Bỏ ảnh vào `public/assets/img/` rồi tham chiếu bằng đường dẫn tuyệt đối:

```markdown
![mô tả ảnh](/assets/img/llm/rlhf/so-do.png)
*Hình 1: chú thích ảnh*
```

Ảnh đứng riêng một dòng sẽ tự được bọc `<figure>`; dòng in nghiêng ngay sau nó
trở thành `<figcaption>`. Ảnh cũng tự có `loading="lazy"` và bấm vào là phóng to.

Cú pháp `{: w="700" h="400" }` kiểu Jekyll cũ vẫn được hỗ trợ (xem
`src/plugins/remark-image-figure.mjs`), nhưng bài mới nên đặt kích thước bằng
CSS thay vì viết vào Markdown.

### Công thức toán

Đặt `math: true` rồi dùng `$...$` cho công thức trong dòng và `$$` trên dòng
riêng cho công thức khối:

```markdown
Độ phức tạp là $O(n \log n)$.

$$
W = w + \Delta w
$$
```

⚠️ `$$ ... $$` viết gọn trên **một dòng** sẽ render thành công thức *trong dòng*,
không phải công thức khối. Muốn khối thì phải xuống dòng như trên.

## Chạy tại máy

```bash
npm install
npm run dev      # http://localhost:4321

npm run build    # build + tạo index tìm kiếm
npm run preview  # xem thử bản build
```

Tìm kiếm chỉ hoạt động sau khi build (Pagefind index thư mục `dist/`), nên phải
`npm run build && npm run preview` mới thử được, `npm run dev` thì không.

Sau khi sửa file trong `src/plugins/`, xoá cache trước khi build lại:
`rm -rf .astro node_modules/.vite`.

## Cấu trúc

```
src/
  content/posts/     bài viết .md
  content/pages/     trang tĩnh (about)
  content.config.ts  schema frontmatter
  config.ts          cấu hình site + toàn bộ chuỗi giao diện
  pages/             route
  components/        component giao diện
  layouts/           bố cục trang
  lib/               helper (slug, ngày tháng, thời gian đọc, git)
  plugins/           remark plugin
public/assets/img/   ảnh
```

## Bình luận

Khung bình luận dùng [giscus](https://giscus.app) (GitHub Discussions), mặc định
đang **tắt**. Để bật: bật Discussions cho repo, cài giscus app, lấy `repoId` và
`categoryId` tại giscus.app rồi điền vào `GISCUS` trong `src/config.ts` và đặt
`enabled: true`.

## Deploy

Push lên `main` là GitHub Actions tự build và deploy
(`.github/workflows/deploy.yml`). Không có branch `gh-pages` — site được đẩy
thẳng lên Pages dưới dạng artifact.

## Giấy phép

Mã nguồn theo giấy phép [MIT](LICENSE). Nội dung bài viết thuộc về tác giả.
