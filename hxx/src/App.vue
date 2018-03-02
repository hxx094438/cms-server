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
        components: {
            DialogBox
        },
        computed:{
            ...mapState(['isLoading','dialog'])
        }
    }
</script>

<style>
    #app {
        font-family: 'Avenir', Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
        color: #2c3e50;
        margin-top: 60px;
    }
    @media screen and (max-width: 440px) {
        .fire {
            display: none;
        }
        #app {
            background: #000;
        }
    }
</style>
