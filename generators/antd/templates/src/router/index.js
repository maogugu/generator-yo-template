import Vue from 'vue'
import VueRouter from 'vue-router'
import baseLayout from '@/layouts/baseLayout'
import managerLayout from '@/layouts/managerLayout'
import { session } from '@/utils'

Vue.use(VueRouter)
/**
 * public true 可以不登录
 */
const routes = [
  {
    path: '/',
    redirect: { name: 'login' }
  },
  { // base 下没有任何 外部layout
    path: '/base',
    name: 'base',
    redirect: { name: 'base_demo' },
    component: baseLayout,
    children: [
      {
        path: 'login',
        name: 'login',
        component: () => import('@/pages/login'),
        meta: { title: '登录', public: true }
      },
      {
        path: 'demo',
        name: 'base_demo',
        component: () => import('@/pages/demo'),
        meta: { title: '首页' }
      },
      {
        path: 'demo2',
        name: 'base_demo2',
        component: () => import('@/pages/demo'),
        meta: { title: '首页' }
      }
    ]
  },
  { // manager 下 有默认layout
    path: '/manager',
    name: 'manager',
    redirect: { name: 'manager_demo' },
    component: managerLayout,
    children: [
      {
        path: 'demo',
        name: 'manager_demo',
        component: () => import('@/pages/demo'),
        meta: { title: '首页' }
      },
      {
        path: 'demo2',
        name: 'manager_home2',
        component: () => import('@/pages/demo'),
        meta: { title: '首页' }
      },
      {
        path: 'manager_richText',
        name: 'manager_richText',
        component: () => import('@/pages/richText.vue'),
        meta: { title: '富文本测试' }
      }
    ]
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.VUE_APP_PUBLIC_PATH,
  routes
})

router.beforeEach((to, from, next) => {
  // 是否不需要登录
  if (to?.meta?.public === true) {
    next()
  }
  // 是否登录过
  if (session.getSession('token') !== undefined) {
    next()
  } else {
    next({ name: 'login' })
  }
})

export default router
