<template>
    <aside class="article_side">
        <div class="like">
            <i class="iconfont icon-like rubberBand" :class="{'activeLike': isLiked}"
               @click="giveLive(article.aid)"></i>
            <span>{{article.ArticleLike}}</span>
        </div>
        <div class="comment">
            <i class="iconfont icon-huifu"></i>
            <span>{{article.comment_n}}</span>
        </div>
    </aside>
</template>

<script>
    import {mapActions, mapState, mapMutations, mapGetters} from 'vuex'
    import {_debounce} from '../../../lib/utils.js'

    export default {
        name: 'likeBar',
        data() {
            return {
                isLikeArr: []
            }
        },
        created() {
            this.init()
            console.log(this.isLikeArr)
        },
        computed: {
            ...mapState(['article']),
            isLiked() {
                return this.isLikeArr.includes(this.article.aid)
            }
        },

        methods: {
            ...mapActions(['updateArticleLike']),
            giveLive(aid) {
                console.log(this.isLike)
                if (this.isLiked === false) {
                    this.updateArticleLike(aid).then(() => {

                        this.isLikeArr.push(this.article.aid)
                        window.localStorage.setItem('LIKE_ARTICLS', JSON.stringify(this.isLikeArr))
                    }).catch((err) => {
                        console.log(err)
                    })
                }
            },
            init() {
                this.isLikeArr = JSON.parse(window.localStorage.getItem('LIKE_ARTICLS') || '[]')
            }
        },


    }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
    @import '../../../assets/css/icon.scss';

    .icon-like, .icon-huifu {
        font-size: 24px;
    }

    .article_side {
        position: fixed;
        bottom: 12rem;
        left: 8rem;
        .like {
            text-align: center;
            line-height: 3rem;
            width: 3rem;
            height: 3rem;
            position: relative;
            border: 1px solid #eee;
            box-shadow: 0 2px 4px 0 rgba(0,0,0,.04);
            border-radius: 50%;
            cursor: pointer;
            margin-bottom: 1rem;
            transition-duration: .2s;
            &:hover{
                border-color: #ccc;
            }
            span {
                position: absolute;
                right: 0;
                top: 0;
                line-height: 1;
            }
        }
        .comment {
            text-align: center;
            line-height: 3rem;
            width: 3rem;
            height: 3rem;
            position: relative;
            border: 1px solid #eee;
            box-shadow: 0 2px 4px 0 rgba(0,0,0,.04);
            border-radius: 50%;
            cursor: pointer;
            transition-duration: .2s;
            &:hover{
                border-color: #ccc;
            }
            span {
                position: absolute;
                right: 0;
                top: 0;
                line-height: 1;
            }
        }

        .activeLike {
            color: #ea6f5a;
        }
    }


</style>
