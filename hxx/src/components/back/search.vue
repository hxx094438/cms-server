<template>
    <div class="search_container">
        <div class="search_box">
            <div class="searchString">
                搜索匹配：
                <label for="title"><input type="radio" value="title" id="title" v-model="picked"/>标题</label>
                <label for="tags"><input type="radio" value="tags" id="tags" v-model="picked"/>标签</label>
                <label for="date"><input type="radio" value="date" id="date" v-model="picked"/>日期</label>
            </div>
            <div class="search">
                <input
                        type="text" v-model="text"
                        :placeholder="tip" onfocus="this.placeholder=''"
                        @keydown.enter="searchArticles({key: picked, value: text, page: page})"
                />
                <i class="iconfont icon-search" @click="searchArticles({key: picked, value: text, page: page})"></i>
            </div>
        </div>
        <p>搜索结果</p>
        <article-content v-on:addPage="nextPage" v-on:dropPage="prePage" :page="page"></article-content>
    </div>
</template>

<script>
    import ArticleContent from './component/ArticleContent'
    import {mapActions, mapMutations,mapState} from 'vuex'

    export default {
        data() {
            return {
                picked: 'title',
                text: '',
                page: 1
            }
        },
        created() {
            this.getAllArticles({page: this.page, limit: 4})
            // this.set_all_articles({})
            // console.log(this.articles)
        },
        computed:{
            ...mapState(['articles','pageTotal']),
            tip() {
                if (this.picked === 'title') return '请输入标题的部分内容'
                if (this.picked === 'tags') return '请输入完整的标签，多个标签空格隔开'
                if (this.picked === 'date') return '检索格式： 2017-12-01'
            }
        },
        methods: {
            ...mapActions(['searchArticles','getAllArticles']),
            ...mapMutations(['set_all_articles']),
            nextPage () {
                if(this.page < this.pageTotal){
                    this.page++
                    this.searchArticles({key: this.picked, value: this.text, page: this.page, limit: 4})
                }else{
                    alert('没有更多了！')
                }
            },
            prePage() {
                if (!(this.page - 1)) {
                    alert('已经到第一页咯')
                } else {
                    this.page--
                    this.searchArticles({key: this.picked, value: this.text, page: this.page, limit: 4})
                }
            }
        },
        components: {
            ArticleContent
        }
    }


</script>


<style lang="scss" rel="stylesheet/scss" scoped>
    .search_container {
        max-width: 82%;
        text-align: center;
        padding-bottom: 2rem;
        .search_box{
            display: flex;
            justify-content: space-between;
            line-height: 2.8125rem;
            margin-bottom: 2rem;
            .search {
                width: 40%;
                position: relative;
                input {
                    width: 100%;
                    height: 2.8125rem;
                    font-size: 1.25rem;
                    color: #999;
                    padding:0 1.5rem;
                    border: 0.0625rem #eee solid;
                    border-radius: 1.875rem;
                    outline: none;

                    color: #333;
                    background: transparent;
                    &:hover {
                        border-color: #8391a5;
                        transition: all 0.8s;
                    }
                }
                i {
                    position: absolute;
                    right: 0;
                    top: 50%;
                    transform: translate(0,-50%);
                    color: #999;
                    font-size: 2.5rem;
                    cursor: pointer;
                    &:hover {
                        border-color: rgb(32, 32, 32);
                        transition: all 0.8s;
                    }
                }
            }
            .searchString {
                width: 60%;
                color: #333;
                font-size: 1.25rem;
                input {
                    outline: none;
                    cursor: pointer;
                    margin-right: 0.625rem;
                }
                label {
                    margin-right: 1.25rem;
                    cursor: pointer;
                }
            }
        }

        p {
            border-bottom: 0.1875rem double rgb(129, 216, 208);
            width: 12.5rem;
            font-size: 1.875rem;
            margin: 0 auto 2.5rem;
            padding-bottom: 0.625rem;
            color: #333;
        }
    }

    @media screen and (max-width: 440px) {
        .search {
            input {
                width: 80% !important;
            }
        }
    }
</style>
