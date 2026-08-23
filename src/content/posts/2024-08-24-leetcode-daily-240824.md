---
title: Lời giải LeetCode Daily 24-08-2024 
date: 2024-08-24
categories: [LeetCode Daily]
tags: [leetcode-hard, dsa]
author:  Trung Viet 
math: true
---


## Giới thiệu 
Thói quen mỗi ngày làm một bài leetcode daily được mình duy trì trong khoảng thời gian dài (vẫn có mấy ngày cheat day). Mình sẽ đặt vấn đề và đưa ra lời giải của mình cho bài toán, lời giải có thể hay hoặc chưa hay, mọi người có thể đưa ra nhận xét và góp ý về email của mình 😊😊😊😊. Bên cạnh đó mình sẽ phân tích thêm về sample code có tốc độ lớn của Leetcode. Bài hôm nay là một bài mức độ khó khá thú vị, mọi người hãy cũng mình giải quyết nó nhé. 

## Bài toán 
**Nguyên văn bài toán số 564 như sau:**

Given a string n representing an integer, return the closest integer (not including itself), which is a palindrome. If there is a tie, return the smaller one.

The closest is defined as the absolute difference minimized between two integers.

Example 1:

Input: n = "123"
Output: "121"
Example 2:

Input: n = "1"
Output: "0"
Explanation: 0 and 2 are the closest palindromes but we return the smallest which is 0.


**Tóm tắt:** 
Bài toán yêu cầu tìm một chuỗi số đối xứng (palindrome) gần nhất với chuỗi số đã được cung cấp (so sánh thông qua hiệu giữa chúng) nếu có 2 số cùng thỏa mãn, lấy số có giá trị nhỏ nhơn 

## Ý tưởng 
Để giải quyết bài toán này, mình đã thử nghiệm với một số trường hợp (thông qua việc xem gợi ý), qua đó mình đã phát hiện được 5 dạng trường hợp như sau: 
- Trường hợp 1: Chuyển đối số ban đầu -> dạng palindrome 
- Trường hợp 2: Chuyển đối số ban đầu -> dạng palindrome -> tăng chữ số ở giữa hoặc cặp số ở giữa lên 1 đơn vị 
- Trường hợp 3: Chuyển đối số ban đầu -> dạng palindrome -> giảm chữ số ở giữa hoặc cặp số ở giữa đi 1 đơn vị 
=> Trường hợp 2 và 3 là cách đơn giản và nhỏ nhất để vẫn giữ nguyên dạng palindrome mà vẫn tạo ra một trường hợp mới 
- Trường hợp 4: Nếu l là số lượng chữ cái trong số ban đầu, khi đó, có thể đáp án l -1 chữ số 9 (1000 -> 999) 
- Trường hợp 5: Nếu l là số lượng chữ cái trong số ban đầu, khi đó, có tể đáp án là 1 + l số 0 + 1 (100001)

Từ đó, mình sẽ xây dựng 5 trường hợp này và tìm giá trị nhỏ nhất thông qua đó. 


## Thuật toán 

Dựa vào ý tưởng trên, mình đã phát triển thuật toán như sau: 
```
   class Solution:
    def nearestPalindromic(self, n: str) -> str:

        # tạo ra chuỗi palindrome từ dãy s ban đầu theo hướng thay đổi giá trị ở nửa dưới
        def create_palindrome(s: str) -> int:
            l = len(s)
            s_list = list(s)
            for i in range(l // 2):
                s_list[l - 1 - i] = s_list[i]
            return int("".join(s_list))

        l = len(n)
        num = int(n)
        candidates = set()

        # Case 1: số palindrome của chính nó
        candidates.add(create_palindrome(n))

        # Case 2: số palindrome có hai hoặc một số ở giữa giảm đi một đơn vị 
        first_half = str(int(n[:(l + 1) // 2]) - 1)
        candidates.add(create_palindrome(first_half + n[(l + 1) // 2:]))

        # Case 3: số palindrome có hai hay một số ở giữa tăng lên một đơn vị 
        first_half = str(int(n[:(l + 1) // 2]) + 1)
        candidates.add(create_palindrome(first_half + n[(l + 1) // 2:]))

        # Case 4: tất các các số đều là 9 
        candidates.add(10 ** (l - 1) - 1)

        # Case 5: các số có dạng là 1000...01
        candidates.add(10 ** l + 1)

        # tìm kiếm giá trị gần nhất 
        candidates.discard(num)  # Remove the number itself if it's a palindrome
        closest_palindrome = min(candidates, key=lambda x: (abs(x - num), x))

        return str(closest_palindrome)
```


## Phân tích 
- Thuật toán có độ phức tạp về thời gian là $$O(1)$$
- Thuật toán có độ phức tạp về bộ nhớ là $$O(1)$$ 
- Thuật toán có tốc độ chạy tương đối nhanh trên lý thuyết, tuy nhiên do cách cài đặt nên chưa thực sự tốt. 

## Kết luận 

Theo mình đây là một bài không cần phải yêu cầu quá nhiều các kỹ năng lập trình, cũng như thành thạo các thuật toán. Điểm mấu chốt của bài toán này đó là việc phải tìm ra được toàn bộ các trường hợp và đây cũng là điều làm bài toán này ở mức khó. Thú thực, ban đầu mình cũng khá bối rối, khi chuyển hướng tiếp cận theo Quy Hoạch động, tuy nhiên dựa vào gợi ý, mình đã tìm được cách này. Đây là một bài toán khá hay và thú vị, nó cho mình thấy đôi khi chỉ cần quan sát cũng có thể giải quyết một vấn đề khó, thay vi ngồi suy nghĩ mãi một cách làm cũ. Chúc mọi người có một ngày mới thật vui vẻ. 