'use strict'

module.exports = {
  test: {
    ngConfig: {
      siteUrl: 'http://cms.loveqiche.com',
      apiUrl: 'http://cms.loveqiche.com/api',
      mUrl: 'http://m.loveqiche.com',
      pcUrl: 'http://www.loveqiche.com',
      staticUrl: 'http://www.loveqiche.com/static',
      storeServer: 'http://store.loveqiche.com',
      imageServer: 'http://7xpw1c.com1.z0.glb.clouddn.com/',
      webSystemApi: 'http://www.loveqiche.com/webapi/system',
      webApi: 'http://www.loveqiche.com/webapi'
    },
    buildConfig: {
      serverDir: "/home/code/jfcms",
      dist: "/home/code/jfcms/client/dist"
    }
  },
  production: {
    ngConfig: {
      siteUrl: 'http://cms.jingfree.com',
      apiUrl: 'http://cms.jingfree.com/api',
      mUrl: 'http://m.jingfree.com',
      pcUrl: 'http://www.jingfree.com',
      staticUrl: 'http://www.jingfree.com/static',
      storeServer: 'http://store.jingfree.com',
      imageServer: 'http://7xpw1c.com1.z0.glb.clouddn.com/',
      webSystemApi: 'http://www.jingfree.com/webapi/system',
      webApi: 'http://www.jingfree.com/webapi'
    },
    buildConfig: {
      serverDir: "/home/code/jfcms_production",
      dist: "/home/code/jfcms_production/client/dist"
    }
  }
}
