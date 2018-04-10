<template>
    <div class="account">
        <p class="icon"><i class="iconfont icon-icon69"></i></p>
        <div>
            <input type="text" placeholder="请输入新的用户名" v-model="name"/>
            <i class="iconfont icon-zhanghu"></i>
        </div>
        <div>
            <input type="password" placeholder="请输入你的密码" v-model="password"/>
            <i class="iconfont icon-yuechi"></i>
        </div>
        <div>
            <input type="password" placeholder="请再次输入你的密码" v-model="repassword"/>
            <i class="iconfont icon-yuechi"></i>
        </div>
        <transition name="fade" enter-active-class="animated fadeIn"><p v-if="show">{{msg}}</p></transition>
        <button @click="reset()"><span>确认修改</span></button>
    </div>
</template>

<script>
    import {_debounce} from '../../lib/utils.js'
    import {mapActions, mapState} from 'vuex'

    export default {
        data() {
            return {
                msg: 'haha',
                name: '',
                password: '',
                repassword: '',
                show: false,
            }
        },
        created() {
        },
        computed: {
            ...mapState(['user'])
        },
        methods: {
            ...mapActions(['resetUser']),
            reset() {
                if (this.repassword === this.password) {
                    this.resetUser({id: this.user.id, name: this.name, password: this.password})
                }
            }
        },
        watch: {
            name: _debounce(
                function () {
                    if (this.name.length < 2) {
                        this.msg = '名字太短了'
                        this.show = true
                    } else {
                        this.msg = ''
                        this.show = false
                    }
                }, 500),
            password: _debounce(
                function () {
                    if (this.password.length < 6) {
                        this.msg = '密码太短了'
                        this.show = true
                    } else {
                        this.msg = ''
                        this.show = false
                    }
                }, 500),
            repassword: _debounce(
                function () {
                    if (this.password != this.repassword) {
                        this.msg = '两次输入的密码不一样'
                        this.show = true
                    } else {
                        this.msg = ''
                        this.show = false
                    }
                }, 500)
        }
    }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
    .account {
        position: relative;
        margin: 5rem auto 2rem;
        height: 25rem;
        p.icon {
            width: calc(100% - 6.25rem);
            text-align: center;
            margin: 0 auto 6.25rem;
            .icon-icon69 {
                font-size: 3.75rem;
                color: #000;
            }
        }
        div {
            width: 18.75rem;
            margin: 0 auto;
            position: relative;
            i {
                color: #000;
                font-size: 1.875rem;
                display: block;
                position: absolute;
                top: 0;
                left: 1.25rem;
                transition: 0.5s;
            }
        }
        input {
            width: 12.5rem;
            height: 1.875rem;
            display: block;
            margin-top: 2.5rem;
            margin-bottom: 1.25rem;
            margin-left: 4.375rem;
            outline: none;
            border: none;
            border-bottom: 1px solid #eee;
            background: transparent;
            color: #333;
            font-size: 1rem;
            padding-left: 0.625rem;
            &:focus + i {
                color: darkturquoise;
            }
        }
        button {
            width: 12.5rem;
            position: absolute;
            bottom: 0;
            left: 50%;
            margin-left: -5rem;
            background: transparent;
            color: #444;
            border: 1px solid #eee;
            &:hover{
                border: 1px solid #444;
            }
        }
    }

    p {
        text-align: center;
        height: 1rem;
        color: rgb(129, 216, 208);
    }

    .fade-leave-active {
        transition: opacity .5s
    }

    .fade-enter, .fade-leave-active {
        opacity: 0
    }
</style>
