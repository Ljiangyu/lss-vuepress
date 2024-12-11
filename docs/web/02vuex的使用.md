---
title: vuex的使用
createTime: 2024/12/11 08:59:14
permalink: /article/4iul7otv/
cover:
  url: ../images/web/web02.jpg
tags:
  - vuex
  - vue
  - 前端
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
**在 Vue 组件中， 可以通过 this.$store 访问store实例**。现在可以从组件的方法提交一个变更：
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
此外，这样也让我们有机会去实现一些能记录每次状态改变，保存状态快照的调试工具。由于 store 中的状态是响应式的，在组件中调用 store 中的状态简单到仅需要在计算属性中返回即可。触发变化也仅仅是在组件的 methods 中提交 mutation。
#### 在vue组件中获取state的两种方式
```js
const Counter = {
  template: `<div>{{ count }}</div>`,
  computed: {
    count () {
      return this.$store.state.count
      // return store.state.count
    }
  }
}
```
mapState 辅助函数 built-in 帮助我们生成计算属性，以避免重复书写：
<br>

```js
import { mapState } from 'vuex'
export default {
    computed: {
        ...mapState(['count'])
    }
}
import { mapState } from 'vuex'
export default {
    computed: mapState({
        count: state => state.count,
        // count: 'count'
    })
}
```


### Getter
> getter 用来获取state中的数据允许添加一些逻辑

getter 接收 state 作为第一个参数：
```js
const store = createStore({
    state: {
        todos: [
            { id: 1, text: '...', done: true },
            { id: 2, text: '...', done: false }
        ]
    },
    getters: {
        doneTodos: state => {
            return state.todos.filter(todo => todo.done)
        }
        doneTodosCount: (state, getters) => {
            return getters.doneTodos.length
        }
    }
})
```

在组件中使用：
```js
computed: {
  doneTodosCount () {
    return this.$store.getters.doneTodosCount
  }
  doneTodos () {
    return this.$store.getters.doneTodos
  }
}
```
#### 通过属性访问，也可以使用 this.$store.getters 访问：

```js
console.log(this.$store.getters.doneTodosCount)
console.log(this.$store.getters.doneTodos)
```
Getter 也可以接受其他 getter 作为第二个参数：
```js
getters: {
  // ...
  doneTodosCount (state, getters) {
    return getters.doneTodos.length
  }
}
```
::: note
注意，getter 在通过属性访问时是作为 Vue 的响应式系统的一部分缓存其中的。
:::

#### 通过方法访问
你也可以通过让 getter 返回一个函数，来实现给 getter 传参。在你对 store 里的数组进行查询时非常有用。
```js
getters: {
  // ...
  getTodoById: (state) => (id) => {
    return state.todos.find(todo => todo.id === id)
  }
}
``` 
`store.getters.getTodoById(2) // -> { id: 2, text: '...', done: false }`
注意，getter 在通过方法访问时，每次都会去进行调用，而不会缓存结果。
### mapGetters 辅助函数
mapGetters 辅助函数仅仅是将 store 中的 getter 映射到局部计算属性：
```js
import { mapGetters } from 'vuex'
export default {
    computed: {
        ...mapGetters([
            'doneTodosCount',
            'anotherGetter',
            // ...
        ])
    }
}
```

### Mutation
更改 Vuex 的 store 中的状态的唯一方法是提交 mutation。Vuex 中的 mutation 非常类似于事件：每个 mutation 都有一个字符串的事件类型 (type)和一个回调函数 (handler)。这个回调函数就是我们实际进行状态更改的地方，并且它会接受 state 作为第一个参数：
```js
const store = createStore({
  state: {
    count: 1
  },
  mutations: {
    increment (state) {
      // 变更状态
      state.count++
    }
  }
})
```
你不能直接调用一个 mutation 处理函数。这个选项更像是事件注册：“当触发一个类型为 increment 的 mutation 时，调用此函数。”要唤醒一个 mutation 处理函数，你需要以相应的 type 调用 store.commit 方法：

`store.commit('increment')`
对于mutation携带的参数称为payload

### actions
actions 类似于 mutation，不同在于：
1. Action 提交的是 mutation，而不是直接变更状态。
2. Action 可以包含任意异步操作。

Action 函数接受一个与 store 实例具有相同方法和属性的 context 对象：
```js
const store = createStore({
    state: {
        count: 0
    },
    mutations: {
        increment (state) {
            state.count++
        }
    },
    actions: {
        increment (context) {
            context.commit('increment')
        }
        incrementAsync ({ commit }) {
            setTimeout(() => {
                commit('increment')
            }, 1000)
        }
    }
})
```
Action 函数接受一个与 store 实例具有相同方法和属性的 context 对象，因此你可以调用 context.commit 提交一个 mutation，或者通过 context.state 和 context.getters 来获取 state 和 getters。在大多数情况下，我们会在 action 中调用这个异步函数。
action 通过 store.dispatch 方法触发：
```js
store.dispatch('incrementAsync')
``` 
### Module




