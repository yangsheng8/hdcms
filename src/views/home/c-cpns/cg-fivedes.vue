<template>
  <div class="cg-fivedes">
    <el-card class="box-card mb-20" shadow="never">
      <template #header>
        <div class="card-header">
          <el-row>
            <el-col :span="3"> <h2>生成后的五点描述</h2></el-col>
            <el-col :span="3" class="flowlr"
              ><span>每条字数上限:</span>
              <el-input v-model="fiveDesLimit" placeholder="Please input title word count" />
            </el-col>
          </el-row>
        </div>
      </template>
      <el-row :gutter="20">
        <el-col :span="9">
          <el-input
            v-model="homeStore.fivedes"
            :rows="10"
            type="textarea"
            placeholder="自动挡一张白纸"
        /></el-col>
        <el-col :span="7" type="flex" justify="center" align="middle">
          <!--自定义五点描述-->
          <div class="fiveSubTitle">
            <span>第一条描述：</span>
            <el-input
              v-model="fiveDes.data1"
              placeholder="请输入第一条描述所需要的关键词,请以逗号隔开"
            />
          </div>
          <div class="fiveSubTitle">
            <span>第二条描述：</span>
            <el-input
              v-model="fiveDes.data2"
              placeholder="请输入第二条描述所需要的关键词,请以逗号隔开"
            />
          </div>
          <div class="fiveSubTitle">
            <span>第三条描述：</span>
            <el-input
              v-model="fiveDes.data3"
              placeholder="请输入第三条描述所需要的关键词,请以逗号隔开"
            />
          </div>
          <div class="fiveSubTitle">
            <span>第四条描述：</span>
            <el-input
              v-model="fiveDes.data4"
              placeholder="请输入第四条描述所需要的关键词,请以逗号隔开"
            />
          </div>
          <div class="fiveSubTitle">
            <span>第五条描述：</span>
            <el-input
              v-model="fiveDes.data5"
              placeholder="请输入第五条描述所需要的关键词,请以逗号隔开"
            />
          </div>
          <div class="mt-20">
            <el-button type="primary" v-if="!homeStore.fivedesBtnLoading" @click="handleGenerate"
              >生成五点描述</el-button
            >
            <el-button v-else type="primary" loading>Loading</el-button>
          </div>
        </el-col>
        <el-col :span="8">
          <ol class="fiveul">
            <li v-for="(item, index) in homeStore.newFivedes" :key="index">
              {{ homeStore.newFivedes[index] }}
            </li>
          </ol>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>
<script setup>
import { ref, reactive, onMounted, defineEmits } from 'vue'
import { ElMessage } from 'element-plus'
import useHomeStore from '@/stores/home/home'
const homeStore = useHomeStore()

const fiveDesLimit = ref(200)
const fiveDes = reactive({
  data1: '',
  data2: '',
  data3: '',
  data4: '',
  data5: ''
})

//传递给父组件的值
const emits = defineEmits(['default-value'])
onMounted(() => {
  emits('default-value', fiveDesLimit.value)
})

const props = defineProps({
  parentMessage: Object
})

function handleGenerate() {
  if (fiveDes.data1 || fiveDes.data2 || fiveDes.data3 || fiveDes.data4 || fiveDes.data5) {
    const obj = {
      kwData1: fiveDes.data1,
      kwData2: fiveDes.data2,
      kwData3: fiveDes.data3,
      kwData4: fiveDes.data4,
      kwData5: fiveDes.data5,
      textLimit: fiveDesLimit.value,
      language: props.parentMessage.language,
      consult: props.parentMessage.consult
    }
    homeStore.fivedesHandChangeAction(obj)
  } else {
    ElMessage.error('不能为空哦~')
  }
}
</script>
<style lang="less" scoped>
.fiveSubTitle {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 5px;
  span {
    width: 150px;
  }
}
.mt-20 {
  margin-top: 20px;
}
.fiveul {
  border: 1px solid #f9f4f4;
  margin-top: 0;
  padding: 10px;
  box-shadow: 0 0 0 1px var(--el-input-border-color, var(--el-border-color)) inset;
  border-radius: var(--el-input-border-radius, var(--el-border-radius-base));
  li {
    margin: 15px 0;
  }
}
</style>
