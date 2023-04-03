<script setup>
import * as XLSX from 'xlsx'

const props = defineProps({
  data: {
    type: Array,
    required: true
  },
  fileName: {
    type: String,
    default: 'data.xlsx'
  }
})

let dataObj = [
  {
    sheetName: '工作表1',
    data: [
      { 姓名: '张三', 年龄: 25, 性别: '男' },
      { 姓名: '李四', 年龄: 22, 性别: '女' }
    ]
  }
]

//const workbook = ref(null)

//找到所有值为“__EMPTY”的单元格
function findEmptyCells(jsonData) {
  const emptyCells = []

  jsonData.forEach((row, rowIndex) => {
    Object.keys(row).forEach((col, colIndex) => {
      if (row[col] === '__EMPTY') {
        emptyCells.push({ r: rowIndex, c: colIndex })
      }
    })
  })

  return emptyCells
}

function mergeEmptyCells(worksheet, emptyCells) {
  emptyCells.forEach((cell) => {
    const cellAddress = XLSX.utils.encode_cell(cell)
    const belowCellAddress = XLSX.utils.encode_cell({
      r: cell.r + 1,
      c: cell.c
    })

    if (!worksheet['!merges']) worksheet['!merges'] = []
    const mergeCells = { s: cell, e: { r: cell.r + 1, c: cell.c } }
    worksheet['!merges'].push(mergeCells)

    delete worksheet[cellAddress].v
    delete worksheet[belowCellAddress].v
  })
}

const download = () => {
  for (var key of Object.keys(props.data)) {
    console.log(key)
    dataObj.push({
      sheetName: key,
      data: props.data[key]
    })
  }
  let worksheet = 'null'
  const fileName = 'exported_data.xlsx'
  const workbook = XLSX.utils.book_new()
  dataObj.forEach((sheet) => {
    // const ws = XLSX.utils.json_to_sheet(sheet.data)
    worksheet = XLSX.utils.json_to_sheet(sheet.data)
    const emptyCells = findEmptyCells(sheet.data)
    mergeEmptyCells(worksheet, emptyCells)
    XLSX.utils.book_append_sheet(workbook, worksheet, sheet.sheetName)
  })

  XLSX.writeFile(workbook, fileName)
}
</script>

<template>
  <div>
    <ul>
      <li v-for="(item, index) in props.data" :key="index">
        <pre>{{ JSON.stringify(item, null, 2) }}</pre>
      </li>
    </ul>
    <button @click="download">Download Excel</button>
  </div>
</template>

<style scoped>
h1 {
  font-weight: 500;
  font-size: 2.6rem;
  top: -10px;
}

h3 {
  font-size: 1.2rem;
}

.greetings h1,
.greetings h3 {
  text-align: center;
}

@media (min-width: 1024px) {
  .greetings h1,
  .greetings h3 {
    text-align: left;
  }
}
</style>
