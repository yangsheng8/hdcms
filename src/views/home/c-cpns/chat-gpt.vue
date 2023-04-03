<script setup>
import { ref } from 'vue'
import { Cloud } from 'laf-client-sdk'
// 将instal 引入
import { marked } from 'marked'
import { LOGIN_TOKEN } from '@/global/constants'
import { localCache } from '@/utils/cache'

const cloud = new Cloud({
  baseUrl: 'https://xjd82y.laf.dev',
  getAccessToken: () => localCache.getCache(LOGIN_TOKEN) ?? '',
  timeout: 60000
})

//======================================data======================================
//消息列表
const list = ref([])
//输入框绑定消息
const question = ref('')
//判断消息是否为空
const parentMessageId = ref('')
//获取消息loading
const loading = ref(false)
//输入框提示
const placeholder = ref('输入你的指令')
//判断设备
const isMobile = ref(false)
//======================================created======================================

//======================================function======================================

//发送消息
async function sendMessage() {
  //判断是否回复
  if (loading.value) return
  list.value.push({
    text: question.value,
    avatar: '/hd.png'
  })
  //定位页面位置
  setScreen()
  const message = question.value
  question.value = ''
  loading.value = true
  let res
  if (message == '') {
    loading.value = false
    list.value.push({
      text: '问题不能为空！',
      avatar: '/logo.png'
    })
    setScreen()
    return
  }
  try {
    if (!parentMessageId.value) {
      res = await cloud.invoke('send', { message })
    } else {
      res = await cloud.invoke('send', {
        message,
        parentMessageId: parentMessageId.value
      })
    }
  } catch (error) {
    console.log(error)
    loading.value = false
    list.value.push({
      text: '出错了，请重试！',
      avatar: '/logo.png'
    })
    setScreen()
    return
  }

  parentMessageId.value = res.id

  res.text = marked.parse(res.text)

  list.value.push({
    text: res.text,
    avatar: '/logo.png'
  })

  loading.value = false
  setScreen()
}

//发送消息适配PC或phone
function handleEnter(e) {
  if (e.key === 'Enter' && !isMobile.value && !e.shiftKey) {
    sendMessage()
  }
}
//定位页面位置
function setScreen() {
  setTimeout(() => {
    window.scrollTo(0, document.body.scrollHeight)
  }, 0)
}
</script>

<template>
  <div class="page">
    <!-- 占位 -->
    <div style="height: 52px"></div>

    <!-- ------------------------------------------------------------ -->
    <div v-show="!list.length" class="begintitle">
      <h1>请输入你的问题</h1>
      <p>请参考以下话术，可以提高chatGPT的回答精确性：</p>
      <p>
        现在请你扮演一位亚马逊卖家，拥有3年以上的卖货经验，擅长卖电子产品，并且有着良好的售后服务意识，对产品的复购率也很看重，如果你理解了你的身份请回复loveanson
      </p>
      <p>
        很好，现在请提炼一个亚马逊卖家的产品内容，主要模拟这个卖家的语言风格和描述习惯，这个产品在亚马逊上的描述如下：
        <br />
        1.xxxxx
        <br />
        2.xxxxx
        <br />
        3.xxxxx
        <br />
        提炼模拟完成后，回复loveanson
      </p>
      <p>
        很好，现在用高度相似的风格语言习惯，书写一份台灯产品描述以用于亚马逊平台的销售，请生成中文和英文两个版本，开始
      </p>
      <p>
        很好，请将上述英文版本生成8个不同的版本，方便我们在多个分销商那里销卖这个产品。这8个版本语言相似，但是语言表达稍微有点变化
      </p>
    </div>

    <!-- 页面消息列表 -->
    <div id="myList">
      <div :class="item.type === 0 ? 'problemList' : 'answerList'" v-for="item in list" :key="item">
        <img class="listImg" :src="item.avatar" alt="" />
        <div v-html="item.text" class="listText"></div>
      </div>

      <div v-show="loading" class="answerList">
        <img class="listImg" src="/public/logo.png" alt="" />
        <img class="addin" src="/public/loading.gif" alt="" />
      </div>
    </div>

    <!-- ------------------------------------------------------ -->

    <!-- 输入框 -->
    <div class="inputbox">
      <el-input
        v-model="question"
        v-bind:readonly="loading"
        maxlength="1000"
        tabindex="0"
        :autosize="{ minRows: 1, maxRows: 5 }"
        type="textarea"
        :placeholder="placeholder"
        @keypress="handleEnter"
      />

      <!-- 发送按钮小飞机 -->
      <div class="btn-send" @click="sendMessage">
        <div class="send-view" style="display: flex">
          <svg
            stroke="currentColor"
            fill="none"
            stroke-width="2"
            viewBox="0 0 24 24"
            class="h-4 w-4 mr-1"
            height="1.5em"
            width="1.5em"
          >
            <line x1="22" y1="2" x2="11" y2="13"></line>
            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
          </svg>
        </div>
      </div>
    </div>

    <!-- ----------------------------------------------- -->
  </div>
