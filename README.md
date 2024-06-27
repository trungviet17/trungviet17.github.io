
# 1. Introduction (English below) 

Xin chào mọi người, mình là Trung, sinh viên đến từ Viện Trí tuệ nhân tạo (IAI - UET - VNU). Khi bắt đầu viết blog này, mình cũng chỉ là một sinh viên bình thường (không có thành tích gì nội bật lắm), trong quá trình nghiên cứu và tự tìm tòi, mình ghi chép kha khá nhiều ra Notion. Điều này làm mình nảy ra ý tưởng về việc viết blog - blog viết về những thứ mình học, những trải nghiệm của mình về mọi thứ xung quanh 

"Cách tốt nhất để học một điều gì đó là dạy lại cho người khác hiểu" 

Greetings everyone, I'm Trung, a student from the Institute of Artificial Intelligence (IAI - UET - VNU). When I embarked on this blogging journey, I was just an average student with no remarkable accomplishments. During my studies and independent exploration, I accumulated a wealth of notes on Notion. This inspired me to create a blog - a blog dedicated to sharing my learnings and experiences about the world around me.

"The most effective way to learn something is to teach it to others."

# 2. Technical behind blog

Để tạo ra blog này, bạn không cần có những kĩ năng cao trong việc sử dụng javascript, html, css hay bất kì framework liên quan nào khác. Mình sử dụng template có sẵn tại [Chirpy](https://github.com/cotes2020/jekyll-theme-chirpy/). Bạn có thể đọc [tutorial](https://www.youtube.com/watch?v=m1RYsmOMPLs) để có thể custom lại template có sẵn theo ý của mình. Tuy nhiên để hiểu sơ qua về cấu trúc của blog này, mình sẽ giới thiệu qua về jekyll và hosting thông qua tên miền github.io

To create this blog, you don't need any advanced skills in JavaScript, HTML, CSS, or any other related frameworks. I used a ready-made template from [Chirpy](https://github.com/cotes2020/jekyll-theme-chirpy/). You can read the [tutorial](https://www.youtube.com/watch?v=m1RYsmOMPLs) to customize the template to your liking.  However, to get a basic understanding of the structure of this blog, I will introduce you to Jekyll and hosting through a gitHub.io domain.

![intro](/assets/img/intro.png){: w="700" h="400" }


## 2.1 jekyll 
Jekyll là một framework đơn giản để tạo blog, nó cho phép chuyển đổi các file .md thành các trang web tĩnh và blog một cách nhanh chóng. Cấu trúc của [Chirpy](https://github.com/cotes2020/jekyll-theme-chirpy/) template bao gồm những phần sau : 

Jekyll is a simple blog framework that allows you to quickly convert .md files into static websites and blogs. The structure of the [Chirpy](https://github.com/cotes2020/jekyll-theme-chirpy/) template includes the following parts:

```
├── _data                       -> Chứa dữ liệu liên quan tới cá nhân người viết
│   ├── contact.yml             -> Thông tin liên lạc 
│   └── share.yml               -> Thông tin liên quan tới chia sẻ bài viết
├── _plugins                    -> Cách tính năng được viết bằng ruby 
│    ├──post-lastmod-hook.rb    
│    └──watcher-patch.rb
├── assets                      -> Lưu trữ tài nguyên của trang blogs
│   └── img
├── _tabs                       -> Các trang thông tin ở thanh tab 
│   ├── about.md
│   ├── archives.md
│   ├── categories.md
│   └── tags.md
├── _posts                      -> Nơi viết các bài post
│   ├── sample-post.md
│   
└── _config.yml
```

# 3. Content 

Trong blog này, mình sẽ viết chủ yếu về những kiến thức mình học và tìm kiếm được liên quan tới lĩnh vực AI, toán và kinh tế tài chính: 
- **AI**: Mình sẽ viết về kiến thức liên quan tới thuật toán học máy, các mô hình học sâu, tóm tắt nội dung một số paper mới, công nghệ mới mà mình học được 
- **Toán**: Các kiến thức về toán liên quan tới khoa học dữ liệu và AI nói chung như: Giải tích, Thống kê, Xác suất, Đại số tuyến tính, ..... 
- **Kinh tế tài chính**: Mình đang nghiên cứu về Trading, Phân tích kĩ thuật và các giao dịch thuật toán 
- Ngôn ngữ mới, sách, ....  

In this blog, I will mainly write about the knowledge I have learned and found related to the fields of AI, mathematics, and economics and finance:

- **AI**: I will write about knowledge related to machine learning algorithms, deep learning models, summarizing the content of some new papers, and new technologies that I have learned.
- **Mathematics**: Mathematical knowledge related to data science and AI in general such as: Analysis, Statistics, Probability, Linear Algebra, .....
- **Economics and finance**: I am currently researching Trading, Technical Analysis, and algorithmic trading
- New languages, books, ....