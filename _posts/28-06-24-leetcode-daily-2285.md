---
title: Lời giải LeetCode Daily 28-06-2024 
date: 2023-06-01 20:14 +0300
categories: [LeetCode Daily]
tags: [leetcode, dsa]
author:  Trung Viet 
---



# Giới thiệu 
- Đây là bài đầu tiên trong series lời giải leetcode daily của mình. Thói quen mỗi ngày làm một bài leetcode daily được mình duy trì trong khoảng thời gian dài (vẫn có mấy ngày cheat day). Mình sẽ đặt vấn đề và đưa ra lời giải của mình cho bài toán, lời giải có thể hay hoặc chưa hay, mọi người có thể đưa ra nhận xét và góp ý về email của mình 😊😊😊😊


# Bài toán
- Nguyên văn bài toán số 2285 như sau:

> You are given an integer n denoting the number of cities in a country. The cities are numbered from 0 to n - 1.You are also given a 2D integer array roads where roads[i] = [ai, bi] denotes that there exists a bidirectional road connecting cities ai and bi. You need to assign each city with an integer value from 1 to n, where each value can only be used once. The importance of a road is then defined as the sum of the values of the two cities it connects.Return the maximum total importance of all roads possible after assigning the values optimally.

- Mình có thể tóm tắt lại bài toán thành những ý sau : 
1. Một array **roads** biểu 