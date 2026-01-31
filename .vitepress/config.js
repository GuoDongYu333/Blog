export default {
  title: '郭东宇的博客',
  description: '记录技术与生活',
  lang: 'zh-CN',
  ignoreDeadLinks: true,
  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }],
  ],
  themeConfig: {
    nav: [
      { text: '首页', link: '/' },
      { text: 'AI', link: '/blog/ai/' },
      { text: '前端相关', link: '/blog/frontend/' },
      { text: '后端相关', link: '/blog/backend/' },
      { text: '日常琐事', link: '/blog/daily/' },
      { text: '关于', link: '/about' },
    ],
    sidebar: {
      '/blog/': [{ text: '博客总览', link: '/blog/' }],
      '/blog/ai/': [
        { text: 'AI', link: '/blog/ai/' },
        { text: '开篇：AI 主题', link: '/blog/ai/welcome' },
      ],
      '/blog/frontend/': [
        { text: '前端相关', link: '/blog/frontend/' },
        { text: '开篇：前端主题', link: '/blog/frontend/welcome' },
      ],
      '/blog/backend/': [
        { text: '后端相关', link: '/blog/backend/' },
        { text: '开篇：后端主题', link: '/blog/backend/welcome' },
      ],
      '/blog/daily/': [
        { text: '日常琐事', link: '/blog/daily/' },
        { text: '开篇：日常琐事', link: '/blog/daily/welcome' },
      ],
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/GuoDongYu333' },
    ],
    footer: {
      message: '当前明月在，曾照彩云归 🌙 '
    },
  },
}
