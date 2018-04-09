<template>
    <transition name="huojian" enter-active-class="animated bounceIn" leave-active-class="animated fadeOut">
        <a @click="getTop" class="rocket" v-if="show"><i class="iconfont icon-huojian" ></i></a>
    </transition>
</template>

<script>
    export default {
        name: 'backTop',
        props: {
            scrollmyself:{
                type:Boolean,
                default:false
            }
        },
        data() {
            return {
                show:false
            }
        },
        mounted () {
            window.addEventListener('scroll', this.handleScroll)
        },
        methods: {
            handleScroll () {
                this.show = window.scrollY > 400
            },
            getTop(){
                let timer = setInterval(() => {
                    let top = document.documentElement.scrollTop
                    let speed = Math.ceil(top / 5)
                    document.documentElement.scrollTop = top - speed
                    if (top === 0) {
                        clearInterval(timer)
                    }
                }, 20)
            }
        },
        beforeDestroy () {
            //  组件销毁的时候，需要删除scroll的监听事件。
            this.removeEventListener('scroll', this.showIcon)
        }
    }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
    @import '../../assets/css/icon.scss';
    .totop {
        bottom: 31.25rem;
        transition: 1s;
    }
    .icon-huojian {
        font-size: 2.5rem;
        color: #C0CCDA;
        position: fixed;
        bottom: 1.25rem;
        right: 2.5rem;
        cursor: pointer;
        transition: 1s;
    &:hover {
         bottom: 1.875rem;
         color: #00ff7f;
         transition:  1s;
     }
    }

    @media screen and (max-width: 440px) {
        .icon-huojian {
            right: 0.5rem;
        }
    }
</style>
