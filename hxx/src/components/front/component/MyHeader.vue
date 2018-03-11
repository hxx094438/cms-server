<template>
    <div id="nav">
        <div class="flexDiv">
            <nav>
                <ul class="catalog">
                    <router-link to="/home" tag="li">首页</router-link>
                    <router-link to="/articles" tag="li">博客</router-link>
                    <router-link to="/articles" tag="li">科学</router-link>
                    <router-link to="/articles" tag="li">民主</router-link>
                    <router-link to="/articles" tag="li">自由</router-link>
                </ul>
            </nav>
            <div class="search">
                <input
                        type="text"
                        placeholder="搜索一下"
                        v-model="text"
                        @keydown.enter="search"
                />
                <i class="iconfont icon-search" @click="search"></i>
            </div>
        </div>
    </div>
</template>

<script>
    import {mapState, mapActions} from 'vuex'

    export default {
        data() {
            return {
                text: ''
            }
        },
        computed: mapState(['headline']),
        methods: {
            ...mapActions(['searchArticles']),
            search() {
                this.$router.push({name: 'SearchResult', params: {text: this.text}, hash: '#search'})
            }
        },
        watch: {
            $route() {
                this.text = ''
            }
        }
    }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
    #nav {
        position: relative;
        z-index: 100;
        background: #fff;
        box-shadow: 0 0 4px rgba(0,0,0,.25);
        line-height: 3rem;
        .flexDiv {
            max-width :60rem;
            margin: 0 auto;
            height :3rem;
            display: flex;
            justify-content: space-between;
            .search {
                margin-left: 0.625rem;
                position: relative;
                input {
                    color: #666;
                    outline: none;
                    background: transparent;
                    width: 15.625rem;
                    height: 1.875rem;
                    line-height: 1.875rem;
                    border-radius: 1.25rem;
                    font-size: 1.125rem;
                    padding-left: 0.625rem;
                    border: 0.125rem solid #cccccc;
                }
                .icon-search {
                    cursor: pointer;
                    font-size: 1.875rem;
                    color: #666;
                    position: absolute;
                    right: 0.5rem;
                    top: 0.2rem;
                }
            }
            nav {
                height: 3rem;
                font-weight: 600;
                ul {
                    color: #333;
                    display: flex;
                    flex-wrap: nowrap;
                    justify-content: space-around;
                    list-style: none;
                    width: 100%;
                    li {
                        width: 2.5rem;
                        font-size: .8rem;
                        text-align: center;
                        margin-right: 1.2rem;
                        height: 3rem;
                        line-height: 3rem;
                        cursor: pointer;
                        border-bottom: 0.1875rem solid transparent;
                        &:hover {
                            color: rgb(129, 216, 208) ;
                            transition: all 0.8s;
                        }
                        &.router-link-active {
                            color: rgb(129, 216, 208) ;
                        }
                    }
                }
            }
        }
        .container {
            overflow: hidden;
            width: 100%;
            height: 37.5rem;
        }
        .bgImage {
            display: block;
            width: 100%;
            height: 37.5rem;
            transform: perspective(62.5rem) translateZ(0);
            transition: 8s;
            &:hover {
                transform: perspective(62.5rem) translateZ(6.25rem);
                transition: 8s;
            }
        }
        #title {
            font-family: Georgia, "Microsoft YaHei", "微软雅黑", STXihei, "华文细黑", serif;
            color: #666;
            text-align: center;
            font-size: 3.125rem;
            width: 31.25rem;
            height: 3.125rem;
            position: absolute;
            top: 50%;
            left: 50%;
            margin-top: -0.625rem;
            margin-left: -15.625rem;
        }
    }

    @media screen and (max-width: 980px) {
        nav {
            width: 60% !important;
        }
    }

    @media screen and (max-width: 440px) {
        .container, .bgImage {
            height: 18rem !important;
        }
        #title {
            font-size: 2rem !important;
        }
        nav {
            width: 100% !important;
            ul {
                width: 100% !important;
                padding-left: 0 !important;
                li {
                    font-size: 0.9rem !important;
                    margin-right: 0 !important;
                }
            }
        }
        .search {
            z-index: 2;
            position: absolute !important;
            top: 3.2rem;
            left: 50%;
            margin-left: -8.125rem !important;
        }
    }
</style>
