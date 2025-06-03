import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'
import router from './router'
import './style.css'

// 创建Vue应用实例
const app = createApp(App)

// 使用 Vue Router
app.use(router)

// 使用Element Plus
app.use(ElementPlus)

// 挂载应用
app.mount('#app')
