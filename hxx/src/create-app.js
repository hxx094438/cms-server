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




Vue.filter('toDate', (date) => {
  if (date) {
      const d = new Date(date)
      const minutes = d.getMinutes() < 10 ? '0' + d.getMinutes() : d.getMinutes()
      const hours = d.getHours() < 10 ? '0' + d.getHours() : d.getHours()
      return d.getFullYear() + '年' + (d.getMonth() + 1) + '月' +
          d.getDate() + '日 ' + hours + ' : ' + minutes
  }
})

Vue.filter('to_date', (date) => {
  if (date) {
      const d = new Date(date)
      const minutes = d.getMinutes() < 10 ? '0' + d.getMinutes() : d.getMinutes()
      const hours = d.getHours() < 10 ? '0' + d.getHours() : d.getHours()
      return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' +
          d.getDate() + ' ' + hours + ': ' + minutes
  }
})

Vue.filter('toTag', (arr) => {
  if (arr) {
      return arr.join('，')
  }
})


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
