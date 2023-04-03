<template>
  <div class="cg-longdes">
    <el-card class="box-card mb-20" shadow="never">
      <template #header>
        <div class="card-header">
          <el-row>
            <el-col :span="3"> <h2>生成后的长描述</h2></el-col>
            <el-col :span="2" class="flowlr"
              ><span>字数上限:</span>
              <el-input v-model="longdecLimit" placeholder="Please input Long Description count" />
            </el-col>
          </el-row>
        </div>
      </template>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-input
            :maxlength="longdecLimit"
            show-word-limit
            v-model="homeStore.longdes"
            :rows="8"
            type="textarea"
            placeholder="一张白纸"
        /></el-col>
        <el-col :span="8">
          <!--自定义关键词-->
          <div class="flowlr">
            <el-input
              class="mr-10"
              v-model="longDesTextarea"
              :rows="2"
              type="textarea"
              placeholder="请填入自定义关键词生成标题，用逗号隔开"
            />
            <el-button type="primary" v-if="!homeStore.longBtnLoading" @click="handleGenerate"
              >生成长描述</el-button
            >
            <el-button v-else type="primary" loading>Loading</el-button>
          </div>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>
<script setup>
import { ref, onMounted, defineEmits } from 'vue'
import { ElMessage } from 'element-plus'
import useHomeStore from '@/stores/home/home'
const homeStore = useHomeStore()

//限制长描述
const longdecLimit = ref(1000)

//自定义关键词
const longDesTextarea = ref('')

//传递给父组件的值
const emits = defineEmits(['default-value'])
onMounted(() => {
  emits('default-value', longdecLimit.value)
})

const props = defineProps({
  parentMessage: Object
})

// 2. 向服务器发送网络请求（携带关键词）
function handleGenerate() {
  if (longDesTextarea.value) {
    const obj = {
      keywords: longDesTextarea.value,
      textLimit: longdecLimit.value,
      language: props.parentMessage.language,
      consult: props.parentMessage.consult
    }
    homeStore.longHandChangeAction(obj)
  } else {
    ElMessage.error('不能为空哦~')
  }
}
</script>
<style lang="less" scoped></style>
