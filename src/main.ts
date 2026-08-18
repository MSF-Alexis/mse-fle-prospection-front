import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { useAuth } from '@/composables/useAuth'
import './assets/main.css'

const { init } = useAuth()

init().finally(() => {
  const app = createApp(App)
  app.use(router)
  app.mount('#app')
})
