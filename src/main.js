import { createApp } from 'vue'
import App from './App.vue'
import './style.css'
import naive from 'naive-ui'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import 'vfonts/Lato.css'
// 等宽字体
import 'vfonts/FiraCode.css'
const app = createApp(App)
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

app.use(pinia)

app.use(naive)
app.mount('#app')