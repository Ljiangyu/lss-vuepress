---
title: mysql模糊匹配
createTime: 2024/12/12 17:05:12
permalink: /article/zw0ip1rq/
tags:
  - mysql
  - mysql模糊匹配
  - like
cover:
  url: ../images/mysql/like.jpg
  layout: right
---
>mysql模糊匹配 LIKE 、 RLIKE（或 REGEXP）、 INSTR 函数

<!-- more -->

## like 模糊匹配
LIKE 操作符是最常用的模糊匹配方式，它允许使用通配符 % 和 _ 来匹配字符串中的任意字符。

- %：代表零个、一个或多个任意字符。
- _：代表单个任意字符。
示例
::: tip
``` sql
SELECT * FROM users WHERE name LIKE '张%'; -- 匹配所有以 "张" 开头的名字
SELECT * FROM users WHERE name LIKE '_伟%'; -- 匹配所有第二个字为 "伟" 的名字
``` 
:::
可以使用concat()函数将多个字段拼接成一个字符串进行模糊匹配
::: tip
``` sql
SELECT * FROM users WHERE concat(fristname, secondname) LIKE '%张%'; -- 匹配所有包含 "张" 的名字和年龄
``` 
:::

## 使用 RLIKE 或 REGEXP 进行正则表达式匹配
RLIKE 或 REGEXP 操作符可以用来执行正则表达式匹配，它们支持使用正则表达式中的特殊字符和运算符来匹配字符串。
::: tip
``` sql
SELECT * FROM users WHERE name RLIKE '^[A-Z]'; -- 匹配所有以大写字母开头的名字
SELECT * FROM users WHERE name REGEXP '[0-9]+'; -- 匹配所有包含至少一个数字的字符串
``` 
:::

## 使用 INSTR 函数进行字符串位置匹配
>INSTR 函数用于返回子串在字符串中第一次出现的位置。如果子串不存在，则返回 0。因此，虽然它不是严格意义上的模糊匹配工具，但它可以用来检查一个字符串是否包含另一个字符串，从而实现类似的效果。
::: tip
``` sql
SELECT * FROM users WHERE INSTR(name, '张') > 0; -- 匹配所有包含 "张" 的名字
SELECT * FROM users WHERE INSTR(name, '张') = 3; -- 匹配所有以 "张" 开头的名字
``` 
:::

## 总结
```sql
-- 创建测试表
CREATE TABLE IF NOT EXISTS test_data (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    random_data VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 插入一百万条数据的存储过程
-- 最终插入了17万条数据
DELIMITER //
CREATE PROCEDURE InsertTestData()
BEGIN
    DECLARE i INT DEFAULT 0;
    WHILE i < 1000000 DO
        INSERT INTO test_data (random_data) VALUES (CONCAT('Data ', i));
        SET i = i + 1;
    END WHILE;
END//
DELIMITER ;

-- 调用存储过程开始插入数据
CALL InsertTestData();
```

```sql
SELECT * FROM test_data WHERE random_data LIKE 'Data_01%';
SELECT * FROM test_data WHERE random_data REGEXP '^Data_01%';
SELECT * FROM test_data WHERE INSTR(random_data, '01') > 0;
```
总结
::: tip
instr 函数效率最高，like、regexp 这俩  没测出来
:::


