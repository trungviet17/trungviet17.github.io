/**
 * Phóng to ảnh bằng <dialog> native — không cần thư viện.
 * Esc, click nền để đóng và bẫy focus đều do trình duyệt lo.
 */
export function initLightbox(root: ParentNode = document) {
  const images = root.querySelectorAll<HTMLImageElement>('.post-figure img');
  if (!images.length) return;

  const dialog = document.createElement('dialog');
  dialog.className =
    'backdrop:bg-black/80 bg-transparent p-0 max-w-[95vw] max-h-[95dvh] m-auto';
  dialog.innerHTML =
    '<img alt="" class="max-w-[95vw] max-h-[95dvh] object-contain rounded-lg cursor-zoom-out">';
  const target = dialog.querySelector('img')!;
  document.body.append(dialog);

  for (const image of images) {
    image.addEventListener('click', () => {
      target.src = image.currentSrc || image.src;
      target.alt = image.alt;
      dialog.showModal();
    });
  }

  // Click ra ngoài ảnh thì đóng.
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog || event.target === target) dialog.close();
  });
}
