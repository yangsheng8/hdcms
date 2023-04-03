import { createApp } from 'vue'
import pinia from './stores'
import './assets/css/index.less'
import App from './App.vue'
import router from './router'
import registerIcons from './global/register-icons'
//针对 ElMessage  和 ElLoading 等组件引入样式
// import 'element-plus/theme-chalk/el-message.css'

const app = createApp(App)

app.use(pinia)
app.use(router)
app.use(registerIcons)

app.mount('#app')
