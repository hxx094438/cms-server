<template>
    <table>
        <thead>
        <tr>
            <th>标题</th>
            <th>标签</th>
            <th>日期</th>
            <th>操作</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="article in articles">
            <router-link :to="{name:'editor', query: {aid: article.aid}}" tag="td" class="title">{{article.title}}
            </router-link>
            <td>{{article.tags | toTag}}</td>
            <td>{{article.date | toDate}}</td>
            <td>
                <router-link :to="{name:'editor', query: {aid: article.aid}}" class="iconfont icon-biji-copy"
                             tag="i"></router-link>
                <i class="iconfont icon-shanchu" @click="deleteConfirm(article.aid)"></i>
            </td>
        </tr>
        </tbody>
        <tfoot>
        <tr>
            <td @click="prePage">上一页</td>
            <td colspan="2">第 {{page}} 页</td>
            <td @click="nextPage">下一页</td>
        </tr>
        </tfoot>
    </table>
</template>

<script>
    import {mapState, mapActions, mapMutations} from 'vuex'

    export default {
        props: ['page'],
        computed: {
            ...mapState(['articles', 'dialog']),
            // obj(){
            //     return this.$store.state.noMore
            // }
        },
        // watch:{
        //     obj:function() {
        //         if(this.$store.state.noMore){
        //             this.page--
        //             this.getAllArticles({page: this.page, limit: 4})
        //             this.getAllDrafts({page: this.page, limit: 4})
        //         }
        //     }
        // },
        methods: {
            ...mapActions(['delArticle', 'getAllArticles', 'getAllDrafts']),
            ...mapMutations(['set_dialog']),
            nextPage() {
                this.$emit('addPage')   // 传递给父组件
            },
            prePage() {
                this.$emit('dropPage') // 传递给父组件
            },
            deleteConfirm(aid) {
                this.set_dialog({
                    info: '确认删除(⊙o⊙)？',
                    hasTwoBtn: true,
                    show: true
                })
                new Promise((resolve, reject) => {
                    this.dialog.resolveFn = resolve
                    this.dialog.rejectFn = reject
                }).then(() => {
                    this.delArticle({aid: aid, page: this.page, route: this.$route})
                }).catch((err) => {
                    console.log(err)
                })
            }
        }
    }

</script>

<style lang="scss" rel="stylesheet/scss" scoped>
    table {
        border-left: 0.125rem solid #eee;
        border-right: 0.125rem solid #eee;
        margin: 0 auto;
        padding: 0 1rem;
        text-align: center;
        max-height: 25rem;
        table-layout:fixed;
        width: 100%;
        td{
            word-wrap: break-word;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            padding: 0 1rem;
        }

        thead, tfoot {
            color: #333;
        }
        tbody {
            color: #666;
        }
        tr {
            th{
                width: 23%;
                &:nth-child(1){
                    width: 31%;
                }
            }
            height: 2.5rem;
            line-height: 1.875rem;
        }
        i {
            font-size: 1.25rem;
            margin-right: 0.625rem;
            color: #999;
            cursor: pointer;
            &:hover {
                color: #333;
                transition:  1s;
            }
        }
        tfoot tr td:nth-child(1), tfoot tr td:nth-child(3) {
            cursor: pointer;
            &:hover {
                color: #333;
                transition:  1s;
            }
        }
    }

    .title {
        cursor: pointer;
        &:hover {
            color: #444;
            transition:  1s;
        }
    }
</style>
