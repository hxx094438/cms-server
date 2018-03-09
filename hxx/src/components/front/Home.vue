<template>
    <div class="container">
        <section class="newBlog">
            <a href="#lastPost" class="title animated bounceIn">
                <p class="headline" id="lastPost">最近更新</p>
            </a>
            <div class="posts animated fadeIn">
                <div class="flex">
                    <div v-for="(article, index) in reducedArticles" class="oneArticle">
                        <router-link
                                :to="{name: 'article', params: {id: article.aid, index: index, page: 1}, hash: '#article'}"
                                tag="p" exact class="title_1">{{article.title}}
                        </router-link>
                        <div class="option">
                            <time>{{article.date | toDate}}</time>
                            <span class="commentNumber"><i class="iconfont icon-huifu"></i>{{article.comment_n}}</span>
                        </div>

                        <p class="content">{{article.content}}</p>
                        <router-link
                                :to="{name: 'article', params: {id: article.aid, index: index, page: 1}, hash: '#article'}"
                                tag="button" exact><span>Read More</span></router-link>
                    </div>
                </div>
            </div>
        </section>
        <section class="contact">
            <a href="#contactMe" class="title animated bounceIn">
                <p class="headline" id="contactMe">Contact me</p>
            </a>
            <div class="email animated fadeIn">
                <input type="text" placeholder=" 邮件主题" v-model="subject"/>
                <input type="text" placeholder=" 邮箱" v-model="address"/>
                <textarea placeholder=" 来唠唠嗑呗" spellcheck="false" v-model="content"></textarea>
                <button class="sendEmail" @click="send" :disabled="sendFlag">
                    <span>{{sendFlag ? '发送中...' : '确认'}}</span>
                </button>
            </div>
        </section>
    </div>
</template>

<script>
    import {mapMutations, mapActions, mapGetters} from 'vuex'

    export default {
        data() {
            return {
                subject: '',
                address: '',
                content: '',
                sendFlag: false
            }
        },
        created() {
            this.set_headline({
                content: 'Welcome to my blog',
                animation: 'animated bounceIn'
            })
            this.getAllArticles({page: 1, limit: 5})
        },
        computed: {
            ...mapGetters(['reducedArticles'])
        },
        methods: {
            ...mapMutations(['set_headline', 'set_dialog']),
            ...mapActions(['getAllArticles', 'sendMail']),
            send() {
                const re = /^[\w_-]+@[\w_-]+\.[\w\\.]+$/
                if (!this.subject || !this.content) {
                    this.set_dialog({
                        info: '还有选项没填(⊙o⊙)？',
                        hasTwoBtn: false,
                        show: true
                    })
                    return
                } else if (!re.test(this.address)) {
                    this.set_dialog({
                        info: '请正确填写邮箱地址',
                        hasTwoBtn: false,
                        show: true
                    })
                    return
                }
                this.sendFlag = true
                this.sendMail({
                    subject: this.subject,
                    address: this.address,
                    content: this.content
                }).then(() => {
                    this.subject = ''
                    this.content = ''
                    this.address = ''
                    this.sendFlag = false
                }).catch(() => {
                    this.sendFlag = false
                    this.set_dialog({
                        info: 'sorry, 邮件发送失败，请重新发送',
                        hasTwoBtn: false,
                        show: true
                    })
                })
            }
        }
    }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
    .container {
        .newBlog {
            min-height: 43.75rem;
            width: 60rem;
            margin: 0 auto;
            .title {
                margin-bottom: 4.75rem;
                p {
                    padding-top: 2.8125rem;
                    width: 13rem;
                }
            }
            .posts {
                margin-top: 1rem;
                .flex {
                    color: #666;
                    padding-left: 1rem;
                    padding-right: 1rem;
                    div.oneArticle {
                        padding-bottom: 2rem;
                        .title_1 {
                            color: #333;
                            font-size: 1.5rem;
                            font-weight: bold;
                        }
                        .option {
                            display: flex;
                            flex-wrap: wrap;
                            justify-content: flex-start;
                            padding-top: 1rem;
                            line-height: 2rem;
                            time {
                                color: #7f8c8d;
                                flex-shrink: 1;
                                width: 8rem;
                                display: inline-block;
                                font-size: .8rem;
                            }
                            .commentNumber {
                                padding-left: 1rem;
                                flex-shrink: 1;
                            }
                        }
                        .content{
                            padding: 1rem 0;
                        }
                    }
                }
            }
        }
        .contact {
            background: rgba(0, 0, 0, 0.8);
            padding: 0 1rem;
            padding-bottom: 2rem;
            min-height: 30rem;
            .title {
                color: white;
                margin-bottom: 3.75rem;
                p {
                    padding-top: 2.8125rem;
                    width: 13rem;
                }
            }
            .email {
                margin: 3.125rem auto 0;
                width: 40%;
                input {
                    color: #333;
                    font-size: 1.125rem;

                    width: 70%;
                    height: 1.5625rem;
                    margin-bottom: 1.25rem;
                    display: block;
                    background: transparent;
                }
                textarea {
                    color: #333;
                    font-size: 1.125rem;

                    width: 100%;
                    height: 15rem;
                    resize: none;
                    background: transparent;
                    padding-top: 0.5rem;
                    font-family: Georgia, "Microsoft YaHei", "微软雅黑", STXihei, "华文细黑", serif;
                }
                .sendEmail {
                    width: 6.25rem;
                    margin-top: 0.625rem;
                    margin-left: calc(100% - 6.25rem);
                }
            }
        }
    }

    p.headline {
        padding-top: 4.375rem;
        margin: 0 auto 2.25rem;
        text-align: center;
        color: #333;
        font-size: 2rem;
        padding-bottom: 1.25rem;
    }

    .commentNumber {
        color: #333;
        font-size: 1.25rem;
        i {
            font-size: 1.25rem;
            margin-right: 0.3125rem;
        }
    }

    @media screen and (max-width: 440px) {
        .oneArticle {
            flex-grow: 1;
            margin-left: 0 !important;
            margin-right: 0 !important;
        }
        .email {
            width: 100% !important;
        }
    }
</style>
