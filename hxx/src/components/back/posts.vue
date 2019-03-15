<template>
  <div class="content">
    <p>所有文章</p>
    <article-content v-on:addPage="nextPage" v-on:dropPage="prePage" :page="page"></article-content>
    <router-link
      :to="{name: 'editor'}"
      class="addPost" tag="button"
    ><span>添加文章</span></router-link>
  </div>
</template>

<script>
  import {mapActions, mapState} from 'vuex'
  import ArticleContent from './component/ArticleContent'

  export default {
    created() {
//      this.getAllArticles({page: this.page, limit: 4})
    },
    data() {
      return {
        page: 1,
      }
    },

    asyncData ({ store }) {
      return store.dispatch('getAllArticles', {page: 1, limit: 4})
//      return store.dispatch('getAllArticles', {page: this.page, limit: 4})
    },

    methods: {
      ...mapActions(['getAllArticles']),
      nextPage() {
        if (this.page < this.pageTotal) {
          this.page++
          this.getAllArticles({page: this.page, limit: 4})
        } else {
          alert('没有更多了！')
        }
      },
      prePage() {
        if (!(this.page - 1)) {
          alert('已经到第一页咯')
        } else {
          this.page--
          this.getAllArticles({page: this.page, limit: 4})
        }
      }
    },
    computed: {
      ...mapState(['articles', 'pageTotal']),
    },
    components: {
      ArticleContent
    }
  }

</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  .content {
    max-width: 82%;
    padding-top: 0.625rem;
    color: #666;
    position: relative;
    p {
      border-bottom: 1px solid #eee;
      width: 20%;
      font-size: 1.875rem;
      margin: 0 auto 2.5rem;
      padding-bottom: 0.625rem;
      text-align: center;
    }
    .addPost {
      position: absolute;
      left: -15%;
      bottom: 5%;
    }
  }

  @media screen and (max-width: 440px) {
    .content {
      padding-top: 2rem !important;
      margin-bottom: 4rem;
      .addPost {
        position: absolute !important;
        bottom: -3rem !important;
      }
    }
  }
</style>
