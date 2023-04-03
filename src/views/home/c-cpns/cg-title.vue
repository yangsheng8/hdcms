<template>
  <div class="cg-title">
    <el-card class="box-card mb-20" shadow="never">
      <template #header>
        <div class="card-header">
          <el-row>
            <el-col :span="2"> <h2>生成后的标题</h2></el-col>
            <el-col :span="2" class="flowlr"
              ><span>字数上限:</span>
              <el-input v-model="titleLimit" placeholder="Please input title word count" />
            </el-col>
          </el-row>
        </div>
      </template>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-input
            :maxlength="titleLimit"
            show-word-limit
            v-model="homeStore.AfterTile"
            :rows="4"
            type="textarea"
            placeholder="一张白纸"
        /></el-col>
        <el-col :span="8">
          <!--自定义关键词-->
          <div class="flowlr">
            <el-input
              class="mr-10"
              v-model="customkeywords"
              placeholder="请填入自定义关键词生成标题，用逗号隔开"
            />
            <el-button v-if="!homeStore.titleBtnLoading" type="primary" @click="handleGenerateTitle"
              >生成标题</el-button
            >
            <el-button v-else type="primary" loading>Loading</el-button>
          </div>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>
<script setup>
import { ref, onMounted, defineEmits, defineProps } from 'vue'
import { ElMessage } from 'element-plus'
import useHomeStore from '@/stores/home/home'
const homeStore = useHomeStore()

//标题限制字数
const titleLimit = ref(100)
//自定义关键词
const customkeywords = ref('')

//传递给父组件的值
const emits = defineEmits(['default-value'])
onMounted(() => {
  emits('default-value', titleLimit.value)
})

const props = defineProps({
  parentMessage: Object
})

// 2. 向服务器发送网络请求（携带关键词）
function handleGenerateTitle() {
  if (customkeywords.value) {
    const obj = {
      keywords: customkeywords.value,
      titleLimit: titleLimit.value,
      language: props.parentMessage.language,
      consult: props.parentMessage.consult
    }
    homeStore.titleHandChangeAction(obj)
  } else {
    ElMessage.error('不能为空哦~')
  }
}
</script>
<style lang="less" scoped></style>
