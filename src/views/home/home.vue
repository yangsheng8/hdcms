<template>
  <div class="common-layout">
    <el-container>
      <el-header>
        <el-button round @click="handleExitClick" class="loginoutBtn">退出登录</el-button>
      </el-header>
      <el-main>
        <el-card class="box-card">
          <!--tab标签页-->
          <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
            <el-tab-pane label="AI生成Listing" name="first">
              <!--AI生成Listing-->
              <el-row>
                <el-col :span="2" class="title"><span> 请填入标题 </span></el-col>
                <el-col :span="10"
                  ><el-input v-model="original.title" placeholder="请填入标题"
                /></el-col>
                <el-col :span="2" class="title"><span> 请填入主关键词 </span></el-col>
                <el-col :span="10"
                  ><el-input v-model="original.keyword" placeholder="请填入主关键词"
                /></el-col>
              </el-row>
              <el-row justify="start" align="middle">
                <el-col :span="2">
                  <el-button
                    v-if="!homeStore.globalLoading"
                    type="primary"
                    :icon="Edit"
                    @click="oneOfAll"
                    >开始生成</el-button
                  >
                  <el-button v-else type="primary" loading>Loading</el-button>
                </el-col>
                <el-col :span="1"><span> 输出语言 </span></el-col>
                <el-col :span="4">
                  <el-select v-model="original.language" class="m-2" placeholder="Select">
                    <el-option
                      v-for="item in languageOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-col>
                <el-col :span="1"><span> 参考 </span></el-col>
                <el-col :span="4"
                  ><el-input v-model="original.consult" placeholder="亚马逊"
                /></el-col>
              </el-row>
              <el-divider />
              <!--生成后的标题--->
              <cg-title @default-value="titleDefaultValue" :parentMessage="original" />
              <!--生成后的五点描述--->
              <cg-fivedes @default-value="fiveDesDefaultValue" :parentMessage="original" />
              <!--生成后的长描述--->
              <cg-longdes @default-value="longdesDefaultValue" :parentMessage="original" />
              <!--生成后台关键词-->
              <cg-bgkeywords @default-value="bgkeywordDefaultValue" :parentMessage="original" />
            </el-tab-pane>
            <el-tab-pane label="GPT问答" name="second">
              <chat-gpt />
            </el-tab-pane>
          </el-tabs>
        </el-card>
      </el-main>
    </el-container>
  </div>
</template>
<script setup>
import { ref, reactive } from 'vue'
import { localCache } from '@/utils/cache'
import { LOGIN_TOKEN } from '@/global/constants'
import { useRouter } from 'vue-router'
import { Edit } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import ChatGpt from './c-cpns/chat-gpt.vue'
import CgTitle from './c-cpns/cg-title.vue'
import CgFivedes from './c-cpns/cg-fivedes.vue'
import CgLongdes from './c-cpns/cg-longdes.vue'
import CgBgkeywords from './c-cpns/cg-bgkeywords.vue'
import useHomeStore from '@/stores/home/home'

const homeStore = useHomeStore()

//标题限制字数
const titleLimit = ref(0)
const fiveDesLimit = ref(0)
//限制长描述
const longdecLimit = ref(0)
//限制后台关键词输入长度
const bgkeywordsLimit = ref(0)

const activeName = ref('first')
//tab标签
const handleClick = (tab, event) => {
  console.log(tab, event)
}

//用户输入的 标题，关键词，选择语言，参考
const original = reactive({
  title: '',
  keyword: '',
  language: 'English',
  consult: '亚马逊'
})

const languageOptions = [
  {
    value: 'English',
    label: '🇬🇧 English'
  },
  {
    value: 'Chinese',
    label: '🇨🇳 Chinese'
  },
  {
    value: 'Japanese',
    label: '🇯🇵 Japanese'
  },
  {
    value: 'French',
    label: '🇫🇷 French'
  },
  {
    value: 'German',
    label: '🇩🇪 German'
  },
  {
    value: 'Spanish',
    label: '🇪🇸 Spanish'
  },
  {
    value: 'Italian',
    label: '🇮🇹 Italian'
  },
  {
    value: 'Dutch',
    label: '🇳🇱 Dutch'
  },
  {
    value: 'Portuguese',
    label: '🇵🇹 Portuguese'
  },
  {
    value: 'Russian',
    label: '🇷🇺 Russian'
  }
]

const router = useRouter()
function handleExitClick() {
  //1.删除token
  localCache.removeCache(LOGIN_TOKEN)
  //2.跳回login
  router.push('/login')
}

//一键生成
function oneOfAll() {
  const obj = {
    title: original.title,
    titleLimit: titleLimit.value,
    keyword: original.keyword,
    language: original.language,
    consult: original.consult,
    fivedes: original.fivedes,
    fiveDesLimit: fiveDesLimit.value,
    longdes: original.longdes,
    longdecLimit: longdecLimit.value,
    bgkeywords: original.bgkeywords,
    bgkeywordsLimit: bgkeywordsLimit.value
  }
  if (original.title) {
    homeStore.oneOfAllAction(obj)
  } else {
    ElMessage.error('标题不能为空，请填入标题再点开始生成~')
  }
}

//标题的字数限制
function titleDefaultValue(defaultValue) {
  titleLimit.value = defaultValue
}
function fiveDesDefaultValue(defaultValue) {
  fiveDesLimit.value = defaultValue
}
function longdesDefaultValue(defaultValue) {
  longdecLimit.value = defaultValue
}
function bgkeywordDefaultValue(defaultValue) {
  bgkeywordsLimit.value = defaultValue
}
</script>
<style lang="less" scoped>
.dbshow {
  background-color: antiquewhite;
}
.loginoutBtn {
  float: right;
  margin-top: 10px;
}

.el-row {
  margin-bottom: 20px;
}
.el-row:last-child {
  margin-bottom: 0;
}
.el-col {
  border-radius: 4px;
}

.grid-content {
  border-radius: 4px;
  min-height: 36px;
}
</style>
