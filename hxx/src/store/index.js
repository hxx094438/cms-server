import Vue from 'vue'
import Vuex from 'vuex'
import actions from './actions.js'
import getters from './getters.js'
import mutations from './mutations.js'

Vue.use(Vuex)

export function createStore () {
  return new Vuex.Store({
    state: {
        user: {},
        headline: {},
        isLoading: false,
        moreArticle: true,
        loadMore: false,
        isSaving: false,
        isSend: false,
        noMore: false,
        dialog: {
            show: false,
            hasTwoBtn: false,
            info: 'hey',
            resolveFn: () => {},
            rejectFn: () => {}
        },
        tags: [],
        curTag: '',
        article: {},
        articles: [],
        draft: {},
        drafts: {},
        pageTotal:'',
        comments: [],
        likeArr: []
       // comment:{},
       // like:''
    },
    getters,
    actions,
    mutations
  })
}

