<template>
    <div id="wrapper">
        <my-header></my-header>
        <router-view class="content" v-show="!isLoading"></router-view>
        <spinner v-show="isLoading"></spinner>
        <back-top :scrollmyself = 'true'></back-top>
        <my-footer></my-footer>
    </div>
</template>

<script>
import MyHeader         from './component/MyHeader'
import MyFooter         from './component/MyFooter'
import spinner          from '../share/spinner'
import backTop          from '../share/backTop'
import {mapState}       from 'vuex'

export default {
    data () {
        return {

        }
    },

    computed: {
        ...mapState(['isLoading'])
    },

    components: {
        MyHeader,
        MyFooter,
        spinner,
        backTop
    }
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
@import '../../assets/css/icon.scss';
#wrapper {
    margin: 0 auto;
}
h1 {
    color: white;
    text-align: center;
}


</style>
