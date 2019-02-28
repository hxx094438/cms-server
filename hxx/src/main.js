// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import VueResource from 'vue-resource'
import axios from 'axios'
import App from './App'
// import router from './router'
// import store from './store'

import { createStore } from './store'
import { createRouter } from './router'
import { sync } from 'vuex-router-sync'

import './assets/css/index.scss'

Vue.config.productionTip = false

Vue.use(VueResource)

axios.defaults.withCredentials = true

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

Vue.prototype.axios = axios

// 刷新页面的时候未经过拦截器处理
Vue.http.interceptors.push((request, next) => {
    // if (window.localStorage.getItem('token')) {
    //     request.headers.set('authorization', 'Bearer ' + window.localStorage.getItem('token'))
    // }
    next((response) => {
        if(response.url === '/api/login'){
            if (response.status === 200 && response.body === '账号或密码错误') {
                store.commit('unset_user')
            }
        }
        return response
    })
})

export function createApp () {
  // create store and router instances
  const store = createStore()
  const router = createRouter()

  // sync the router with the vuex store.
  // this registers `store.state.route`
  sync(store, router)

  // create the app instance.
  // here we inject the router, store and ssr context to all child components,
  // making them available everywhere as `this.$router` and `this.$store`.
  const app = new Vue({
    router,
    store,
    render: h => h(App)
  })

  // expose the app, the router and the store.
  // note we are not mounting the app here, since bootstrapping will be
  // different depending on whether we are in a browser or on the server.
  return { app, router, store }
}

/* eslint-disable no-new */
// new Vue({
//     el: '#app',
//     store,
//     router,
//     components: {App},
//     template: '<App/>'
// })
