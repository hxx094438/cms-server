import Vue from 'vue'
// import router from '../router'
import model from '../model/client-model'


const beginLoading = (commit, add) => {
  add ? commit('loadMore_toggle', true) : commit('isLoading_toggle', true)
  return Date.now()
}

const endLoading = (commit, startTime, toggle) => {
  const leftTime = 500 - (Date.now() - startTime)
  leftTime > 0 ? setTimeout(commit(toggle, false), leftTime) : commit(toggle, false)
}

export default {
  LOGIN({commit}, payload) {
    console.log('this',payload)
    return model.login(payload).catch((err) => {
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

  GET_ALL_ARTICLES ({commit}, params) {
    commit('moreArticle_toggle', true)
    // const startTime = beginLoading(commit, payload.add)
    if (params.value) {
      commit('isLoading_toggle', false)
    }
    return model.getAllArticles(params).then( res => {
      console.log('action', typeof res)
      const {total , articles} = res
      // console.log('total',total,'article',articles)
      if (params.page > total) {
          commit('moreArticle_toggle', false)
          commit('noMore_toggle', true)
      } else {
        commit('set_pageTotal', total)
        commit('noMore_toggle', false)
      } 
      if (params.add) {
        commit('add_articles', articles)
        endLoading(commit, startTime, 'loadMore_toggle')
      } else {
        commit('set_all_articles', articles)
        // endLoading(commit, startTime, 'isLoading_toggle')
      }
    })
    
        
  },

  SAVE_ARTICLE({state, commit}, payload) {
    commit('isSaving_toggle', false)
    if (!state.isSend) {
        return model.saveArticle({article: state.article, aid: payload.aid})
          .then(() => {
            commit('isSaving_toggle', true)
            commit('isSend_toggle', true)
          }).catch((err) => {
            console.log(err)
          })
      
    }
  },

  getArticle({commit, state}, aid) {
    const startTime = beginLoading(commit, false);
    if (router.currentRoute.hash) {
      commit('isLoading_toggle', false)
    }
    document.title = '加载中...'
    return model.getArticle(aid)
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
          commit('noMore_toggle', true)
        } else {
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

  //getAllTags
  getAllTags({commit}, payload) {
    return Vue.http.get('/api/tags', payload)
      .then(response => {
        commit('set_tags', response.data)
      }).catch(err => console.log(err))
  },

  // email
  sendMail({commit}, payload) {
    return Vue.http.post('/api/mail', payload).catch((err) => {
      console.log(err)
    })
  },
  // comment
  summitComment({commit}, payload) {
    return Vue.http.post('/api/comment', payload)
  },

  getAllComments({commit}, payload) {
    return Vue.http.get('/api/comments', {params: {payload}})
      .then(response => {
        return response.json()
      })         //箭头函数有{...}别忘了return...
      .then(comments => {
        commit('set_comments', comments)
      }).catch((err) => {
        console.log(err)
      })
  },
  updateLike({state, commit}, payload) {            //返回一个comment对象
    return Vue.http.patch('/api/comments/' + payload.id, {option: payload.option})
      .then(response => {
        return response.json()
      })
      .then(comment => {
        state.comments.splice(payload.index, 1, comment)
      })
      .catch((err) => {
        console.log(err)
      })
  },
  updateArticleLike({state, commit}, aid) {
    return Vue.http.patch('/api/ArticleLike/' + aid, {aid: aid})
      .then(response => {
        console.log(response.data)
        commit('set_article', response.data)
      })
      .catch((err) => {
        console.log(err)
      })
  }

}
