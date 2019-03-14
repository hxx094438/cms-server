import Vue from 'vue'
import VueRouter from 'vue-router'
import Vuex from 'vuex'
import Meta from 'vue-meta'
import App from './app.vue'
import { createStore } from './store'
import { createRouter } from './router'
import { sync } from 'vuex-router-sync'

// import Notification from './components/notification'
// import Tabs from './components/tabs'
import './assets/css/index.scss'

// import './assets/styles/global.styl'
import axios from 'axios'
axios.defaults.withCredentials = true
Vue.prototype.$http = axios


Vue.use(VueRouter)
Vue.use(Vuex)
Vue.use(Meta)
// Vue.use(Notification)
// Vue.use(Tabs)

export default () => {
  const router = createRouter()
  const store = createStore()
  sync(store, router)

  console.log('create app')
  const app = new Vue({
    router,
    store,
    render: h => h(App)
  })

  return { app, router, store }
}
