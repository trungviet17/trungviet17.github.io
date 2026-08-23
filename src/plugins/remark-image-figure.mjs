/**
 * Chuyển cú pháp attribute-list của kramdown (chỉ Jekyll hiểu) sang HTML thật.
 *
 *   ![alt](/a.png){: w="700" h="400" }
 *   *Hình 1: chú thích*
 *
 * → <figure class="post-figure">
 *     <img src="/a.png" alt="alt" width="700" height="400" loading="lazy" decoding="async">
 *     <figcaption>Hình 1: chú thích</figcaption>
 *   </figure>
 *
 * Không có plugin này, remark/GFM coi `{: ... }` là text thường và in nguyên
 * văn ra trang — dính 12/13 bài viết đã migrate từ Chirpy.
 *
 * Regex chịu được cả 4 biến thể có thật trong corpus:
 *   {: w="700" h="400" }     chuẩn
 *   {: w="700"\nh="400" }    xuống dòng giữa chừng
 *   {: w="700" h = "400"}    space quanh dấu =
 *   {:w = "700" h = "400"}   thiếu space sau {:
 */
import { visit } from 'unist-util-visit';

// [\s\S] để nuốt được biến thể xuống dòng; chỉ khớp ở ĐẦU text node.
const ATTR_BLOCK = /^\s*\{:?\s*([\s\S]*?)\}/;
const ATTR_PAIR = /([.#]?[\w-]+)(?:\s*=\s*"([^"]*)")?/g;

/** Chỉ nhận chuỗi trông đúng như attribute list, tránh nuốt nhầm `{...}` trong prose. */
function looksLikeAttrs(body) {
  if (!body.trim()) return false;
  return /^[\s.#\w-]*(=\s*"[^"]*"[\s.#\w-]*)*$/.test(body);
}

function applyAttrs(image, body) {
  const props = (image.data ??= {}).hProperties ??= {};
  for (const [, key, value] of body.matchAll(ATTR_PAIR)) {
    if (key === 'w') props.width = Number(value);
    else if (key === 'h') props.height = Number(value);
    else if (key.startsWith('.')) {
      props.className = [...(props.className ?? []), key.slice(1)];
    } else if (key.startsWith('#')) props.id = key.slice(1);
    else if (value !== undefined) props[key] = value;
  }
}

/** Node còn "thật" sau khi bỏ các text node chỉ chứa khoảng trắng. */
function meaningful(children) {
  return children.filter((c) => c.type !== 'text' || c.value.trim() !== '');
}

export default function remarkImageFigure() {
  return (tree) => {
    // Bước 1: gán attribute cho MỌI ảnh, kể cả ảnh nằm giữa đoạn văn.
    visit(tree, 'image', (image, index, parent) => {
      if (!parent || index === null) return;
      const next = parent.children[index + 1];
      if (next?.type !== 'text') return;

      const match = next.value.match(ATTR_BLOCK);
      if (!match || !looksLikeAttrs(match[1])) return;

      applyAttrs(image, match[1]);
      next.value = next.value.slice(match[0].length);
      if (next.value.trim() === '') parent.children.splice(index + 1, 1);
    });

    // Bước 2: ảnh đứng cuối đoạn (kèm chú thích in nghiêng nếu có) → <figure>.
    // Trong corpus, ảnh thường nối liền dòng văn phía trên mà không có dòng
    // trống, nên nó nằm chung paragraph với prose. Khi đó tách đoạn: phần chữ
    // ở lại <p>, ảnh + chú thích tách ra thành <figure> riêng.
    visit(tree, 'paragraph', (node, index, parent) => {
      if (!parent || index === null || node.data?.hName) return;

      const kids = node.children;
      let end = kids.length;
      while (end > 0 && kids[end - 1].type === 'text' && !kids[end - 1].value.trim()) end--;

      const last = kids[end - 1];
      const caption = last?.type === 'emphasis' ? last : null;
      const imageIndex = caption ? end - 2 : end - 1;
      const image = kids[imageIndex];
      if (image?.type !== 'image') return;

      const props = (image.data ??= {}).hProperties ??= {};
      props.loading ??= 'lazy';
      props.decoding ??= 'async';

      const figure = {
        type: 'paragraph',
        data: { hName: 'figure', hProperties: { className: ['post-figure'] } },
        children: caption ? [image, { ...caption, data: { hName: 'figcaption' } }] : [image],
      };

      // Còn chữ phía trước ảnh thì giữ lại thành một đoạn riêng.
      const before = kids.slice(0, imageIndex);
      const hasProse = before.some((c) => c.type !== 'text' || c.value.trim());
      parent.children.splice(index, 1, ...(hasProse ? [{ ...node, children: before }, figure] : [figure]));
    });
  };
}
