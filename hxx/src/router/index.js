import Vue from 'vue'
import Store from '../store'
import Router from 'vue-router'


const login = resolve => require(['@/components/back/login'], resolve)
const posts = resolve => require(['@/components/back/posts'], resolve)
const admin = resolve => require(['@/components/back/admin'], resolve)

Vue.use(Router)

export default new Router({
    mode: 'history',
    scrollBehavior(to, from, savedPosition) {
        if (to.hash) {
            return {
                selector: to.hash
            }
        } else {
            return {x: 0, y: 0}
        }
    },
    routes: [
        {
            path: '/',
            name: 'login',
            component: login,
            meta: {title: '登录页面'}
        },
        {
            path:'/admin',
            redirect:'admin/posts',
            component: admin,
            children: [
                {path:'posts',name:'posts', component: posts, meta:{requireAuth:true, title:'博客文章'}},


            ]
        }
    ]
})
