---
title: Lời giải LeetCode Daily 06-08-2024 
date: 2024-08-06
categories: [LeetCode Daily]
tags: [leetcode-medium, dsa]
author:  Trung Viet 
math: true
---


## Giới thiệu 
Cũng khoảng hơn một tháng rồi mình chưa có quay lại viết blog, tháng vừa rồi mình cũng hơi bận và cũng hơi hơi lười viết, do đó, hôm nay mình sẽ chính thức quay trở lại và ổn định lại lịch học tập và làm việc, hy vọng mọi người theo dõi các bài viết của mình trong thời gian sắp tới. Mình sẽ mở đầu với chuỗi bài viết về leetcode daily ngày hôm nay. 


## Bài toán 
**Nguyên văn bài toán 3016 như sau:** 

You are given a string word containing lowercase English letters.
Telephone keypads have keys mapped with distinct collections of lowercase English letters, which can be used to form words by pushing them. For example, the key 2 is mapped with ["a","b","c"], we need to push the key one time to type "a", two times to type "b", and three times to type "c" .
It is allowed to remap the keys numbered 2 to 9 to distinct collections of letters. The keys can be remapped to any amount of letters, but each letter must be mapped to exactly one key. You need to find the minimum number of times the keys will be pushed to type the string word.
Return the minimum number of pushes needed to type word after remapping the keys.
An example mapping of letters to keys on a telephone keypad is given below. Note that 1, *, #, and 0 do not map to any letters.

![example](/assets/img/leetcode-daily/2024-08-06-example.png){: w="700" 
h="400" }

**Tóm tắt:**
Bài toán sẽ gồm các ý chính sau: 

1.   Bài toán mô phỏng lại bàn phím điện thoại với một chuỗi nhiều số (không giới hạn số lượng) có thể được encode bằng một số bất kì (một chữ cái chỉ có một số mã hóa), việc lựa chọn các chữ cái thông qua việc ấn vào số được encode theo số lần tương ứng với vị trí của nó trên màn hình (ví dụ số 2 được ấn 2 lần để tạo ra chữ cái 'b')

2.   Bài toán yêu cầu sắp xếp lại các vị trí trên chuỗi số để có số lần nhấn của một chuỗi string cho trước là nhỏ nhất 

![example](/assets/img/leetcode-daily/2024-08-06-example-2.png){: w="700" 
h="400" }


## Ý tưởng 
- Để giải quyết bài toán này, ngay lập tức ta có thể nghĩ ngay tới hướng sử dụng Tham Lam. Mỗi bàn phím sẽ có tổng 8 chữ số để encode. Do đó, nếu các kí tự có số lần lặp rất nhiều được chọn và xếp lên đầu chuỗi số thì khi đó ta chỉ cần thực hiện một lần bấn cho kí tự đó 
- Với ví dụ 1 ở hình trên, word có các kí tự "abcde", nếu ta lần lượt lựa chọn các số 2 3 4 5 6 encode lần lượt cho các số trên thì khi đó, số lần bấm sẽ được giảm tương đối. Ngược lại nếu tại 2 xếp ab tại vị trí 1 và 2, khi đó cần mất 2 lần để bấm giá trị b. 

## Thuật toán 
1. Xây dựng một dictionary (list) để đếm số lần lặp của kí tự trong string đầu vào 
2. Sắp xếp các chuỗi kí tự theo giảm dần số lần lặp và xét mỗi chu kì là 8 (tương ứng với 8 kí tự encode) xếp chúng lần lượt vào các vị trí trên bàn phím. 

**Code mẫu được trình bày như sau** : 
```
    from collections import Counter 


    class Solution:

        # Một key có thể có nhiều letter 
        # Một letter chỉ có trong một key 

        def minimumPushes(self, word: str) -> int:
            counter = Counter(word)
            sorted_counter = sorted(counter.items(), key=lambda x: x[1], reverse = True)
            res = 0 
            for i in range(len(sorted_counter)): 
                res += sorted_counter[i][1] * (i // 8 + 1 )

            return res 
```
**Phân tích:**
1. Thuật toán sử dụng phép sắp xếp do đó có độ phức tạp về thời gian là $$O(NlogN)$$
2. Thuật toán sử dụng dictionary để lưu trữ, do đó, độ phức tạp về không gian là $$O(N)$$ - tương đối lớn 
3. Từ 2 phân tích về bộ nhớ và thời gian trên, có thể cải thiện thuật toán thông qua cải thiện bộ nhớ (thay thế dictionary bằng một list, khi đó, thời gian chạy thuật toán sắp xếp có thể được đảm bảo hơn)

## Kết luận 

Đây là một bài được đánh giá là Medium nhưng mình thấy nó tương đối dễ so với các bài toán khác. Bài toán một lần nữa nhấn mạnh về các phương pháp Tham Lam - một phương pháp đặc thù nhưng tương đối nhanh so với các thuật toán tối ưu. 