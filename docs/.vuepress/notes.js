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
export const notes = defineNotesConfig({
    dir: 'notes',
    link: '/',
    notes: [demoNote, typescript],
})
