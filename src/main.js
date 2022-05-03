import { createApp } from 'vue'
import App from './App.vue'

import 'leaflet/dist/leaflet.css'
import * as L from 'leaflet'
import './utils/LeafletMap.js'

const app = createApp(App)

app.config.globalProperties.L = L;

app.use(L).mount('#app')
