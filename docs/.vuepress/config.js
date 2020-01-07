const {
  resolve
} = require('path')

module.exports = {
  base: '/node-cms/',
  locales: {
    '/': {
      lang: 'zh-CN',
      title: 'CMS',
      description: '全栈CMS'
    },
    '/en/': {
      lang: 'en-US',
      title: 'CMS',
      description: 'fullstack cms'
    }
  },
  themeConfig: {
    displayAllHeaders: true,
    sidebarDepth: 2,
    locales: {
      '/': {
        label: '简体中文',
        sidebar: [
          ['/', '启动'],
        ]
      },
      '/en/': {
        label: 'English',
        sidebar: [
          '/'
        ],
        nav: []
      }
    },
    repo: 'peng92055/node-cms',
    docsDir: 'docs',
    editLinks: true,
    sidebar: 'auto'
  },
  configureWebpack: {
    resolve: {
      alias: {
        '@as': resolve(__dirname, './assets'),
        '@imgs': resolve(__dirname, './assets/imgs')
      }
    }
  }
}