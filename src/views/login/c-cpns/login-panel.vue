<template>
  <div class="login-panel">
    <!--顶部标题-->
    <h1 class="title">AI后台管理系统</h1>
    <div class="tabs">
      <el-card class="box-card" shadow="hover">
        <template #header>
          <div class="card-header">
            <el-icon><UserFilled /></el-icon>
            <span class="text">帐号登录</span>
          </div>
        </template>
        <pane-account ref="accountRef" />
      </el-card>
    </div>
    <!--底部区域-->
    <div class="controls">
      <el-checkbox v-model="isRemPwd" label="记住密码" size="large" />
    </div>
    <el-button
      v-if="!loginStore.loginLoading"
      class="login-btn"
      type="primary"
      size="large"
      @click="handleLoginBtnClick"
      >立即登录</el-button
    >
    <el-button v-else type="primary" size="large" class="login-btn" loading>Loading</el-button>
  </div>
</template>
<script setup>
import { ref, watch } from 'vue'
import PaneAccount from './pane-account.vue'
import useLoginStore from '@/stores/login/login'
import { localCache } from '@/utils/cache'

const loginStore = useLoginStore()
const isRemPwd = ref(localCache.getCache('isRemPwd') ?? false)

watch(isRemPwd, (newValue) => {
  localCache.setCache('isRemPwd', newValue)
})
const accountRef = ref()

function handleLoginBtnClick() {
  //1.获取子组件的实例 2.调用方法
  accountRef.value?.loginAction(isRemPwd.value)
}
</script>
<style lang="less" scoped>
.login-panel {
  width: 330px;
  margin-bottom: 150px;

  .title {
    text-align: center;
    margin-bottom: 15px;
  }

  .label {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .text {
    margin-left: 5px;
  }
}

.controls {
  margin-top: 12px;
  display: flex;
  justify-content: space-between;
}
.login-btn {
  margin-top: 10px;
  width: 100%;
  // --el-button-size: 50px !important;
}
</style>
