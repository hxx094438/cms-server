<template>
    <div id="search">
        <div v-for="(article, index) in reducedArticles" id="article">
            <h2>{{article.title}}</h2>
            <time><i class="iconfont icon-shijian"></i>{{article.date | toDate}}</time>
            <span class="articleTag"><i class="iconfont icon-label"></i>{{article.tags | toTag}}</span>
            <span class="commentNumber"><i class="iconfont icon-huifu"></i>{{article.comment_n}}</span>
            <p>{{article.content}}</p>
            <router-link :to="{name: 'article', params: {id: article.aid, index: index, page: page}, hash: '#article'}" tag="button" exact>
                <span><i>Read More</i></span>
            </router-link>
        </div>
        <spinner v-show="loadMore" class="loading"></spinner>
        <p v-if="!loadMore" @click="loadSearch" v-show="!noMore" class="noMore animated fadeIn"><i>more</i></p>
        <p v-if="noMore" class="noMore animated fadeIn"><i>end</i></p>
    </div>
</template>

<script>
import {mapState, mapActions, mapMutations, mapGetters}     from 'vuex'
import spinner                                              from '../share/spinner'

export default {
    data () {
        return {
            page: 1
        }
    },
    created () {
        this.searchArticles({key: 'title', value: this.$route.params.text})
        this.set_headline({
            content: '搜索结果',
            animation: 'animated rotateIn'
        })
    },
    beforeRouteUpdate (to, from, next) {
        if (to.params.text) {
            this.searchArticles({key: 'title', value: to.params.text})
        }
        next()
    },
    mounted () {
        window.addEventListener('scroll', this.handleScroll)
    },
    beforeRouteLeave (to, from, next) {
        window.removeEventListener('scroll', this.handleScroll)
        next()
    },
    computed: {
        ...mapState(['loadMore', 'moreArticle', 'isLoading', 'noMore']),
        ...mapGetters(['reducedArticles'])
    },
    methods: {
        ...mapActions(['searchArticles']),
        ...mapMutations(['set_headline']),
//        handleScroll () {
//            if (!this.isLoading && this.$route.name === 'SearchResult') {
//                const body = document.body
//                const totalHeight = body.scrollHeight
//                const scrollTop = body.scrollTop
//                const clientHeight = window.innerHeight
//                if (totalHeight - scrollTop - clientHeight === 0 && this.moreArticle) {
//                    this.searchArticles({key: 'title', value: this.$route.params.text, add: true, page: ++this.page})
//                }
//                if (!this.moreArticle) {
//                    this.page = 1
//                }
//            }
//        },
        loadSearch () {
            if (!this.isLoading && this.$route.name === 'search') {
                this.searchArticles({key: 'title', value: this.$route.params.text, add: true, page: ++this.page})
                if (!this.moreArticle) {
                    this.page = 1
                }
            }
        }
    },
    components: {
        spinner
    }
}

</script>

<style lang="scss" rel="stylesheet/scss" scoped>
#search {
    padding: 0 12.5rem 0;
    div#article {
        color: #555;
        width: 100%;
        border-bottom: 1px solid #eee;
        h2 {
            margin-top: 1.875rem;
            margin-bottom: 1.25rem;
            color: #333;
        }
        time {
            margin-top: 0.625rem;
            color: #7f8c8d;
        }
        p {
            white-space: pre-wrap;
            word-wrap: break-word;
            margin-top: 1.875rem;
            margin-bottom: 1.875rem;
        }
        button {
            margin-top: 0;
            background: transparent;
            font-weight: 600;
            border-bottom: 1px solid #eee;
            span{
                color: #666;
            }
        }
        .articleTag {
            margin-left: 1.25rem;
            margin-bottom: 1.875rem;
            color: #7f8c8d;
        }
        .commentNumber {
            margin-left: 0.625rem;
            color: #666;
            i {
                font-size: 1.125rem;
                margin-right: 0.3125rem;
            }
        }
        i.icon-label, i.icon-shijian {
            color: #7f8c8d;
            font-size: 1.25rem;
            margin-right: 0.3125rem;
        }
    }
    p.noMore {
        width: 100%;
        color: #333;
        margin-top: 1.875rem;
        margin-bottom: 1.875rem;
    }
}
@media screen and (max-width: 440px) {
    #search {
        padding-left: 1rem !important;
        padding-right: 1rem !important;
    }
}
</style>
