// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import VueResource from 'vue-resource'
import App from './App'
import router from './router'
import store from './store'
import './assets/css/index.scss'

Vue.config.productionTip = false

Vue.use(VueResource)

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

// 刷新页面的时候未经过拦截器处理
Vue.http.interceptors.push((request, next) => {
    if (window.localStorage.getItem('token')) {
        request.headers.set('authorization', 'Bearer ' + window.localStorage.getItem('token'))
    }
    next((response) => {
        if(response.url === '/api/login'){
            if (response.status === 200 && response.body === '账号或密码错误') {
                store.commit('unset_user')
            }
        }
        return response
    })
})

/* eslint-disable no-new */
new Vue({
    el: '#app',
    store,
    router,
    components: {App},
    template: '<App/>'
})
