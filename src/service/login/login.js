import { Cloud } from 'laf-client-sdk'

// 创建 cloud 对象 这里需要将 <appid> 替换成自己的 App ID
const cloud = new Cloud({
  baseUrl: 'https://xjd82y.laf.dev',
  getAccessToken: () => '' // 这里不需要授权，先填空
})

export async function accountLoginRequest(account) {
  let res
  try {
    // 请求登录
    res = await cloud.invokeFunction('login', account)
    return res
  } catch (error) {
    console.log(error)
    return '出错了，请重试！'
  }
}
