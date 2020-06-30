# init-e-ts

快捷易用的脚手架，开箱即用，无需修改

## 项目描述

项目目录：

```
.
├── CHANGELOG.md  项目 ChangeLog
├── README.md  项目描述
├── dist  生成目录（IDE打开的目录）
├── babel.config.js  单测相关配置
├── dtest.config.js  单测相关配置
├── idlConfig.js  IDL 转 TS 脚本文件
├── jest.config.js  单测相关配置
├── package.json  项目配置
├── src  业务源代码
│   ├── __tests__  小程序单测相关文件
│   │   ├── filesForTest  存放小程序单测用例的目录
│   │   │   └── xx.test.js  单测文件
│   │   ├── libs  单测用例常用公共函数
│   │   │   ├── generateTpl.js  页面模版生成器
│   │   │   ├── getAppIns.js  小程序单测入口文件，获取小程序运行时端口
│   │   │   ├── navToPage.js  单测用例常用公共函数
│   │   │   └── routerConfig.js  单测用例常用公共函数
│   │   └── mock  提供单测jsapi和lwp的返回值配置文件
│   │       ├── jsapiMock.js  server运行时对于jsapi的初始mock配置文件，仅支持配置一种返回值
│   │       ├── jsapiMockInit.js  mock相关的init文件，原则上不要改动
│   │       ├── lwpApiMock.js  server运行时对于lwp的初试mock配置文件，仅支持配置一种返回值
│   │       └── lwpResultMock.js  单测用例中使用的api返回值，可以配置多个返回值
│   ├── app.json
│   ├── app.less
│   ├── app.ts  入口文件
│   ├── components  组件目录
│   ├── constants  常量目录（监控，埋点等配置信息都在这里）
│   │   └── config.ts
│   ├── i18nResource  i18n 生成的文案资源目录
│   ├── iconResource  iconfont的资源文件，配置好acss中的iconfont资源后，执行tnpm run update-icon会自动更新
│   │   ├── icon.acss
│   │   └── icon.js
│   ├── idl  本地IDL描述文件
│   │   ├── EduAlbum_interface.idl
│   │   └── EduAlbum_model.idl
│   ├── mock  mock数据配置
│   │   ├── apiMock.ts
│   │   └── lwpApiMock.ts
│   ├── pages  小程序 page
│   │   └── home
│   │       ├── home.axml
│   │       ├── home.json
│   │       ├── home.less
│   │       └── home.ts
│   ├── services  RPC请求服务，根据IDL会自动更新，如果有手动的service相关代码也建议写在这个目录下去引用
│   │   └── dingtalkRpc
│   │       ├── deptGuide.d.ts
│   │       ├── deptGuide.js
│   │       ├── deptGuide.ts
│   │       └── lib
│   ├── styles  公共样式
│   │   └── base.less
│   ├── translationKeys.js  翻译key
│   ├── types  类型定义
│   │   ├── appx.d.ts 全局配置类型申明
│   │   └── common.ts  业务数据模型类型
│   └── utils  工具方法
│       ├── initApp  初始化App方法合集
│       │   ├── index.ts
│       │   ├── initArms.ts  初始化 Arms 配置(应用初始化选择Arms监控时)
│       │   ├── initRetcode.ts  初始化 Retcode 配置(应用初始化选择retCode监控时)
│       │   ├── initDTRpc.ts  初始化 LWP RPC调用
│       │   ├── initI18n.ts  初始化 i18n 国际化
│       │   ├── initIcon.ts  初始化 icon 资源
│       │   └── initJsapi.ts  初始化 Jsapi 相关
│       └── logger  埋点工具
│           ├── arms.ts  (应用初始化选择arms监控时)
│           ├── retcode.ts  (应用初始化选择retCode监控时)
│           └── dtLogger.ts
├── tsconfig.json  TS配置文件
├── tslint.json
└── yarn.lock

```

- src 目录为源码
  - 使用 ts、less 开发
- dist 为编译后的生成的目录
  - **不要修改 dist 目录下的文件**
  - 使用小程序 IDE 打开 dist 目录，用于调试、预览
- __tests__ 为单测目录，禁止删除
  - 任何单测相关的文件都可以放在这个目录下

## 如何运行

### 开始开发（jsapi权限需要再Dbase上申请内部应用）

```bash
# 安装依赖（报错找不到包的，更换一下yarn的源为集团的）
yarn

# 启动应用
yarn start

```

### 开启 MOCK

参考文档： https://yuque.antfin-inc.com/dd-fd/union_jsapi/qmow4g

1. 确认 src/contants/config.ts 下的 MOCK_MODE_ENABLE 为 true , 则为开启 Mock
2. 通过设置 src/mock 目录下的文件，即可实现对应接口 mock 配置

### 单测用例书写

必看文档： 
dtest: https://yuque.antfin-inc.com/docs/share/16e993ae-9ff4-4481-b7da-243e4fdf4ed1?#
可查看文档中的“基础API”，获取更多小程序单测API

jest: https://yuque.antfin-inc.com/ffkr25/nl29su/sl7c57#u9UeO

### 资源更新

``` bash
# 更新 IDL
npm run update-idl

# 更新 i18n 文案
npm run update-18n

# 更新 dingui-icon, 首次更新会提示需要再package.json中进行配置iconfontProjectId参数
npm run update-icon

```

## 业务介绍

补充业务介绍，业务涉及成员等

## 开发资料

- 小程序官方文档 [转送门](https://ding-doc.dingtalk.com/doc#/dev/framework-overview)
- @ali/dingtalk-jsapi：多端统一 JSAPI 文档 [传送门](https://yuque.antfin-inc.com/dd-fd/union_jsapi)
- 单元测试
  - @ali/dtest-eapp：小程序单测框架 单测本地工具
  - 文档 [传送门](https://yuque.antfin-inc.com/docs/share/16e993ae-9ff4-4481-b7da-243e4fdf4ed1?#)
- @ali/ding-mediaid：MediaId 转换库 [传送门](https://npm.alibaba-inc.com/package/@ali/ding-mediaid)
- @ali/dingui-iconfont：小程序中的 Iconfont 资源更新 [传送门](https://npm.alibaba-inc.com/package/@ali/dingui-iconfont)
- @ali/dingui-mini：钉钉官方小程序组件 [传送门](https://dux.dingtalk.com/site/pc#/cate/26/page/181)
- 小程序支持暗夜模式 [传送门](https://yuque.antfin-inc.com/dingtalk-miniprogram/kplflx/wxwf2g)
- @ali/dingtalk-idl-ts：idl 转换为 TypeScript 模块定义的转换工具  [传送门](https://npm.alibaba-inc.com/package/@ali/dingtalk-idl-ts)
- SPM业务埋点库 [转送门](https://npm.alibaba-inc.com/package/@ali/eapp-spm-tracker)
- arms监控（retCode商业化版本，功能更强大）相关资料 [转送门](https://help.aliyun.com/document_detail/103990.html?#title-5e4-xzm-lh8)
- 云构建相关问题参考：https://yuque.antfin-inc.com/me2gl1/ai6yab/tvknlp
