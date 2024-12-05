import { defineThemeConfig } from 'vuepress-theme-plume'
import { navbar } from './navbar'
import { notes } from './notes'

/**
 * @see https://theme-plume.vuejs.press/config/basic/
 */
export default defineThemeConfig({
    logo: 'https://theme-plume.vuejs.press/plume.png',
    // your git repo url
    docsRepo: '',
    docsDir: 'docs',

    appearance: true,

    profile: {
        avatar: 'https://theme-plume.vuejs.press/plume.png',
        name: "lss's blog",
        description: 'blog',
        circle: true,
        location: '广州',
        organization: '',
    },

    navbar,
    notes,
    social: [
        { icon: 'github', link: 'https://github.com/Ljiangyu/lss-vuepress' },
    ],

})
