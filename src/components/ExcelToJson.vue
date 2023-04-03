<template>
  <div>
    <input type="file" ref="fileInput" @change="handleFileChange" />
    <button @click="showInfoBtnClick">showInfoButton</button>
  </div>
</template>
<script setup>
import { ref } from 'vue'
import * as XLSX from 'xlsx'

const file = ref(null)

const handleFileChange = (event) => {
  file.value = event.target.files[0]
}

// 绑定函数，并且发出事件
const emits = defineEmits(['infoBtnClick'])

const exportToJson = async () => {
  if (!file.value) {
    alert('请选择一个Excel文件')
    return
  }

  try {
    const data = await readFile(file.value)
    const workbook = XLSX.read(data, { type: 'binary' })
    const jsonOutput = workbookToJson(workbook)
    emits('infoBtnClick', jsonOutput)

    // 在此处处理JSON数据，例如发送给服务器或下载到本地
  } catch (err) {
    console.error(err)
    alert('文件读取失败，请重试')
  }
}

const readFile = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => resolve(e.target.result)
    reader.onerror = (e) => reject(e.target.error)
    reader.readAsBinaryString(file)
  })
}

const workbookToJson = (workbook) => {
  const result = {}
  workbook.SheetNames.forEach((sheetName) => {
    const sheet = workbook.Sheets[sheetName]
    result[sheetName] = XLSX.utils.sheet_to_json(sheet)
  })
  return result
}

function showInfoBtnClick() {
  exportToJson()
}
</script>

<style scoped></style>
