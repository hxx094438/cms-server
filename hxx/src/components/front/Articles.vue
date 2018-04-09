<template>
    <div class="articleContent">
        <div id="articles">
            <div class="tags animated fadeIn">
                <div class="tagFlex">
                    <button
                          v-for="(tag, index) in allTags"
                          v-bind:class="{activeBtn: selectIndex === index}"
                          v-on:click="switchTag({value: tag, page: 1}, index, tag)"
                          >
                        <span>{{tag}}</span>
                    </button>
                </div>
            </div>
            <div v-for="(article, index) in reducedArticles" id="article" class="animated fadeIn">
                <router-link :to="{name:'article', params:{id: article.aid, index: index, page:page}, hash: '#article'}" tag="a" exact class="title_1">{{article.title}}
                </router-link>
                <div class="option">
                    <time><i class="iconfont icon-shijian"></i>{{article.date | toDate}}</time>
                    <span class="articleTag"><i class="iconfont icon-label"></i>{{article.tags | toTag}}</span>
                    <span class="commentNumber"><i class="iconfont icon-huifu"></i>{{article.comment_n}}</span>
                </div>

                <p>{{article.content}}</p>
                <router-link :to="{name:'article', params: {id: article.aid, index: index, page: page}, hash: '#article'}" tag="button" exact>
                    <span>Continue reading</span>
                </router-link>
            </div>
            <p v-if="!loadMore" @click="loadTags" v-show="!noMore" class="noMore animated fadeIn">more</p>
            <p v-if="noMore" class="noMore animated fadeIn">end</p>
        </div>
        <spinner v-show="loadMore" class="spinner"></spinner>
    </div>
</template>

<script>
import {mapMutations, mapActions, mapGetters, mapState}     from 'vuex'
import spinner                                              from '../share/spinner'

export default {
    data () {
        return {
            selectIndex: 0,
            page: 1
        }
    },
    created () {
        this.set_headline({
            content: '文章见解',
            animation: 'animated flipInY'
        })
        this.getAllArticles({page: 1})
        this.getAllTags()
    },
    computed: {
        ...mapGetters(['reducedArticles', 'allTags']),
        ...mapState(['curTag', 'loadMore', 'moreArticle', 'isLoading', 'noMore'])
    },

    beforeRouteLeave (to, from, next) {
        window.removeEventListener('scroll', this.handleScroll)
        next()
    },
    methods: {
        ...mapMutations(['set_headline', 'set_curtag', 'moreArticle_toggle']),
        ...mapActions(['getAllArticles', 'getAllTags', 'searchArticles']),
        switchTag (payload, index, tag) {
            this.getAllArticles(payload)
            this.selectIndex = index
            this.set_curtag(tag)
        },
        loadTags () {
            if (!this.isLoading && this.$route.name === 'articles') {
                this.getAllArticles({value: this.curTag, add: true, page: ++this.page})
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
.articleContent {
    #articles {
        padding: 1.875rem 12.5rem 0;
        .tags {
            .tagFlex {
                display: flex;
                flex-wrap: wrap;
                justify-content: flex-start;
                overflow: hidden;
                .activeBtn {
                    font-weight: 600;
                    color: #333;
                    transition:  1s;
                }
                button {
                    transition:  1s;
                    padding-left: 1rem;
                    padding-right: 0.2rem;
                    text-align: center;
                    background: transparent;
                    margin: 0 1.25rem 1.25rem 0;
                    span{
                        color: #666;
                    }
                    &:hover span{
                        color: #333;
                    }
                }
            }
        }
        div#article {
            color: #333;
            width: 100%;
            border-bottom: 1px solid #eee;
            padding-top: 1rem;
            h2 {
                margin-top: 1.875rem;
                margin-bottom: 1.25rem;
            }
            time {
                margin-top: 0.625rem;
                margin-right: 0.625rem;
            }
            p {
                white-space: pre-wrap;
                word-wrap: break-word;
                margin-top: 1.875rem;
                margin-bottom: 1.875rem;
            }
            button {
                width: 8.75rem;
                height: 2.5rem;
                line-height: 2.5rem;
                margin-bottom: 1.25rem;
                border-radius: 0.25rem;
                margin-left: calc(100% - 8.75rem);
            }
            .title_1 {
                color: #333;
                font-size: 1.5rem;
                font-weight: bold;
                &:hover{
                    underline: currentColor;
                }
            }
            .option{
                padding-top: 1rem;
                line-height: 2rem;
                color: #666;
                .articleTag {
                    margin-bottom: 1.875rem;
                    margin-right: 0.625rem;
                }
                .commentNumber {
                    color: #333;
                    i {
                        font-size: 1.125rem;
                        margin-right: 0.3125rem;
                    }
                }
                i.icon-label, i.icon-shijian {
                    color: #333;
                    font-size: 1.25rem;
                    margin-right: 0.3125rem;
                }
            }


        }
        p.noMore {
            width: 100%;
            height: 1.5rem;
            line-height: 1.5rem;
            color: #333;
            margin-top: 1.875rem;
            margin-bottom: 1.875rem;
        }
    }
}
@media screen and (max-width: 440px) {
    #articles {
        padding-left: 1rem !important;
        padding-right: 1rem !important;
    }
}
</style>
