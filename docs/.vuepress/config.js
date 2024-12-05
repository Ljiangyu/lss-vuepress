import { viteBundler } from '@vuepress/bundler-vite'
import { defineUserConfig } from 'vuepress'
import { plumeTheme } from 'vuepress-theme-plume'

export default defineUserConfig({
    // gitpages 访问地址配置
    base: '/lss-vuepress/',
    lang: 'zh-CN',
    title: 'My Vuepress Site',
    description: 'blog',

    bundler: viteBundler(),

    theme: plumeTheme({
        notes: {
            // 声明所有笔记的目录，(默认配置，通常您不需要声明它)
            dir: '/notes/',
            link: '/', // 声明所有笔记默认的链接前缀， 默认为 '/' （默认配置，通常您不需要声明它）
            notes: [
                // 每个笔记都是 `notes` 数组中的一个对象
                {
                    // 声明笔记的目录，相对于 `notes.dir`，这里表示 `notes/typescript` 目录
                    dir: 'java',
                    // 声明笔记的链接前缀，与 `notes.link` 拼接，这里表示 `/typescript/`
                    // 笔记内的所有文章会以 `/typescript/` 作为访问链接前缀。
                    link: '/java/',
                    // 配置 笔记侧边导航栏，用于导航向笔记内的所有文档
                    // 声明为 `auto` 的，将根据目录结构自动生成侧边栏导航
                    sidebar: 'auto'
                },
                // {
                //     dir: 'rust',
                //     link: '/rust/',
                //     sidebar: [
                //         { text: '简介', items: ['foo'] }
                //     ]
                // }
            ]
        },


        // 添加您的部署域名
        // hostname: 'https://your_site_url',

        plugins: {
            /**
             * Shiki 代码高亮
             * @see https://theme-plume.vuejs.press/config/plugins/code-highlight/
             */
            // shiki: {
            // 强烈建议预设代码块高亮语言，插件默认加载所有语言会产生不必要的时间开销
            //   languages: ['shell', 'bash', 'typescript', 'javascript'],
            // },

            /**
             * markdown enhance
             * @see https://theme-plume.vuejs.press/config/plugins/markdown-enhance/
             */
            markdownEnhance: {
                demo: true,
                //   include: true,
                //   chart: true,
                //   echarts: true,
                //   mermaid: true,
                //   flowchart: true,
            },

            /**
             *  markdown power
             * @see https://theme-plume.vuejs.press/config/plugin/markdown-power/
             */
            // markdownPower: {
            //   pdf: true,
            //   caniuse: true,
            //   plot: true,
            //   bilibili: true,
            //   youtube: true,
            //   icons: true,
            //   codepen: true,
            //   replit: true,
            //   codeSandbox: true,
            //   jsfiddle: true,
            //   repl: {
            //     go: true,
            //     rust: true,
            //     kotlin: true,
            //   },
            // },

            /**
             * 评论 comments
             * @see https://theme-plume.vuejs.press/guide/features/comments/
             */
            // comment: {
            //   provider: '', // "Artalk" | "Giscus" | "Twikoo" | "Waline"
            //   comment: true,
            //   repo: '',
            //   repoId: '',
            //   categoryId: '',
            //   mapping: 'pathname',
            //   reactionsEnabled: true,
            //   inputPosition: 'top',
            // },
        },
    }),
})
