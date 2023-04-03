<template>
  <div class="pane-account">
    <el-form
      label-width="60px"
      :rules="accountRules"
      size="large"
      :model="formLogin"
      style="max-width: 460px"
      status-icon
      ref="formRef"
    >
      <el-form-item label="帐号" prop="name">
        <el-input v-model="formLogin.name" />
      </el-form-item>

      <el-form-item label="密码" prop="password">
        <el-input v-model="formLogin.password" show-password />
      </el-form-item>
    </el-form>
  </div>
</template>
<script setup>
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import useLoginStore from '@/stores/login/login'
import { localCache } from '@/utils/cache'

const CACHE_NAME = 'name'
const CACHE_PASSWORD = 'password'

//1.定义account数据
const formLogin = reactive({
  name: localCache.getCache(CACHE_NAME) ?? '',
  password: localCache.getCache(CACHE_PASSWORD) ?? ''
})

//2. 定义校验规则
const accountRules = {
  name: [
    { required: true, message: '必须输入帐号信息~', trigger: 'blur' },
    { pattern: /^[a-z0-9]{6,20}$/, message: '必须是6~20位的数字或字母组成', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '必须输入密码信息~', trigger: 'blur' },
    { pattern: /^[a-z0-9]{3,}$/, message: '必须是3位以上数字或字母组成', trigger: 'blur' }
  ]
}

//3.执行帐号的登录逻辑
const formRef = ref()
const loginStore = useLoginStore()
function loginAction(isRemPwd) {
  formRef.value?.validate((valid) => {
    if (valid) {
      //1.获取用户输入的账号和密码
      const username = formLogin.name
      const password = formLogin.password
      // 2. 向服务器发送网络请求（携带账号密码）
      loginStore.loginAccountAction({ username, password })
      //3.  判断是否需要记住密码
      if (isRemPwd) {
        localCache.setCache(CACHE_NAME, username)
        localCache.setCache(CACHE_PASSWORD, password)
      } else {
        localCache.removeCache(CACHE_NAME)
        localCache.removeCache(CACHE_PASSWORD)
      }
    } else {
      ElMessage.error('请正确输入帐号密码，再操作~')
    }
  })
}
defineExpose({
  loginAction
})
</script>
<style lang="less" scoped>
.pane-account {
  color: red;
}
</style>
