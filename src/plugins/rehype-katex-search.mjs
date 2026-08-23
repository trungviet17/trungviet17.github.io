/**
 * KaTeX xuất ra ba lớp cho mỗi công thức: MathML (cho trình đọc màn hình),
 * HTML (để hiển thị), và annotation chứa mã LaTeX gốc. Pagefind index cả ba
 * nên trích đoạn tìm kiếm hiện ra kiểu "Δw\Delta wΔw" hay
 * "importanceimportanceimportance".
 *
 * Đánh dấu lớp MathML là data-pagefind-ignore: chỉ còn lớp hiển thị được
 * index, mà vẫn giữ nguyên MathML cho trình đọc màn hình.
 */
import { visit } from 'unist-util-visit';

const hasClass = (node, name) => {
  const value = node.properties?.className;
  return Array.isArray(value) ? value.includes(name) : value === name;
};

export default function rehypeKatexSearch() {
  return (tree) => {
    visit(tree, 'element', (node) => {
      if (hasClass(node, 'katex-mathml')) {
        (node.properties ??= {})['data-pagefind-ignore'] = 'all';
      }
    });
  };
}
