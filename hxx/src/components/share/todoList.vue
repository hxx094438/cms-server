<template>
    <section class="real-app">

        <div class='wrap_items wrap_posts' v-if="!loading">
            <CardList :items="items" :loading='loading' :enterActiveClass='enterActiveClass' />
        </div>

        <div class="loading" v-if="loading">
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
        </div>
    </section>

</template>

<script>
  import { mapState, mapGetters } from 'vuex'
  import CardList from './CardList'

  export default {
    name: 'todoList',
    props: {
      cid: Number
    },
    data () {
      return {
        enterActiveClass: 'fadeIn'
        // leaveActiveClass : 'fadeOutLeft'
      }
    },
    beforeMount () {
      if (this.$root._isMounted) {
//        this.loadData()
        console.log('$root挂载')
      }
    },
    methods: {
//      loadData (to = this.currentPage, from = -1) {
//        this.enterActiveClass = from === -1
//          ? 'fadeIn'
//          : to < from ? 'fadeInLeft' : 'fadeInRight'
//        this.$store.dispatch('GET_ITEM_DATA', {
//          cid: this.cid,
//          currentPage: Number(this.$store.state.route.params.page) || 1
//        })
//      }
    },
    computed: Object.assign({},mapState(['isLoading'])),
    watch: {
      currentPage (to, from) {
//        this.loadData(to, from)
        console.log('to',to,'from',from)
      }
    },
    components: {
      CardList,
    }
  }



</script>

<style lang="scss" rel="stylesheet/scss" scoped>
    .loading{
        height: 1.5rem;
        margin: 1.875rem auto 1.875rem;
        display: flex;
        justify-content: center;
        flex-wrap: nowrap;
        align-items: center;
    }
    .loading span{
        display: inline-block;
        width: 0.9375rem;
        height: 0.9375rem;
        margin-right: 0.5rem;
        border-radius: 50%;
        background: rgb(129, 216, 208);
        -webkit-animation: load 1.04s ease infinite;
    }
    .loading span:last-child{
        margin-right: 0;
    }
    @-webkit-keyframes load{
        0%{
            opacity: 1;
        }
        100%{
            opacity: 0;
        }
    }
    .loading span:nth-child(1){
        -webkit-animation-delay:0.13s;
    }
    .loading span:nth-child(2){
        -webkit-animation-delay:0.26s;
    }
    .loading span:nth-child(3){
        -webkit-animation-delay:0.39s;
    }
    .loading span:nth-child(4){
        -webkit-animation-delay:0.52s;
    }
    .loading span:nth-child(5){
        -webkit-animation-delay:0.65s;
    }
</style>
