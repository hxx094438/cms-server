<template>
    <div class="wrapper">
        <div class="login">
            <i class="iconfont icon-icon69"></i>
            <div>
                <input type="text" placeholder="请输入你的账号" v-model="name"/>
                <i class="iconfont">&#xe8f3;</i>
            </div>
            <div>
                <input type="password" placeholder="请输入你的密码" v-model="password" @keydown.enter="confirm(name, password)"/>
                <i class="iconfont">&#xe8f2;</i>
            </div>
            <p>{{info}}</p>
            <button @click="confirm(name, password)"><span>登录</span></button>
        </div>
    </div>
</template>

<script>
import {mapActions, mapMutations}       from 'vuex'
import {_debounce} from '../../lib/utils.js'
export default {
    data () {
        return {
            name: '',
            password: '',
            info: ''
        }
    },
    methods: {
      ...mapActions(['login']),
      ...mapMutations(['set_user']),
      confirm (name, password) {
        this.login({name: name, password: password}).then((res) => {
            console.log(res)
            if(res.data === '账号或密码错误'){
                this.info = '账号或密码错误'
            }else{
                this.info = '正在登录中...'
                this.set_user(res.data)
                this.$router.push({name:'posts'})
            }
        }).catch((err) => {console.log(err)})
      }
    },
    watch: {
        name () {
            this.info = ''
        },
        password () {
            this.info = ''
        }
    }
}
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
.wrapper {
    .login {
        width: 16.125rem;
        height: 20rem;
        margin: 7rem auto 0;
        text-align: center;
        position: relative;
        .icon-icon69 {
            font-size: 3.75rem;
            color: #000;
        }
        div {
            width: 100%;
            margin: 0 auto;
            position: relative;
            i {
                color: #000;
                font-size: 1.875rem;
                display: block;
                position: absolute;
                top: 0;
                left: 0;
                transition:  0.5s;
            }
        }
        input {
            width: 12.5rem;
            height: 1.875rem;
            display: block;
            margin-top: 2.5rem;
            margin-bottom: 1.25rem;
            margin-left: 3rem;
            outline: none;
            border: none;
            border-bottom: 1px solid #eee;
            background: transparent;
            color: #333;
            font-size: 1rem;
            padding-left: 0.625rem;
            &:focus + i {
                 color: #ffc520;
             }
        }
        button {
            width: 12.5rem;
            padding-left: 0;
            margin-top: 1.25rem;
            position: relative;
            left: 1.25rem;
            text-align: center;
            color: #444;
            border: 1px solid #eee;
            background: transparent;
            &:hover{
                border-color: #666;
            }
        }
    }
}

p {
    color: #666;
    width: 100%;
    height: 1.25rem;
}
@media screen and (max-width: 440px) {
    .login {
        margin-top: 2rem !important;
    }
}
</style>
