---
title: git修改历史commit
createTime: 2024/12/11 10:54:47
permalink: /article/iy7pxdig/
cover: 
  url: ../images/git/git_message.jpg
  layout: left
tags: 
  - git
  - commit
---
---

> git修改历史commit。
<!-- more -->
---
[[toc]]
# git修改上一次commit
::: info
```
git commit --amend -m "new message"
```
:::
此时会显示一个vim编辑器，修改commit message后保存即可。

# git修改历史commit
::: info
```
## 修改最近第3次commit
git rebase -i HEAD~3
```
:::
此时会显示一个vim编辑器，修改pick为edit即可。<br>
::: info
```
git commit --amend -m "new message"
```
:::
此时会显示一个vim编辑器，修改commit message后保存即可。<br>
::: info
```
git rebase --continue
```
:::
当然git commit --amend -m "new message"、git rebase --continue都会有提示，