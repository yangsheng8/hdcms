<template>
  <div>
    <input type="text" v-model="prompt" placeholder="请输入问题" />
    <button @click="fetchResponse">发送</button>
    <p>回答: {{ response }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'

const prompt = ref('')
const response = ref('')

async function fetchResponse() {
  try {
    const res = await axios.post('http://localhost:3000/api/chat', { prompt: prompt.value })
    response.value = res.data.response
  } catch (error) {
    console.error(`Error: ${error}`)
  }
}
</script>
