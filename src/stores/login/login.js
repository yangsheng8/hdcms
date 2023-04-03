import { defineStore } from 'pinia'
import { accountLoginRequest } from '@/service/login/login'
import { localCache } from '@/utils/cache'
import router from '@/router'
import { LOGIN_TOKEN } from '@/global/constants'

const useLoginStore = defineStore('login', {
  state: () => ({
    id: '',
    username: '',
    token: localCache.getCache(LOGIN_TOKEN) ?? '',
    loginLoading: false
  }),
  actions: {
    async loginAccountAction(account) {
      this.loginLoading = true
      //1. 账号登录，获取token等信息
      const loginResult = await accountLoginRequest(account)
      this.id = loginResult.userId
      this.username = loginResult.userName
      this.token = loginResult.token
      //2. 本地缓存
      localCache.setCache(LOGIN_TOKEN, this.token)
      this.loginLoading = false
      //3. 页面跳转（home页面）
      router.push('/home')
    }
  }
})

export default useLoginStore
