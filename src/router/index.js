import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/home/home.vue'
import { LOGIN_TOKEN } from '@/global/constants'
import { localCache } from '../utils/cache'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/home'
    },
    {
      path: '/home',
      name: 'home',
      component: HomeView
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/login/login.vue')
    },
    {
      path: '/test',
      name: 'test',
      component: () => import('../views/test.vue')
    },
    {
      path: '/:pathMatch(.*)',
      component: () => import('../views/not-found/not-found.vue')
    }
  ]
})

//导航守卫
// 参数： to(跳转到的位置)， from （从哪里跳转过来）
// 返回值： 返回值决定导航的路径
//
router.beforeEach((to) => {
  //只有登录成功，才能进入home页面
  const token = localCache.getCache(LOGIN_TOKEN)
  if (to.path === '/home' && !token) {
    return '/login'
  }
})

export default router
