import Vue from 'vue'
import router from '../router'

const beginLoading = (commit, add) => {
    add ? commit('loadMore_toggle', true) : commit('isLoading_toggle', true)
    return Date.now()
}

const endLoading = (commit, startTime, toggle) => {
    const leftTime = 500 - (Date.now() - startTime)
    leftTime > 0 ? setTimeout(commit(toggle, false), leftTime) : commit(toggle, false)
}


export default {
    login({commit}, payload) {
        return Vue.http.post('/api/login', payload).catch((err) => {
            console.log(err)
        })
    },
    resetUser({commit}, payload) {
        return Vue.http.post('/api/user', payload)
            .then(() => {
                commit('unset_user')
                router.go({name: 'login'})
            }).catch((err) => {
                console.log(err)
            })
    },
    getAllArticles({commit}, payload) {
        commit('moreArticle_toggle', true)
        const startTime = beginLoading(commit, payload.add)
        if (payload.value) {
            commit('isLoading_toggle', false)
        }
        return Vue.http.get('/api/articles', {params: {payload}})
            .then(response => response.json())
            .then(article => {
                if (payload.page > article.total) {
                    commit('moreArticle_toggle', false)
                    commit('noMore_toggle', true)
                } else {
                    commit('set_pageTotal', article.total)
                    commit('noMore_toggle', false)
                }

                if (payload.add) {
                    commit('add_articles', article.articles)
                    endLoading(commit, startTime, 'loadMore_toggle')
                } else {
                    commit('set_all_articles', article.articles)
                    endLoading(commit, startTime, 'isLoading_toggle')
                }
            }).catch((err) => {
                console.log(err)
            })
    },

    //  article的http请求
    saveArticle({state, commit}, aid) {
        commit('isSaving_toggle', false)
        if (!state.isSend) {
            if (aid) {
                return Vue.http.patch('/api/article/' + aid, state.article)
                    .then(() => {
                        commit('isSaving_toggle', true)
                        commit('isSend_toggle', true)
                        router.push({name: 'posts'})
                    }, () => {
                        alert('保存失败')
                    }).catch((err) => {
                        console.log(err)
                    })
            } else {
                return Vue.http.post('/api/article', state.article)
                    .then(() => {
                        commit('isSaving_toggle', true)
                        router.push({name: 'posts'})
                    }, () => {
                        alert('保存失败2')
                    }).catch((err) => {
                        console.log(err)
                    })
            }
        }
    },

    getArticle({commit, state}, aid) {
        const startTime = beginLoading(commit, false);
        if (router.currentRoute.hash) {
            commit('isLoading_toggle', false)
        }
        document.title = '加载中...'
        return Vue.http.get('/api/article/' + aid)
            .then(response => {
                commit('set_article', response.data)
                commit('set_headline', {content: state.article.title, animation: 'animated rotateIn'})
                document.title = state.article.title
                endLoading(commit, startTime, 'isLoading_toggle')
            }).catch((err) => {
                console.log(err)
            })
    },

    delArticle({dispatch}, payload) {
        return Vue.http.delete('/api/article/' + payload.aid)
            .then(() => {
                if (payload.route.name === 'posts') dispatch('getAllArticles', {page: payload.page, limit: 4})
                if (payload.route.name === 'drafts') dispatch('getAllDrafts', {page: payload.page, limit: 4})
                if (payload.route.name === 'search') router.push({name: 'posts'})
            }).catch((err) => {
                console.log(err)
            })
    },

    //draft
    saveDraft({state, commit}, aid) {
        if (!state.isSaving) {
            if (aid) {
                return Vue.http.patch('/api/draft/' + aid, state.article)
                    .then(() => {
                        commit('isSaving_toggle', true)
                        router.push({name: 'drafts'})
                    }, () => {
                        alert('保存失败')
                    }).catch((err) => {
                        console.log(err)
                    })
            } else {
                return Vue.http.post('/api/draft/', state.article)
                    .then(() => {
                        commit('isSaving_toggle', true)
                        router.push({name: 'drafts'})
                    }, () => {
                        alert('保存失败')
                    }).catch((err) => {
                        console.log(err)
                    })
            }
        }
    },
    // 这里要怎么把pageTotal返回？
    getAllDrafts({commit}, payload) {
        return Vue.http.get('/api/drafts', {params: {payload}})
            .then((response) => response.json())
            .then(draft => {
                if (payload.page > draft.total) {
                    commit('noMore_toggle', true)
                } else {
                    commit('set_pageTotal', draft.total)
                    commit('noMore_toggle', false)
                    commit('set_all_articles', draft.articles)
                }
            }).catch((err) => {
                console.log(err)
            })
    },

    delArticle({dispatch}, payload) {
        return Vue.http.delete('/api/article/' + payload.aid)
            .then(() => {
                if (payload.route.name === 'posts') dispatch('getAllArticles', {page: payload.page, limit: 4})
                if (payload.route.name === 'drafts') dispatch('getAllDrafts', {page: payload.page, limit: 4})
                if (payload.route.name === 'search') router.push({name: 'posts'})
            }).catch((err) => {
                console.log(err)
            })
    },
    searchArticles({commit}, payload) {
        document.title = '搜索中...'
        commit('moreArticle_toggle', true)
        const startTime = beginLoading(commit, payload.add)
        return Vue.http.get('/api/someArticles', {params: {payload}})
            .then(response => response.json())
            .then(search => {
                if (payload.page > search.total) {
                    commit('moreArticle_toggle', false)
                    commit('noMore_toggle_', true)
                } else {
                    console.log(search.total)
                    commit('set_pageTotal', search.total)
                    commit('noMore_toggle', false)
                }
                if (payload.add) {

                    commit('add_articles', search.articles)
                    endLoading(commit, startTime, 'loadMore_toggle')
                } else {

                    commit('set_all_articles', search.articles)
                    endLoading(commit, startTime, 'isLoading_toggle')
                }
                document.title = '搜索成功'
            }).catch((err) => console.log(err))
    },
    getAllComments({commit}, payload) {
        return Vue.http.get('/api/comments', {params: {payload}})
            .then(response => response.json())
            .then(comments => {
                commit('set_comments',comments)
            }).catch((err) => {console.log(err)})
    }
}
