<template>
  <div class="home">
    <h2>home: {{ counterStore.counter }} - {{ counterStore.doubleCounter }}</h2>
    <button @click="changeCounter">修改counter</button>
    <div class="dbshow">
      <ul>
        <li v-for="item in items" :key="item._id">{{ item.username }}</li>
      </ul>
      <input v-model="newItemName" />
      <button @click="addItem">Add Item</button>
    </div>
    <excel-to-json @info-btn-click="infoClick"></excel-to-json>
    <json-to-excel :data="jsonData"></json-to-excel>
  </div>
</template>
<script setup>
import { ref } from 'vue'
import { init } from 'laf-client-sdk'
import { useCounterStore } from '../../stores/counter'
import ExcelToJson from '@/components/ExcelToJson.vue'
import JsonToExcel from '@/components/JsonToExcel.vue'
const counterStore = useCounterStore()

function changeCounter() {
  counterStore.changeCounterAction(999)
}

//============================================
let items = ref([])

let jsonData = ref(['1', '2', 'a'])

const newItemName = ref('')

const clientPromise = init({
  // 应用的服务地址，在欢迎-服务地址 可找到
  baseUrl: 'https://xjd82y.laf.dev',
  // 刚刚创建的访问策略的入口地址
  dbProxyUrl: '/proxy/read',
  getAccessToken: () => '',
  environment: 'h5'
})

// 获取数据库访问器
const getDb = async () => {
  const client = await clientPromise
  return client.database()
}

const loadItems = async () => {
  const db = await getDb()
  const result = await db.collection('users').get()
  items.value = result.data
}

const addItem = async () => {
  const db = await getDb()
  const newItem = { username: newItemName.value }
  const result = await db.collection('users').add(newItem)
  if (result.ok) {
    loadItems()
  }
  newItemName.value = ''
}

// 调用 loadItems 函数，加载初始数据
loadItems()

//=====获取json数据======
function infoClick(payload) {
  jsonData.value = payload
}
</script>
<style lang="less" scoped>
.dbshow {
  background-color: antiquewhite;
}
</style>
