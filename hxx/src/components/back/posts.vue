<template>
    <div class="wrapper">
        <p>所有文章</p>
        <article-content v-on:addPage="nextPage" v-on:dropPage="prePage" :page="page"></article-content>
        <router-link
                :to="{name: 'editor'}"
                class="addPost" tag="button"
        ><span>添加文章</span></router-link>
    </div>
</template>

<script>
import {mapActions, mapState}   from 'vuex'
import ArticleContent           from './component/ArticleContent'

export default {
    created () {
        this.getAllArticles({page: this.page, limit: 4})
    },
    data () {
        return {
            page: 1,
        }
    },
    methods: {
        ...mapActions(['getAllArticles']),
        nextPage () {
            if(this.page < this.pageTotal){
                this.page++
                this.getAllArticles({page: this.page, limit: 4})
            }else{
                alert('没有更多了！')
            }
        },
        prePage () {
            if (!(this.page - 1)) {
                alert('已经到第一页咯')
            } else {
                this.page--
                this.getAllArticles({page: this.page, limit: 4})
            }
        }
    },
    computed: {
        ...mapState(['articles','pageTotal']),
    },
    components: {
        ArticleContent
    }
}

</script>

<style lang="scss" rel="stylesheet/scss" scoped>
.wrapper {
    position: relative;
    padding-top: 0.625rem;
    /*height: 35.625rem;*/
    color: #666;
    p {
        border-bottom: 0.1875rem double rgb(129, 216, 208);
        width: 12.5rem;
        font-size: 1.875rem;
        margin:0 auto 2.5rem;
        padding-bottom: 0.625rem;
        text-align: center;
    }
    .addPost {
        position: fixed;
        bottom: 1.25rem;
        right: 1.25rem;
    }
}
@media screen and (max-width: 440px) {
    .wrapper {
        padding-top: 2rem !important;
        margin-bottom: 4rem;
        .addPost {
            position: absolute !important;
            bottom: -3rem !important;
        }
    }
}
</style>
