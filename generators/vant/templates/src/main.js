import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import moment from 'moment'
// 引入过滤器
import '@/filter/'
// 全局组件
import '@/components/global/globalComponent.js'
// 动画库
import '@/style/animate.css'
// 样式库
import '@/style/css/auto.css'
// 样式重写
import '@/style/reset.css'
// 网络请求
import apis from '@/http/apis'

// 引入 vant
import '@/plugins/vant'

Vue.config.productionTip = false
// 原型链挂载
Vue.prototype.$apis = apis

// 全局格式化 moment 传给后端用
moment.locale('zh-cn')
moment.fn.toJSON = function () { return this.format('YYYY-MM-DD') }

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
