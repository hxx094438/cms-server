<template>
    <div id='comment'>
        <div class='newComment'>
            <div class="user">
                <img :src="gravatar(address) || '../../../../static/me.jpg'">
            </div>
            <div class="editor">
                <textarea spellcheck='false' placeholder='说点什么吧...' v-model='content' id='reply'
                          ref='textBox'></textarea>
                <div class="inputBox">
                    <input type='text' placeholder='邮箱' v-model='address'/>
                    <input type='text' placeholder='称呼' v-model='name' class='name' id='nameBox'/>
                    <button @click='summit' :disabled='summitFlag'>
                        <span>{{summitFlag ? '提交中...' : '发布评论'}}</span>
                    </button>
                </div>
            </div>
        </div>
        <div class='allComments'>
            <div class='summary'>
                <p>评论数 {{comments.length}}</p>
                <p>
                    <span @click="getAllComments({id: $route.params.id})">最早 </span>|
                    <span @click="getAllComments({id: $route.params.id, sort: 'date'})">最新 </span>|
                    <span @click="getAllComments({id: $route.params.id, sort: 'like'})"> 最热</span>
                </p>
            </div>
            <div class='comments' v-for='(comment,index) in comments'>
                <div id='info' :class='comment.imgName'>
                    <p class='commentName'>#{{index + 1}} <span>{{comment.name}}</span></p>
                    <p class='text'>{{comment.content}}</p>
                    <div class='options'>
                        <p class='commentDate'>{{comment.date | to_date}}</p>
                        <a href='#comment' data-scroll>
                            <span @click='reply(comment.name)'>
                                <i class='iconfont icon-huifu'></i>回复
                            </span>
                        </a>
                        <p @click='addLike(comment._id, index)'>
                            <i class='iconfont icon-like' :class='{activeLike: likeArr.indexOf(index) !== -1}'>
                            </i> {{comment.like}}
                        </p>
                    </div>
                    <img :src="gravatar(address) || '../../../../static/me.jpg'">
                </div>
            </div>
            <p v-show='comments.length === 0' class='nocomment'>还没有人评论&nbsp; :(</p>
        </div>
    </div>
</template>

<script>
    import {mapActions, mapState, mapMutations} from 'vuex'
    import gravatar from 'gravatar'


    export default {
        data() {
            return {

                name: '',
                address: '',
                content: '',
                gravatars: null,
                imgName: '',
                summitFlag: false,
                regexs: {
                    email: /\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}/,
                }
            }
        },
        created() {
            this.getAllComments({id: this.$route.params.id})
            if (localStorage.token && this.user.name) {
                this.imgName = 'me'
            } else {
                this.imgName = 'reviewer'
            }
            if (localStorage.reviewer) {
                this.address = localStorage['e-mail']
                this.name = localStorage['reviewer']
            }
        },
        computed: {
            ...mapState(['comments', 'user']),
            likeArr() {                            // 访问者点赞了哪些评论的数组
                if (localStorage.getItem(this.$route.params.id)) {
                    const item = localStorage.getItem(this.$route.params.id)  // 初始化访问者的点赞情况
                    return JSON.parse(item)
                }
                return []
            }
        },
        methods: {
            ...mapActions(['summitComment', 'getAllComments', 'updateLike']),
            ...mapMutations(['set_dialog']),
            gravatar(address) {
                if (!this.regexs.email.test(address)) return null
                let gravatar_url = gravatar.url(address, {
                    // size: '96',
                    // rating: 'pg',
                    // default: 'https://gravatar.surmon.me/anonymous.jpg',
                    protocol: 'https'
                });
                return gravatar_url
            },
            upadteUserGravatar() {
                const emailIsVerified = this.regexs.email.test(this.user.email)
                this.user.gravatar = emailIsVerified ? this.gravatar(this.user.email) : null
            },


            summit() {
                const re = /^[\w_-]+@[\w_-]+\.[\w\\.]+$/
                if (!this.name || !this.content) {
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
                // 限制评论内容
                if (this.content.length > 500) {
                    this.set_dialog({
                        info: '您的评论内容太长，要言简意赅哦',
                        hasTwoBtn: false,
                        show: true
                    })
                    return false
                } else if (this.content.length < 3) {
                    this.set_dialog({
                        info: '您的评论内容太短，说多一点嘛',
                        hasTwoBtn: false,
                        show: true
                    })
                    return false
                } else if (/\d{7,}/i.test(this.content) || // 连续7个以上数字，过滤发Q号和Q群的评论
                    /(\d.*){7,}/i.test(this.content) || // 非连续的7个以上数字，过滤用字符间隔开的Q号和Q群的评论
                    /\u52A0.*\u7FA4/i.test(this.content) || // 包含“加群”两字的通常是发Q群的垃圾评论
                    /(\u9876.*){5,}/i.test(this.content) || // 过滤5个以上“顶”字的评论
                    /([\u4E00\u4E8C\u4E09\u56DB\u4E94\u516D\u4E03\u516B\u4E5D\u25CB\u58F9\u8D30\u53C1\u8086\u4F0D\u9646\u67D2\u634C\u7396\u96F6].*){7,}/i.test(this.content) // 过滤用汉字发Q号和Q群的评论
                ) {
                    this.set_dialog({
                        info: '请不要发表灌水、广告、违法、Q群Q号等信息，感谢您的配合！',
                        hasTwoBtn: false,
                        show: true
                    })
                    return false
                }
                this.summitFlag = true
                // 将评论者的邮箱和用户名存储在浏览器中，在created钩子中赋值, 这样刷新后邮箱和昵称都不用再写一遍
                localStorage.setItem('e-mail', this.address)
                localStorage.setItem('reviewer', this.name)
                localStorage.setItem('gravatar',this.gravatar)
                this.summitComment({
                    imgName: this.imgName,
                    name: this.name,
                    content: this.content,
                    address: this.address,
                    articleId: this.$route.params.id,
                    curPath: this.$route.fullPath
                }).then(() => {
                    this.content = ''
                    this.summitFlag = false
                    this.getAllComments({id: this.$route.params.id})
                }).catch((err) => {
                    this.set_dialog({
                        info: err.body,
                        hasTwoBtn: false,
                        show: true
                    })
                    this.summitFlag = false
                    this.name = ''
                })
            },
            reply(name) {
                this.content = '@' + name + ': '
                this.$refs.textBox.focus()
            },
            addLike(id, index) {
                const i = this.likeArr.indexOf(index)
                if (i === -1) {
                    this.updateLike({id: id, option: 'add'}).then(() => {
                        this.likeArr.push(index)
                        this.getAllComments({id: this.$route.params.id})
                        localStorage[this.$route.params.id] = JSON.stringify(this.likeArr)  // 记录访问者的点赞情况
                    }).catch((err) => {
                        console.log(err)
                    })
                } else {
                    this.updateLike({id: id, option: 'drop'}).then(() => {
                        this.likeArr.splice(i, 1)
                        this.getAllComments({id: this.$route.params.id})
                        localStorage[this.$route.params.id] = JSON.stringify(this.likeArr)  // 记录访问者的点赞情况
                    }).catch((err) => {
                        console.log(err)
                    })
                }
            }
        },
        watch: {
            $route(to, from) {
                // #article是跳到另一篇文章，将评论框清空，#目录标题是锚点跳转，不清空评论框
                to.hash === '#article' ? this.content = '' : 0
                this.getAllComments({id: to.params.id})
            }
        }
    }

</script>

<style lang='scss' rel='stylesheet/scss' scoped>
    #comment {
        margin: 1.875rem auto 0.625rem;
        padding-top: 1.875rem;
        text-align: left;
        .newComment {
            display: flex;
            width: 100%;
            font-size: 1rem;
            .user {
                img {
                    width: 3rem;
                    height: 3rem;
                    border: 0.0625rem solid #eee;
                    border-radius: 0.625rem;
                }
            }
            .editor {
                flex-grow: 1;
                margin-left: 2rem;
                textarea {
                    padding: .6rem;
                    color: #666;
                    border: 0.0625rem #eee solid;
                    border-radius: 0.625rem;
                    width: 100%;
                    height: 6rem;
                    resize: none;
                    background: transparent;
                    outline: none;
                    box-sizing: border-box;
                    &:hover {
                        border-color: #8391a5;
                        transition: all 0.8s;
                    }
                }
                .inputBox {
                    display: flex;
                    flex-wrap: wrap;
                    justify-content: center;
                    input {
                        flex-grow: 1;
                        margin-right: 1.5625rem;
                        color: #999;
                        padding: .3rem;
                        border: 0.0625rem #eee solid;
                        border-radius: 0.3125rem;
                        outline: none;
                        width: 12.5rem;
                        height: 1.5625rem;
                        margin-top: 0.625rem;
                        margin-bottom: 0.625rem;
                        display: inline-block;
                        background: transparent;
                        &:hover {
                            border-color: #8391a5;
                            transition: all 0.8s;
                        }
                    }
                    button {
                        width: 1rem;
                        flex-grow: 1;
                        margin-top: 0.625rem;
                        margin-bottom: 0.625rem;
                    }
                }
            }

        }
        .allComments {
            margin-top: 1.875rem;
            .summary {
                display: flex;
                justify-content: space-between;
                border-bottom: 0.0625rem solid #eee;
                padding: 0.625rem;
                border-radius: 0.3125rem;
                span {
                    cursor: pointer;
                    &:hover {
                        color: #333;
                    }
                }
            }
            .comments {
                position: relative;
                margin-top: 1.25rem;
                width: 100%;
                display: flex;
                flex-wrap: wrap;

                #info {
                    border: 0.0625rem #eee solid;
                    border-radius: 0.3125rem;
                    width: 60%;
                    padding: 0.625rem;
                    color: #666;
                    .commentName {
                        font-size: 1rem;
                        margin-bottom: 0.3125rem;
                        font-weight: 600;
                        span {
                            color: #34495e;
                        }
                    }
                    .text {
                        font-size: 1rem;
                        overflow: hidden;
                        margin-top: 0.625rem;
                        margin-bottom: 0.625rem;
                    }
                    .options {
                        display: flex;
                        flex-wrap: wrap;
                        justify-content: flex-end;
                        text-align: right;
                        a {
                            color: #999;
                            margin-right: 0.625rem;
                            i.icon-huifu {
                                margin-right: 0.3125rem;
                            }
                            &:hover {
                                color: #ff525b;
                            }
                        }
                        p {
                            display: inline-block;
                            margin-right: 0.3125rem;
                            cursor: pointer;
                            &:hover {
                                color: #d15c5c;
                            }
                        }
                    }
                    img {
                        width: 3rem;
                        height: 3rem;
                        position: absolute;
                        top: 0;
                        border: 0.0625rem solid #cccccc;
                        border-radius: 0.3125rem;
                    }
                }
            }
            .nocomment {
                margin: 1.25rem auto;
                text-align: center;
            }
        }
    }

    .activeLike {
        color: #ea6f5a;
    }

    .reviewer {
        margin-left: 6.25rem;
        img {
            left: 0.625rem;
        }
    }

    .me {
        position: relative;
        margin-left: calc(40% - 7.625rem);
        img {
            right: -5.9375rem;
        }
        &:after {
            position: absolute;
            right: -1.15rem;
            top: 50%;
            margin-top: -0.5rem;
            content: '';
            width: 0;
            height: 0;
            border: 0.625rem solid transparent;
            border-left-color: #000000;
            z-index: 3;
        }
        &:before {
            position: absolute;
            right: -1.3rem;
            top: 50%;
            margin-top: -0.5rem;
            content: '';
            width: 0;
            height: 0;
            border: 0.625rem solid transparent;
            border-left-color: #cccccc;
            z-index: 2;
        }
    }

    @media screen and (max-width: 980px) {
        .newComment {
            img {
                display: none !important;
            }
            textarea {
                width: calc(100% - 0.875rem) !important;
                margin-left: 0 !important;
            }
            .inputBox {
                margin-left: 0 !important;
                input {
                    width: 40% !important;
                }
            }
        }
    }
</style>
