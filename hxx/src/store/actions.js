import Vue      from 'vue'
import router   from '../router'

const beginLoading = (commit, add) => {
  add ? commit('loadMore_toggle', true) : commit('isLoading_toggle', true)
  return Date.now()
}

const endLoading = (commit, startTime, toggle) => {
  const leftTime = 500 - (Date.now() - startTime)
  leftTime > 0 ? setTimeout(commit(toggle, false), leftTime) : commit(toggle, false)
}


export default {
    login ({commit}, payload) {
        return Vue.http.post('/api/login', payload).catch((err) => { console.log(err) })
    },
    resetUser ({commit}, payload) {
      return Vue.http.post('/api/user', payload)
        .then(() => {
          commit('unset_user')
          router.go({name: 'login'})
        }).catch((err) => { console.log(err) })
    }
}
