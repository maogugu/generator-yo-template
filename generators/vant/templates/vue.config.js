const path = require('path')
const CssGeneratorPlugin = require('css-generator-plugin')
const CompressionPlugin = require('compression-webpack-plugin')
const PUBLIC_PATH = process.env.VUE_APP_PUBLIC_PATH
const LogInfo = require('log-info-webpack-plugin')
const { version } = require('./package.json')
const gloableColors = require('./src/style/gloableColors.json')
function resolve (dir) {
  return path.join(__dirname, dir)
}
// 基础注入
const cdn = { // 将会注入index.html js 顺序不可乱 注意版本
  css: [
  ],
  js: [
    'https://g.alicdn.com/dingding/dingtalk-jsapi/2.8.33/dingtalk.open.js',
    'https://xfw-bscnym-test.oss-cn-hangzhou.aliyuncs.com/static/js/vue.min.js',
    'https://xfw-bscnym-test.oss-cn-hangzhou.aliyuncs.com/static/js/vue-router.min.js',
    'https://xfw-bscnym-test.oss-cn-hangzhou.aliyuncs.com/static/js/vuex.min.js',
    'https://xfw-bscnym-test.oss-cn-hangzhou.aliyuncs.com/static/js/axios.min.js',
    'https://xfw-bscnym-test.oss-cn-hangzhou.aliyuncs.com/static/js/moment.min.js',
    'https://xfw-bscnym-test.oss-cn-hangzhou.aliyuncs.com/static/js/moment-zh-cn.js',
    'https://xfw-bscnym-test.oss-cn-hangzhou.aliyuncs.com/static/js/lodash.min.js',
    'https://xfw-bscnym-test.oss-cn-hangzhou.aliyuncs.com/static/js/vant.min.js'
    // 'https://xfw-bscnym-online.oss-cn-hangzhou.aliyuncs.com/static/js/province_city_area.js'
  ]
}

module.exports = {
  runtimeCompiler: true,
  devServer: {
    // host: "localhost",
    port: 8080, // 端口号
    https: false, // https:{type:Boolean}
    open: false, // 配置自动启动浏览器
    disableHostCheck: true // 解决127.0.0.1指向其他域名时出现"Invalid Host header"问题
    // proxy: {
    //   '/bscnym': {
    //     target: 'http://172.17.9.148:8000',
    //     changOrigin: true,
    //     pathRewrite: { '^/': '/' }
    //   }
    // }
  },
  publicPath: PUBLIC_PATH,
  outputDir: 'dist', // 项目名
  lintOnSave: true, // 编译警告
  css: {
    loaderOptions: {
      less: {
        modifyVars: {
          hack: `true; @import "${resolve('/src/style/vantTheme.less')}";`
        }
      }
    }
  },
  chainWebpack: config => {
    config.plugin('html') // 注入环境变量
      .tap(args => {
        args[0].cdn = cdn
        return args
      })
      .end()
      .plugin('LogInfo')
      .use(LogInfo, [{
        version
      }])
      .end()
      .plugin('CssGeneratorPlugin')
      .use(CssGeneratorPlugin, [{
        colors: gloableColors, // 颜色配置
        dirPath: 'src', // 需要扫描的目录
        generate: 'src/style/css/auto.css', // 生成文件位置
        type: 'vue', // 项目类型 vue|d-mini-program
        unit: 'px', // 默认单位
        important: true
      }])
    config.resolve.alias
      .set('@', resolve('src'))
    config
      .module
      .rule('eslint')
      .use('eslint-loader')
      .loader('eslint-loader')
      .tap(options => {
        options.fix = true
        return options
      })
    config.module
      .rule('images')
      .use('url-loader')
      .loader('url-loader')
      // 6kb 过于小会导致请求次数变多 影响优化
      // 同时添加css 路径到cdn
      .tap(options => Object.assign(options, {
        limit: 6144
      }))
    config
      .when(process.env.NODE_ENV === 'production',
        config => {
          config.merge({
            externals: {
              vue: 'Vue',
              moment: 'moment',
              'vue-router': 'VueRouter',
              vuex: 'Vuex',
              vant: 'vant',
              axios: 'axios',
              'lodash-es': '_',
              'dingtalk-jsapi': 'dd'
            }
          })
          config.devtool('none')
          config.optimization.minimizer('terser').tap((args) => {
            args[0].terserOptions.compress.drop_console = true // 移除 console.log
            return args
          })
          config
            // 以下是打包依赖分析 push 请关闭 请只在本地使用
            // .plugin('webpack-bundle-analyzer')
            // .use(require('webpack-bundle-analyzer').BundleAnalyzerPlugin)
            // .end()
            .plugin('CompressionPlugin')
            .use(CompressionPlugin)
            .end()
        }
      )
      .when(process.env.NODE_ENV === 'development',
        config => {
          config.devtool('eval-source-map')
        }
      )
  }
}
