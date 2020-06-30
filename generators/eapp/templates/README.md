# 小程序模板

## 目录介绍

  ```
  ├── assets                            # 静态资源
  │   └── icon                          # iconfont
  │       └── iconfont.acss             # 字体文件样式库
  │   └── image                         # 图片
  │   └── style                         # 部分全局公用的样式库
  │       └── public.acss               # 基础公用样式库
  ├── commons                           # 通用UI组件（建议在js或者md文件内，标明入参及其含义）
  │   └── ...                           # 自定义通用UI组件
  ├── components                        # 业务组件
  │   └── ...                           # 其他自定义业务组件
  ├── pages                             # 页面
  │   └── index                         # 页面
  ├── service                           # 服务
  │   └── api                           # 具体请求
  │   └── request                       # 接口请求的统一封装
  │   └── host                          # 域名
  ├── utils                             # 帮助类
  │   └── config.js                     # 配置
  │   └── dict.js                       # 字典
  │   └── mockData.js                   # 模拟数据
  │   └── tool.js                       # 所有公用方法的统一管理
  ├── app.acss                          # 全局样式
  ├── app.js                            # 小程序启动入口
  ├── app.json                          # 小程序全局配置，如底部，顶部
  ├── package.json                      # 依赖配置
  ├── README.md                         # README

  ```

## 开发参考
- git地址：http://gitlab.forwe.store/center/e-moncie.git
- 开发参考文档：https://ding-doc.dingtalk.com/doc#/dev/yqm3sq
- 开发参考文档：https://wsdebug.dingtalk.com/
- 上传前格式化代码
- 开发和线上不同配置、域名配置等在/utils/config.js中修改
- mock数据在app.js中useMock打开
- 组件开头请写用法
