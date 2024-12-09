import { defineNoteConfig, defineNotesConfig } from 'vuepress-theme-plume'

const demoNote = defineNoteConfig({
    dir: 'demo',
    link: '/demo',
    sidebar: ['', 'foo', 'bar'],
})
/**
 * 配置 单个 note
 */
const typescript = defineNoteConfig({
    dir: 'java',
    link: '/java/',
    sidebar: [
        {
            text: '指南',
            prefix: '/guide/java', // 使用 prefix 拼接，可以简写 下面的 items 中的 link 为相对路径
            // items: [
            //     // 可以混用 string 和 SidebarItem
            //     { text: '介绍', link: 'java' },
            // ],
        },
    ]
})

const issues = defineNoteConfig({
    dir: 'issues',
    // dirName: 'manifest',
    link: '/issues/',
    sidebar: [
        {
            text: '首页',
            prefix: '', // 使用 prefix 拼接，可以简写 下面的 items 中的 link 为相对路径
            items: [''],

        },
        {
            text: 'java',
            prefix: '/java/', // 使用 prefix 拼接，可以简写 下面的 items 中的 link 为相对路径
            items: [
                // 可以混用 string 和 SidebarItem
                { text: 'jni & matlab', link: '/issues/sp69umzl/' },
            ],

        },
        {
            text: 'git',
            prefix: '/git/', // 使用 prefix 拼接，可以简写 下面的 items 中的 link 为相对路径
            items: [
                // 可以混用 string 和 SidebarItem
                { text: 'git & 网络问题', link: '/issues/px3juz5s/' },
            ]
        }
    ]
})

const digitalCircuit = defineNoteConfig({
    dir: 'digitalCircuit',
    link: '/digitalCircuit/',
    sidebar: ['', '数字电路基础']
})

export const notes = defineNotesConfig({
    dir: 'notes',
    link: '/',
    notes: [demoNote, typescript, issues, digitalCircuit],
})
