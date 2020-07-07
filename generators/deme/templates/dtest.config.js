const path = require('path');
module.exports = {
  tinyPresets: {
    config1: {
      cwd: __dirname,
      miniprogramRoot: __dirname,
      requestRoot: __dirname + '/utils/request.js',
      compileType: 'mini',
      writeAppConfig: true,
      noErrorOverlay: true,
      component2: true,
      css2: true,
      appxJs: 'https://appx/af-appx.js',
      appxCss: 'https://gw.alipayobjects.com/os/nebulamng/AP_66666692/o93b72kxokb/appx/af-appx.min.css',
      appxWorkerJs: 'https://appx/af-appx.worker.js',
      transformConfig: {
        forbiddenGlobals: [],
        importScripts: ['https://appx/af-appx.worker.js']
      }
    }
  }
}
