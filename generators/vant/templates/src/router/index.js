import Vue from 'vue'
import VueRouter from 'vue-router'
import baseLayout from '@/layouts/baseLayout'
import tabberLayout from '@/layouts/tabberLayout'
import { session } from '@/utils'

Vue.use(VueRouter)
/**
 * public true 可以不登录
 */
const routes = [
  {
    path: '/',
    name: 'main',
    redirect: { name: 'tab_home' }
  },
  { // base 下没有任何 外部layout
    path: '/base',
    name: 'base',
    redirect: { name: 'base_home' },
    component: baseLayout,
    children: [
      {
        path: 'login',
        name: 'login',
        component: () => import('@/pages/login'),
        meta: { title: '登录', public: true }
      },
      {
        path: 'home',
        name: 'base_home',
        component: () => import('@/pages/home'),
        meta: { title: '首页', public: true }
      },
      {
        path: 'my',
        name: 'base_my',
        component: () => import('@/pages/my'),
        meta: { title: '首页', public: true }
      }
    ]
  },
  { // manager 下 有默认layout
    path: '/tab',
    name: 'tab',
    redirect: { name: 'tab_home' },
    component: tabberLayout,
    children: [
      {
        path: 'home',
        name: 'tab_home',
        component: () => import('@/pages/home'),
        meta: { title: '首页', public: true }
      },
      {
        path: 'my',
        name: 'tab_my',
        component: () => import('@/pages/my'),
        meta: { title: '首页', public: true }
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
