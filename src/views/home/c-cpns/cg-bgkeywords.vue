<template>
  <div class="cg-longdes">
    <el-card class="box-card mb-20" shadow="never">
      <template #header>
        <div class="card-header">
          <el-row>
            <el-col :span="2"> <h2>后台关键词</h2></el-col>
            <el-col :span="2" class="flowlr"
              ><span>字数上限:</span>
              <el-input
                v-model="bgkeywordsLimit"
                placeholder="Please input Long Description count"
              />
            </el-col>
          </el-row>
        </div>
      </template>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-input
            :maxlength="bgkeywordsLimit"
            show-word-limit
            v-model="homeStore.bgkeywords"
            :rows="10"
            type="textarea"
            placeholder="一张白纸"
        /></el-col>
        <el-col :span="8">
          <!--自定义关键词-->
          <div class="flowlr">
            <el-input
              class="mr-10"
              v-model="bgkeywords"
              :rows="2"
              type="textarea"
              placeholder="请填入自定义关键词生成标题，用逗号隔开"
            />
            <el-button type="primary" v-if="!homeStore.gbKeywordsBtnLoading" @click="handleGenerate"
              >生成后台关键词</el-button
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

//限制后台关键词输入长度
const bgkeywordsLimit = ref(500)
//输入后台的关键词
const bgkeywords = ref('')

//传递给父组件的值
const emits = defineEmits(['default-value'])
onMounted(() => {
  emits('default-value', bgkeywordsLimit.value)
})
const props = defineProps({
  parentMessage: Object
})

// 2. 向服务器发送网络请求（携带关键词）
function handleGenerate() {
  if (bgkeywords.value) {
    const obj = {
      keywords: bgkeywords.value,
      textLimit: bgkeywordsLimit.value,
      language: props.parentMessage.language,
      consult: props.parentMessage.consult
    }
    homeStore.bgKeywordsdHandChangeAction(obj)
  } else {
    ElMessage.error('不能为空哦~')
  }
}
</script>
<style lang="less" scoped></style>
