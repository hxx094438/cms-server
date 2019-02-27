<template>
    <div id="app">
        <router-view/>
        <transition enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">
            <dialog-box v-if="dialog.show"></dialog-box>
        </transition>
    </div>
</template>

<script>
    import DialogBox from './components/share/DialogBox'
    import {mapState} from 'vuex'

    export default {
        name: 'App',
        mounted () {
//            document.addEventListener('visibilitychange', this.changeTitle, false)
        },
        components: {
            DialogBox
        },
        computed:{
            ...mapState(['isLoading','dialog'])
        },
        methods: {
            changeTitle () {            // 切换标签页后，改变title
//                if (document.hidden) {
//                    document.title = 'waiting'
//                } else {
//                    document.title = 'welcome!'
//                }
            }
        }
    }
</script>

<style>
    #app {
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        color: #2c3e50;
    }
    @media screen and (max-width: 440px) {
        .fire {
            display: none;
        }
        #app {
            background: #fff;
        }
    }
</style>
