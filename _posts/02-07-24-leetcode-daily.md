---
title: Lời giải LeetCode Daily 01-07-2024 và 02-07-2024
date: 2024-07-02
categories: [LeetCode Daily]
tags: [leetcode-hard, dsa]
author:  Trung Viet 
math: true
---

## Giới thiệu 
Bắt đầu một tháng mới làm việc, chúc mọi người có một tháng làm việc vui vẻ và hiệu quả. Đầu tháng leetcode cũng thật tuyệt vời khi 2 ngày liên tiếp đều là bài Easy, do đó, mình sẽ tổng hợp 2 lời giải vào trong một bài này nhé. 

## Bài toán 1550. Three Consecutive Odds
**Nguyên văn bài toán**: 
Given an integer array arr, return true if there are three consecutive odd numbers in the array. Otherwise, return false. (Cho một dãy số, kiểm tra trong dãy có tồn tại 3 số liên tiếp lẻ)

### Ý tưởng
- Duyệt qua 3 số liên tục trong dãy, kiểm tra xem từng số xem chúng có đều không chia hết cho 2 hay không 

### Cài đặt thuật toán 
```
def threeConsecutiveOdds(self, arr: List[int]) -> bool:
    for i in range(len(arr) - 2): 
        if arr[i] % 2  + arr[i + 1] % 2 +  arr[i + 2] % 2 == 3 : 
            return True 

    return False 
```
**Phân tích**
- Thuật toán có độ phức tạp là $$O(N)$$
- Kiểm tra tính chia hết thông qua phép cộng số dư của 3 phần tử liên tục trong dãy 


## Bài toán 350. Intersection of Two Arrays II

**Nguyên văn bài toán**: Given two integer arrays nums1 and nums2, return an array of their intersection. Each element in the result must appear as many times as it shows in both arrays and you may return the result in any order. (Cho hai dãy số, trả về một dãy là giao của 2 dãy số trên, phần tử xuất hiện đúng số lần trong cả 2 dãy)

### Ý tưởng 
- Khởi tạo một dictionary cho một trong 2 dãy để lưu số lần lặp lại của phần tử trong array đó 
- Duyệt qua dãy còn lại, sử dụng dictionary để kiểm tra xem phần tử trong dãy đó có tồn tại hay không, nếu có, giảm tần suất xuất hiện trong dictionary 

### Cài đặt thuật toán 
```
def intersect(self, nums1: List[int], nums2: List[int]) -> List[int]:
    ans = []
    mark = defaultdict(int)

    for i in nums1: 
        mark[i] += 1 

    for i in nums2: 
        if mark[i] > 0: 
            mark[i] -= 1
            ans.append(i)

    return ans
```

**Phân tích**
- Thuật toán có độ phức tạp $$O(N + M)$$
- Sử dụng dictionary để tối ưu việc tìm kiếm về $$O(1)$$

## Kết luận 
Hai bài này đều có mức độ khó là Easy, do đó việc giải bài toán này cũng không khó lắm 😁😁😁😁