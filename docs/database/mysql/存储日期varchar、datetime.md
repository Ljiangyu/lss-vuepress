---
title: 存储日期varchar、datetime
createTime: 2024/12/14 19:13:03
permalink: /article/luqn835b/
tags:
  - mysql
  - mysql数值类型
---

> 使用mysql存储日期时间时，varchar和datetime

<!-- more -->

## 存储日期
在mysql中，存储日期时，varchar和datetime都可以使用。

## 区别
1. varchar需要手动设置长度，而datetime不需要。
2. varchar可以存储自定义格式的日期，而datetime只能存储固定格式的日期。
3. varchar可以存储更长的日期，而datetime只能存储到秒级。
4. varchar存储没有时区信息，而datetime存储时区信息。

## 总结
前两天开发中，看到使用varchar存储日期，就有点疑惑，和同事聊了一下，前端传日期时间类型的数据，后端接受可能会有一些数据上的问题
- 日期时间类型json序列化后，传递的类型，可能与后端期望的类型不一致
   - 如果前端直接发送原生的 JavaScript Date 对象，它在序列化为 JSON 时通常会转换成 ISO 8601 格式的字符串（例如 "2024-12-14T19:16:00Z"）。这种格式在大多数情况下是安全且可靠的，但如果后端期望的是另一种格式，则可能导致解析错误。
 