# <%= name %>

## Description

<%= desc %>

## Author

<% if (author) { %>- <%= author%><%
} %>


## 项目目录

```
.
├── CHANGELOG.md 项目 ChangeLog
├── README.md 项目描述
├── package.json 项目配置
├── app.json
├── app.acss
├── app.js 入口文件
├── __tests__ 小程序单测相关文件
│   │   ├── filesForTest 存放小程序单测用例的目录
│   │   │   └── xx.test.js 单测文件
│   │   ├── libs 单测用例常用公共函数
│   │   │   ├── generateTpl.js 页面模版生成器
│   │   │   ├── getAppIns.js 小程序单测入口文件，获取小程序运行时端口
│   │   │   ├── navToPage.js 单测用例常用公共函数
│   │   │   └── routerConfig.js 单测用例常用公共函数
│   │   └── mock 提供单测jsapi和lwp的返回值配置文件
│   │       ├── jsapiMock.js server运行时对于jsapi的初始mock配置文件，仅支持配置一种返回值
│   │       ├── jsapiMockInit.js mock相关的init文件，原则上不要改动
│   │       ├── lwpApiMock.js server运行时对于lwp的初试mock配置文件，仅支持配置一种返回值
│   │       └── lwpResultMock.js 单测用例中使用的api返回值，可以配置多个返回值
├── pages 小程序 page
│   └── index
│       ├── index.axml
│       ├── index.json
│       ├── index.acss
│       └── index.js
└──  services 服务
    ├── dtLogger.js ut相关日志服务
    └── retcode.js 监控日志服务
    └── translationKeys.js 文案文件

```

- __tests__ 为单测目录，禁止删除
  - 任何单测相关的文件都可以放在这个目录下

### 开始开发

```bash
# 安装依赖
tnpm i

# 启动应用
tnpm start
```

### 单测用例书写

必看文档： 
dtest: https://yuque.antfin-inc.com/docs/share/16e993ae-9ff4-4481-b7da-243e4fdf4ed1?#
可查看文档中的“基础API”，获取更多小程序单测API

jest: https://yuque.antfin-inc.com/ffkr25/nl29su/sl7c57#u9UeO

### 资源更新

``` bash

# 更新 i18n 文案
tnpm run update-18n

```

## 业务介绍

补充业务介绍，业务涉及成员等

## 开发资料

- 小程序官方文档 [转送门](https://ding-doc.dingtalk.com/doc#/dev/framework-overview)
- @ali/dingtalk-jsapi：多端统一 JSAPI 文档 [传送门](https://yuque.antfin-inc.com/dd-fd/union_jsapi)
- 单元测试
  - @ali/dtest-eapp：小程序单测框架 单测本地工具
  - 文档 [传送门](https://yuque.antfin-inc.com/docs/share/16e993ae-9ff4-4481-b7da-243e4fdf4ed1?#)
- 国际化：
  - @ali/dingtalk-i18n
  - @ali/dingtalk-medusa
  - 更新命令："update-18n": "update-i18n ./services/translationKeys.js ./i18nResource -n ${medusaId}"
- eslint
  - 为了保持小程序依赖包尽量小，eslint功能和规则已经从脚手架中移动到 @ali/ding-cr-cli （https://npm.alibaba-inc.com/package/@ali/ding-cr-cli） 工具中
- 云构建参考
  - https://yuque.antfin-inc.com/me2gl1/ai6yab/tvknlp
- @ali/ding-mediaid：MediaId 转换库 [传送门](https://npm.alibaba-inc.com/package/@ali/ding-mediaid)
- @ali/dingui-iconfont：小程序中的 Iconfont 资源更新 [传送门](https://npm.alibaba-inc.com/package/@ali/dingui-iconfont)
- @ali/dingui-mini：钉钉官方小程序组件 [传送门](https://dux.dingtalk.com/site/pc#/cate/26/page/181)
- 小程序支持暗夜模式 [传送门](https://yuque.antfin-inc.com/dingtalk-miniprogram/kplflx/wxwf2g)
- @ali/dingtalk-idl-ts：idl 转换为 TypeScript 模块定义的转换工具  [传送门](https://npm.alibaba-inc.com/package/@ali/dingtalk-idl-ts)
- SPM埋点库 [转送门](https://npm.alibaba-inc.com/package/@ali/eapp-spm-tracker)