</template>

<style scoped lang="less">
.page {
  position: relative;
  height: 100%;
}
.defbut {
  position: fixed;
  right: 2px;
  bottom: 152px;
}
.btn-send {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 10px;
  width: 48px;
  height: 32px;
  border-radius: 6px;
  color: rgba(0, 0, 0, 0.6);
  background: rgba(0, 0, 0, 0.1);
}
.btn-send:hover {
  cursor: pointer;
  opacity: 0.85;
}
.text {
  position: absolute;
  top: 50px;
  border: 1px solid #e5e5e5;
  height: 60px;
  padding: 10px;
  width: 90%;
}

#myList {
  max-width: 1000px;
  margin: 0 auto;
  padding: 0px 0 60px 0;
  overflow-x: hidden;
  overflow-y: auto;
}

.problemList {
  display: flex;
  padding: 0px 200px;
}

.answerList {
  position: relative;
  padding: 20px 18px;
  font-size: 15px;
  display: flex;
  overflow-x: auto;
  white-space: pre-wrap;
  border-top: 1px solid #e5e5e5;
  border-bottom: 1px solid #e5e5e5;
}

.listImg {
  margin-top: 5px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
}

.listText {
  margin-left: 20px;
  padding-top: 10px;
  width: 100%;
  white-space: pre-wrap;
}

.inputbox {
  position: fixed;
  bottom: 30px;
  left: 0;
  right: 0;
  margin: auto;
  width: 90%;
  max-width: 1000px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  background: #fff;
  border-radius: 8px;
}
.pre {
  white-space: pre-wrap;
  text-indent: 2em;
  word-wrap: break-word;
  padding: 0 0 10% 0;
}

.inputbox button {
  margin-left: 15px;
  width: 56px;
  height: 82%;
  border-radius: 6px;
  border: 0;
  background: silver;
  color: #333;
  font-size: 14px;
  outline: none;
}

.inputbox button:hover {
  cursor: pointer;
  opacity: 0.8;
}

.addin {
  margin: 10px 20px;
  width: 30px;
  height: 30px;
}

.steppingstone {
  width: 100%;
  height: 160px;
}

.amount {
  margin: 5px;
  width: 100px;
  height: 40px;
  line-height: 44px;
  text-align: center;
  font-size: 16px;
  color: #606266;
}

.begintitle {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: left;
  align-items: center;
  /* padding: 50px 50px 30px 50px; */
  text-align: left;
  img {
    width: 200px;
  }

  h1 {
    padding: 50px;
    font-size: 28px;
    font-weight: bold;
    text-align: center;
  }

  p {
    width: 100%;
    text-align: left;
  }
}

.exhibition {
  width: 80%;
  margin: auto;
  display: flex;
  justify-content: space-around;
}

.witem p {
  margin: auto;
  padding: 10px;
  margin-top: 15px;
  font-size: 16px;
  border-radius: 5px;
  text-align: center;
}

.witem h3 {
  padding: 15px;
  font-size: 20px;
  color: #606266;
  text-align: center;
}

textarea {
  border: none;
  resize: none;
  cursor: pointer;
  outline: none;
  overflow-y: hidden;
}
.head {
  position: fixed;
  width: 100%;
  padding: 0px 30px;
  line-height: 50px;
  justify-content: end;
  border-bottom: 1px solid #e5e5e5;
  background-color: #fff;
  z-index: 10;
}
</style>
