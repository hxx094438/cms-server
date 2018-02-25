export default {
    // login
    set_user: (state, user) => {
        localStorage.setItem('token', user.token)
        localStorage.setItem('userName', user.name)
        state.user = user
    },
    unset_user: (state) => {
      localStorage.removeItem('token')
      localStorage.removeItem('userName')
      state.user = {}
    }
}
