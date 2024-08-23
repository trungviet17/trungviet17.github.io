---
title: Lời giải LeetCode Daily 23-08-2024
date: 2024-08-23
categories: [LeetCode Daily]
tags: [leetcode-medium, dsa]
author:  Trung Viet 
math: true
---


## Giới thiệu 
Cũng lại một khoảng thời gian khá dài mình mới quay trở lại viết các bài blog, khoảng thời gian vừa qua mình đã có những trải nghiệm thú vị cùng với kì thi Hackathon và khám phá được những điều mới mà mình chưa bao giờ thử trước đó. Còn bây giờ, mình sẽ quay lại với việc viết blog và các series còn dang dở, hãy cùng theo dõi các bài viết sắp tới của mình nhé. Còn hôm nay, chúng ta sẽ khởi đầu với bài leetcode daily ngày 23/8/2024

## Bài toán 

**Nguyên văn bài toán 592 như sau:** 

Given a string expression representing an expression of fraction addition and subtraction, return the calculation result in string format.

The final result should be an irreducible fraction. If your final result is an integer, change it to the format of a fraction that has a denominator 1. So in this case, 2 should be converted to 2/1.

Example 1:

Input: expression = "-1/2+1/2"
Output: "0/1"

Example 2:

Input: expression = "-1/2+1/2+1/3"
Output: "1/3"

**Tóm tắt:** 

Bài toán này yêu cầu chúng ta phải giải quyết các phép tính cộng trừ giữa các phân số dưới dạng string (tử số / mẫu số) sao cho phần kết quả là một phân số tối giản


## Ý tưởng 
- Để giải quyết bài toán trên, ngay lập tức ta có thể chia nó thành 2 phần : phần thực hiện lần lượt phép cộng, trừ giữa các phân số và phần làm phân số tối giản sau mỗi lần cộng trừ 
- Một vấn đề đó là phải tách được các phần phân số từ chuỗi input đầu vào. 
Chuỗi input này đều có một format cho trước (+ - tử số / mẫu số ), do đó, ý tưởng nảy ngay trong đầu đó là sử dụng regular expression để phân tách tử số và mẫu số trong chuỗi này. 


## Thuật toán 
1. Sử dụng re để tách lần lượt các tử số và mẫu số có trong input đầu vào thành 2 list tương ứng 
2. Duyệt qua list thực hiện phép cộng với từng phân số, đồng thời mỗi lần thực hiện phép cộng, cần tối giản phân số kết quả 

**Code mẫu được trình bày như sau** : 
```
import re 

class Solution:
    def fractionAddition(self, expression: str) -> str:
        # re tách tử số và mẫu số 
        pattern = r"(-?\d+)/(\d+)"
        matches = re.findall(pattern, expression)

        # phép cộng phân số giữa các phần 
        tu_so = int(matches[0][0]) 
        mau_so = int(matches[0][1])

        for i in range(1, len(matches)): 
            tu_so = tu_so * int(matches[i][1]) + mau_so * int(matches[i][0])
            mau_so = mau_so * int(matches[i][1])

            uscln = math.gcd(tu_so, mau_so)

            tu_so = tu_so // uscln 
            mau_so = mau_so // uscln 

        return str(tu_so) + '/' + str(mau_so)
```

## Phân tích 
- Thuật toán có độ phức tạp về thời gian là $$O(N)$$ 
- Thuật toán có độ phức tạp về không gian là $$O(1)$$ 
## Kết luận 

Đây là một bài được đánh giá là Medium, nếu không sử dụng re, bài toán sẽ tương đối khó để tách lần lượt các kí tự số, phân số ra khỏi chuỗi string. Tuy nhiên với các tiếp cận trên, dù perf không quá tốt nhưng khá dễ hiểu. 