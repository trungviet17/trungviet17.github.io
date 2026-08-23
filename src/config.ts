/** Cấu hình toàn site. Mọi chuỗi hiển thị gom về đây để sau này thêm locale là việc đổi object, không phải grep. */
export const SITE = {
  title: 'Trung Việt',
  tagline: 'Welcome to my realm..',
  description:
    'Blog cá nhân của Trung Việt — ghi chép về AI, mô hình ngôn ngữ lớn, toán cho học máy và thuật toán.',
  url: 'https://trungviet17.github.io',
  lang: 'vi-VN',
  locale: 'vi_VN',
  author: 'Trung Việt',
  email: 'gnurt17forworking@gmail.com',
  avatar: '/assets/img/avatar.png',
  ogImage: '/assets/img/avatar.png',
  postsPerPage: 10,
} as const;

export const SOCIAL = [
  { name: 'GitHub', url: 'https://github.com/trungviet17', icon: 'github' },
  { name: 'Facebook', url: 'https://www.facebook.com/gnurt17', icon: 'facebook' },
  {
    name: 'LinkedIn',
    url: 'https://www.linkedin.com/in/trung-vi%E1%BB%87t-374a58277/',
    icon: 'linkedin',
  },
] as const;

export const NAV = [
  { label: 'Bài viết', href: '/' },
  { label: 'Chuyên mục', href: '/categories/' },
  { label: 'Thẻ', href: '/tags/' },
  { label: 'Chuỗi bài', href: '/series/' },
  { label: 'Lưu trữ', href: '/archives/' },
  { label: 'Giới thiệu', href: '/about/' },
] as const;

/**
 * Bình luận qua GitHub Discussions.
 * repoId và categoryId lấy tại https://giscus.app sau khi bật Discussions
 * cho repo và cài giscus app. Đây là định danh công khai, không phải secret.
 */
export const GISCUS = {
  enabled: false, // bật lên sau khi điền repoId và categoryId
  repo: 'trungviet17/trungviet17.github.io',
  repoId: '',
  category: 'Announcements',
  categoryId: '',
  mapping: 'pathname',
  reactionsEnabled: '1',
  lang: 'vi',
} as const;

/** Toàn bộ chuỗi giao diện. */
export const UI = {
  skipToContent: 'Tới nội dung chính',
  home: 'Trang chủ',
  posts: 'Bài viết',
  categories: 'Chuyên mục',
  tags: 'Thẻ',
  series: 'Chuỗi bài',
  archives: 'Lưu trữ',
  about: 'Giới thiệu',
  search: 'Tìm kiếm',
  searchPlaceholder: 'Tìm bài viết...',
  searchEmpty: 'Không tìm thấy bài viết nào.',
  searchDevNotice: 'Tìm kiếm chỉ hoạt động sau khi build. Chạy: npm run build && npm run preview',
  readingTime: (m: number) => `${m} phút đọc`,
  postedOn: 'Đăng ngày',
  updatedOn: 'Cập nhật ngày',
  by: 'bởi',
  toc: 'Mục lục',
  share: 'Chia sẻ bài viết',
  relatedPosts: 'Bài viết liên quan',
  comments: 'Bình luận',
  prevPost: 'Bài trước',
  nextPost: 'Bài sau',
  prevPage: 'Trang trước',
  nextPage: 'Trang sau',
  page: 'Trang',
  backToTop: 'Lên đầu trang',
  theme: { light: 'Sáng', dark: 'Tối', system: 'Theo hệ thống' },
  notFoundTitle: 'Không tìm thấy trang',
  notFoundBody: 'Trang bạn tìm không tồn tại hoặc đã được chuyển đi.',
  backHome: 'Về trang chủ',
  postCount: (n: number) => `${n} bài viết`,
  inSeries: (n: number) => `Chuỗi ${n} bài`,
  seriesPart: (i: number, n: number) => `Phần ${i}/${n}`,
  noPosts: 'Chưa có bài viết nào.',
  allCategories: 'Tất cả chuyên mục',
  allTags: 'Tất cả thẻ',
  allSeries: 'Tất cả chuỗi bài',
} as const;
