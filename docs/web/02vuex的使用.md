---
title: 02vuex的使用
createTime: 2024/12/11 08:59:14
permalink: /article/4iul7otv/
cover:
  url: ../images/web/web02.jpg
---
> Vuex 是一个专为 Vue.js 应用程序开发的状态管理模式 + 库。它采用集中式存储管理应用的所有组件的状态，并以相应的规则保证状态以一种可预测的方式发生变化。
<!-- more -->
[[toc]]
## vuex 的使用

### vuex vue3的使用
目录结构
::: info 目录树
``` bash
store.
│  getters.js
│  index.js
│
└─modules
        app.js
        settings.js
        user.js
```       
::: 
`user.js`
```js 
import { getToken, removeToken, setToken } from '@/utils/auth'
import { login, getUserInfo } from '@/api/user'

const state = {
    token: getToken(),
    userinfo: {
    }
}
const mutations = {
    setToken(state, token) {
    },
    removeToken(state) {
    },
    setUserInfo(state, data) {
    }
}

const actions = {
    async login(context, data) {
    },
    async getInfo(context) {
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}

```

`getter.js`
```js
const getters = {
    sidebar: state => state.app.sidebar,
    device: state => state.app.device,
    token: state => state.user.token,
    userId: state => state.user.userinfo.id,
    //   avatar: state => state.user.avatar,
    name: state => state.user.userinfo.name
}
export default getters
```
`index.js`
```js
import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import app from './modules/app'
import settings from './modules/settings'
import user from './modules/user'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    app,
    settings,
    user
  },
  getters
})

export default store
```
具体使用大概就是这样子的
![还是偷官网的图](/images/web/vuex2.png)

### vuex的理念
状态自管理应用包含以下几个部分：

- 状态，驱动应用的数据源；
- 视图，以声明方式将状态映射到视图；
- 操作，响应在视图上的用户输入导致的状态变化。
  ![偷官网的图](/images/web/vuex.png)


## vuex 的 核心概念
### State

Vuex 使用单一状态树，用一个对象就包含了全部的应用层级状态。至此它便作为一个“唯一数据源 (SSOT)”而存在。这也意味着，每个应用将仅仅包含一个 store 实例。单状态树让我们能够直接地定位任一特定的状态片段，在调试的过程中也能轻易地取得整个当前应用状态的快照。
<br>
state的使用<br>
提供一个初始 state 对象和一些 mutation：
```js
import { createApp } from 'vue'
import { createStore } from 'vuex'

// 创建一个新的 store 实例
const store = createStore({
  state () {
    return {
      count: 0
    }
  },
  mutations: {
    increment (state) {
      state.count++
    }
  }
})

const app = createApp({ /* 根组件 */ })

// 将 store 实例作为插件安装
app.use(store)
```

可以通过 store.state 来获取状态对象，并通过 store.commit 方法触发状态变更：

`store.commit('increment')`

`console.log(store.state.count) // -> 1`
<br>
在 Vue 组件中， 可以通过 this.$store 访问store实例。现在可以从组件的方法提交一个变更：
```js
methods: {
  increment() {
    this.$store.commit('increment')
    console.log(this.$store.state.count)
  }
}
```
通过提交 mutation 的方式，而非直接改变 store.state.count，是因为我们想要更明确地追踪到状态的变化。
这个简单的约定能够让你的意图更加明显，这样你在阅读代码的时候能更容易地解读应用内部的状态改变。
此外，这样也让我们有机会去实现一些能记录每次状态改变，保存状态快照的调试工具。有了它，
我们甚至可以实现如时间穿梭般的调试体验。
由于 store 中的状态是响应式的，在组件中调用 store 中的状态简单到仅需要在计算属性中返回即可。
触发变化也仅仅是在组件的 methods 中提交 mutation。
接下来，我们将会更深入地探讨一些核心概念。让我们先从 State 概念开始。
### Getter



