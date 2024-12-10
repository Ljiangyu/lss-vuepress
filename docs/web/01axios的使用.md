---
title: axios的使用
createTime: 2024/12/10 23:21:13
permalink: /article/m0aaehah/
cover: 
  url: ../.vuepress/public/images/web/web01.jpg
  layout: left
tags:
  - vue
  - axios
  - 前端
---
[[toc]]

> Axios 是一个基于 promise 网络请求库，作用于node.js 和浏览器中。 它是 isomorphic 的(即同一套代码可以运行在浏览器和node.js中)。在服务端它使用原生 node.js http 模块, 而在客户端 (浏览端) 则使用 XMLHttpRequests。

<!-- more -->

## axios的使用

使用 npm:
::: note
$ npm install axios
:::
对于其他的包管理工具，大同小异。

### 一个使用的例子
```js
const axios = require('axios');

// 向给定ID的用户发起请求
axios.get('/user?ID=12345')
  .then(function (response) {
    // 处理成功情况
    console.log(response);
  })
  .catch(function (error) {
    // 处理错误情况
    console.log(error);
  })
  .finally(function () {
    // 总是会执行
  });

// 上述请求也可以按以下方式完成（可选）
axios.get('/user', {
    params: {
      ID: 12345
    }
  })
  .then(function (response) {
    console.log(response);
  })
  .catch(function (error) {
    console.log(error);
  })
  .finally(function () {
    // 总是会执行
  });  

// 支持async/await用法
async function getUser() {
  try {
    const response = await axios.get('/user?ID=12345');
    console.log(response);
  } catch (error) {
    console.error(error);
  }
}
```

### post请求

```js
axios.post('/user', {
    firstName: 'Fred',
    lastName: 'Flintstone'
  })
  .then(function (response) {
    console.log(response);
  })
  .catch(function (error) {
    console.log(error);
  });
```

### form-data请求

#### mutipart/form-data
```js
const {data} = await axios.post('https://httpbin.org/post', {
    firstName: 'Fred',
    lastName: 'Flintstone',
    orders: [1, 2, 3],
    photo: document.querySelector('#fileInput').files
  }, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  }
)
```

#### application/x-www-form-urlencoded
```js
const {data} = await axios.post('https://httpbin.org/post', {
    firstName: 'Fred',
    lastName: 'Flintstone',
    orders: [1, 2, 3]
  }, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
})
```
## 更方便的使用方式
> 可以通过向axios传递相关配置来创建请求，向get或delete请求一样简单

### axios api
```js
// 发送get请求
axios({
  method: 'get',
  url: '/user/12345'
});

// 发送post请求
axios({
  method: 'post',
  url: '/user',
  data: {
    firstName: 'Fred',
    lastName: 'Flintstone'
  }
});
```

### 其他的的请求方法
```js
// 发送put请求
axios({
  method: 'put',
  url: '/user/12345',
  data: {
    name: '<NAME>',
    role: 'admin'
  }
});

// 发送delete请求
axios({
  method: 'delete',
  url: '/user/12345'
});
// 发送多个同时请求
function getUserAccount() {
  return axios.get('/user/12345');
}
function getUserPermissions() {
    return axios.get('/user/12345/permissions');
}
axios.all([getUserAccount(), getUserPermissions()])
  .then(axios.spread(function (acct, perms) {
    // 两个请求现在都执行完成
  }));
```
........



## axios 实例
> 你可以为应用创建一个指定配置的axios实例，在实例有自定义配置后，使用该实例的请求方法发起请求。
```js
const instance = axios.create({
  baseURL: 'https://some-domain.com/api/',
  timeout: 1000,
  headers: {'X-Custom-Header': 'foobar'}
});

instance.get('/user?ID=12345')
  .then(function (response) {
    console.log(response);
  })
  .catch(function (error) {
    console.log(error);
  });
```
### 实例方法
指定的配置将与实例的默认配置合并
- axios#request(config)
- axios#get(url[, config])
- axios#delete(url[, config])
- axios#head(url[, config])
- axios#post(url[, data[, config]])
- axios#put(url[, data[, config]])
- axios#patch(url[, data[, config]])


## axios 常用的请求配置
```js
{
  // `url` 是用于请求的服务器 URL
  url: '/user',

  // `method` 是创建请求时使用的方法
  method: 'get', // 默认是 get

  // 发送的数据
  data: {
    firstName: 'Fred',
    lastName: 'Flintstone'
  },

  // 设置自定义请求头信息
  headers: {'Content-Type': 'application/json'},

  // 设置超时时间
  timeout: 1000,

  // 允许跨域请求携带cookie
  withCredentials: false, // 默认false

  // 定义数据在从服务器中取出时的类型
  responseType: 'json'
}
```


## axios 响应结构
> 在写前端的时候，这边数据一直出问题，看了半天才发现是axios的响应结构嵌套和vuex的问题
```js
{ 
  data: {
    // 从服务器返回的数据
  },
  status: 200, // HTTP状态码
  statusText: 'OK', // HTTP状态信息
  headers: {}, // 服务端返回的头信息
  config: {}, // 为创建请求而做的配置
  request: {} // 用于创建请求的浏览器/XMLHttpRequest 实例
  }
```
## axios 拦截器
> 拦截器在请求或响应被 then 或 catch 处理之前拦截它们，添加自己的业务处理逻辑
> axios拦截器分为请求拦截器和响应拦截器

### 拦截器Demo
```js
import axios from 'axios'
import { Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'

// create an axios instance
const service = axios.create({
    baseURL: '/api', // url = base url + request url
    timeout: 5000 // request timeout
})

// request interceptor
service.interceptors.request.use(
    // 发送请求之前做些什么
    config => {
        console.log("request before");
        if (store.getters.token) {
            const token = getToken();
            if (token) {
                try {
                    // 确保 token 只是一个字符串，并且不是 JSON 对象
                    console.log('Token from storage:', token);
                    config.headers['hr-token'] = token; 
                } catch (e) {
                    console.error('Token encoding error:', e);
                }
            }
        }
        return config;
    },
    error => {
        // do something with request error
        console.log(error) // for debug
        return Promise.reject(error)
    }
)

// response interceptor
service.interceptors.response.use(
    // 处理响应数据之前的处理
    response => {
        console.log('response', response)
        // 逆天错误 todo error
        const { code, data, message } = response.data

        if (code !== 200) {
            Message({
                message: message || 'Error',
                type: 'error',
                duration: 5 * 300
            })
            return Promise.reject(new Error(message || 'Error'))
        } else {
            return response
        }
    },
    error => {
        console.log('err' + error) // for debug
        Message({
            message: error.message,
            type: 'error',
            duration: 5 * 300
        })
        return Promise.reject(error)
    }

)

export default service

```

## 总结
> 平时的开发过程中，axios 是一个非常常用的工具库，它提供了很多方便的功能，比如请求拦截、响应拦截等。在使用 axios 的过程中，需要注意一些细节问题，比如数据格式（尤其是数据嵌套）、错误处理等。








