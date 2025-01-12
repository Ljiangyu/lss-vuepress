---
title: 使用docker启动nginx
createTime: 2025/01/12 23:00:50
permalink: /article/d4e21ogi/
tags:
    - nginx
    - docker
    - 运维
---

> 最近一段时间好多事情，实习也是天天加班，累。工作的时候更新前端包，看到使用docker实现，自己也打算记录整理一下。
<!-- more -->
## nginx
### 构建nginx容器
```bash
docker run -d \
  --name web-app \
  -p 1234:80 \   # 端口映射
  -v /docker/nginx/conf:/etc/nginx \
  -v /docker/nginx/logs:/var/log/nginx \
  --registry-mirror=https://docker.mirrors.ustc.edu.cn \
  -v /docker/nginx/html:/usr/share/nginx/html \
  nginx
```
使用docker遇到的一个搞笑的问题,使用python3 -m json.tool 命令处理
```bash
root@lss-virtual-machine:/docker/nginx/conf# cat /etc/docker/daemon.json
{
  "registry-mirrors": [
            "https://docker.m.daocloud.io/",
　　　　　　"https://huecker.io/",
　　　　　　"https://dockerhub.timeweb.cloud",
　　　　　　"https://noohub.ru/",
　　　　　　"https://dockerproxy.com",
　　　　　　"https://docker.mirrors.ustc.edu.cn",
　　　　　　"https://docker.nju.edu.cn",
　　　　　　"https://xx4bwyg2.mirror.aliyuncs.com",
　　　　　　"http://f1361db2.m.daocloud.io",
　　　　　　"https://registry.docker-cn.com",
　　　　　　"http://hub-mirror.c.163.com",
　　　　　　"https://docker.mirrors.ustc.edu.cn"          
  ]
}
root@lss-virtual-machine:/docker/nginx/conf# python3 -m json.tool /etc/docker/daemon.json
Expecting value: line 4 column 1 (char 64)
root@lss-virtual-machine:/docker/nginx/conf# 
```
### nginx配置
```bash
events {
        worker_connections 1024;
}
http { server { listen 80; server_name localhost;
        # 静态文件根目录（容器内的路径）
        # 这里需要注意是容器内的路径
        root /usr/share/nginx/html/dist;
        # 默认首页文件
        index index.html;
        # 启用 gzip 压缩
        gzip on; gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
        # 处理静态文件请求
        location / { try_files $uri $uri/ /index.html;
        }
        # 处理 404 错误
        error_page 404 /404.html; location = /404.html { internal;
        }
        # 处理 50x 错误
        error_page 500 502 503 504 /50x.html; location = /50x.html { internal;
        }
    }
}
```
