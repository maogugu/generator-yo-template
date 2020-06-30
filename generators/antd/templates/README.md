#### 本项目采用vue-cli 4 搭建  使用全局样式库 全局api 全局工具库
#### 请花费十分钟阅读说明 提高你的开发效率 提高项目的可维护性
***

### 1. 目录说明
```
  ├─assets            # 静态资源 
  │  └─img 
  ├─components        # 组件库
  │  └─global         # 全局组件 <放入后不需要注册也不需要引入>
  ├─decorator         # 装饰器
  ├─filter            # 过滤器
  ├─http              # 网络请求
  ├─layouts           # layout文件
  ├─plugins           # 插件库 如需要引入第三方组件等 <推荐使用cdn>
  ├─router            # 路由
  ├─store             # vuex
  │  └─modules        # vuex 模块
  ├─style             # 样式
  │  ├─css            # css 文件
  │  └─sass           # sass 工具库样式
  ├─utils             # 工具库目录
  └─views             # 页面文件
```
### 2. 项目配置
  + 使用技术栈  vue 全家桶
  + 关闭vue esm 错误提示 (请注意你的代码标准哦!)
  + 代码格式化 eslint standard标准  [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)
  + 网络请求使用 axios 
  + 本地存储使用 session (钉钉环境)
  + 高阶函数库使用 lodash
  + 时间处理器 moment
  + 数字精确计算 decimal.js
  + SDK  dingtalk-jsapi 2.8.33
  + UI 组件库 ant-design-vue: 1.4

### 3. 项目约定
  + 凡是以 $ 开头的都是挂载到vue 原型链的
  + 装饰器使用 @demo()
  + window.IsDingBrowser 用来判断 是否是钉钉浏览器环境
  + 能用 ui 库实现的样式 尽量使用 ui 库
  + lodash 引入

### 4. 项目工具
  + 项目语法使用 ES6+
  + 项目样式统一管理 style 文件夹下 **使用方法见样式库工具**
  + 正则表达式 在 **validate.js**中
  + 网络请求 由 axios 封装
  + api 统一管理在 **src/api/index.js** 添加之前 请确认 url 没有被添加过
  + 项目支持实验语法**[可选链](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/%E5%8F%AF%E9%80%89%E9%93%BE)**
  + 项目支持**装饰器** 强烈推荐使用
  
### 5. 全局变量与原型链
  + window.IsDingBrowser
  + window.$SWT 全局vue 可在控制台调试使用哦
  + Vue.prototype.$apis **全局api** 已经挂载

      ``` typescript
        await this.$api.demo(params)
      ```
  + axios 拦截器 所有网络请求 理论上都走过滤 interceptor.js

### 6. 网络请求 axios拦截器配置说明
  + 提供的方法如下 请求都会经过 **JSON.parse(JSON.stringify(obj))**
  + 网络请求的数据 都会调用 **调用 toJSON 原因请看** 项目插件介绍
  + 网络拦截器可调用的方法 请在 api.js 中使用 不要在外部使用
     
    ```text
      get
      post
      binary post 上传文件 (二进制文件)
      form  post 表单
      put 上传文件
      download 下载文件
      temp 临时post 拼接URL **调试后请联系后端删除**
    ```

  + 请求格式如下
  
      ```json
        {
          "success":true,
          "result":null
        }
      ```
  + 只有 success 为true 你才能获取到 result (也只有result) 不需要判断接口正确与否 success 为true 或http状态码不对则**报错终止执行**
    
    demo

      ```typescript
        @loading('someLoading')
        @confirm('确定要执行么?')
        async demoFunction (){
          this.res = await this.$api.demoGet(params)
          // xxxxx 剩余逻辑 如果接口出错 都不会执行
        }
      ``` 
    上面的@loading @confirm 是装饰器

### 7. 项目插件介绍
  + 引入了 antdv 所有的组件 
    + 通过 cdn 引入  cdn 的管理在 vue.config.js 中
    + 通过 plugins 文件夹内 引入组件
    + main.js 引入plugins内的文件
    + main.js 重写moment 对象

    ``` javascript
      // 通过在 main.js 中重写了 moment 
      // 所以日期选择插件可以不处理 直接上传给后端 如果需要修改格式的 则自己修改属性的toJSON
      moment.locale('zh-cn')
      moment.fn.toJSON = function () { return this.format('YYYY-MM-DD') }
    ```
  + antdv 原型的注入 但是不推荐使用原型的方法调用

    ```javascript
      Vue.prototype.$message = antd.message
      Vue.prototype.$notification = antd.notification
      Vue.prototype.$confirm = antd.Modal.confirm
    ```
  + 关于 $message 在utils/antdvUtils.js 中有全局的防抖
    ```javascript
      // 成功的提示
      export const SuccessMessage = debounce((msg) => { antd.message.success(msg) }, 1500, {
        leading: true,
        trailing: false
      })

      // 警告提示
      export const WarningMessage = debounce((msg) => { antd.message.warning(msg) }, 1500, {
        leading: true,
        trailing: false
      })

      // 失败提示
      export const ErrorMessage = debounce((msg) => { antd.message.error(msg) }, 1500, {
        leading: true,
        trailing: false
      })
    ```
  + 关于 $confirm 则推荐使用装饰器

### 8. 关于工具类库的介绍

  ```text
     此工具库应与业务尽量解耦
     编写文件时 应维护声明文件 (.d.ts)
  ```

  + utils/index.js 
    + 此文件应该为纯函数组件
    + 此文件导出的函数应该在任意环境下通用
    + 此文件导出的函数 尽量遵循数据不可变原则 不改变source data 而是返回一个新的 data
  + validate.js
    + 此文件是正则表达式类库
    + 此文件内正则应可维护 (业务正则可直接写入代码 不具备可重用性)
    + 此文件内除导出正则外也应导出一份校验函数 
  + ddApi.js
    + 此文件为你添加鉴权参数仅此而已
  + antdvUtils.js
    + 此文件是ant design for vue 二次封装函数库
    + 修改此函数库 应保证不影响现有代码
    + 具体说明请看antdvUtils.d.ts