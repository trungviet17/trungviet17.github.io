/**
 * Chuyển tên chuyên mục / thẻ / chuỗi bài thành slug URL.
 *
 * Với 13 giá trị đang có, hàm này cho ra ĐÚNG output mà Jekyll đã sinh:
 *   LeetCode Daily    → leetcode-daily
 *   Papers explained  → papers-explained
 *   Math4AI           → math4ai
 *   pretraining dataset → pretraining-dataset
 * Nhờ vậy toàn bộ URL /categories/* và /tags/* hiện tại được giữ nguyên.
 *
 * Khác Jekyll ở chỗ tiếng Việt được bỏ dấu thay vì băm nhỏ: "Toán" cho ra
 * "toan" chứ không phải "to-n". Chưa có URL nào như vậy tồn tại nên lấy
 * hành vi tốt hơn.
 */
export function slugify(input: string): string {
  return input
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
