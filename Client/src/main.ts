import './assets/main.css'
import  i18n  from "./i18n/i18n"
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import VCalendar from 'v-calendar';
import 'v-calendar/style.css';

import router from './router'

const app = createApp(App)
app.use(VCalendar, {})
app.use(createPinia())
app.use(router)
app.use(i18n); 
app.mount('#app')
