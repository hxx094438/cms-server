import createApp from './create-app'
import chalk from 'chalk';

const isDev = process.env.NODE_ENV !== 'production'

// This exported function will be called by `bundleRenderer`.
// This is where we perform data-prefetching to determine the
// state of our application before actually rendering it.
// Since data fetching is async, this function is expected to
// return a Promise that resolves to the app instance.
export default context => {
  return new Promise((resolve, reject) => {
    const s = isDev && Date.now()
    const { app, router, store } = createApp()

    const { url } = context
    const { fullPath } = router.resolve(url).route
    // console.log('fullPath',fullPath,'url',url)
    if (fullPath !== url) {
      return reject({ url: fullPath })
    }
    // set router's location
    router.push(url)

    // wait until router has resolved possible async hooks
    router.onReady(() => {
      const matchedComponents = router.getMatchedComponents()
      console.log('matchedComponents','url',url,matchedComponents.length)
      // no matched routes
      if (!matchedComponents.length) {
        return reject({ code: 404 })
      }
      // console.log('matchedComponents:',matchedComponents.map((item) => {
      //   {}
      // }))
      // Call fetchData hooks on components matched by the route.
      // A preFetch hook dispatches a store action and returns a Promise,
      // which is resolved when the action is complete and store state has been
      // updated.
      Promise.all(matchedComponents.map(({ asyncData }) => {
        // console.log('asyncData：',asyncData,typeof (asyncData({
        //   store,
        //   route: router.currentRoute
        // }).then))
        return asyncData && asyncData({
        store,
        route: router.currentRoute
      })})).then(() => {
        isDev && console.log(`data pre-fetch: ${Date.now() - s}ms`)
        // After all preFetch hooks are resolved, our store is now
        // filled with the state needed to render the app.
        // Expose the state on the render context, and let the request handler
        // inline the state in the HTML response. This allows the client-side
        // store to pick-up the server-side state without having to duplicate
        // the initial data fetching on the client.
        context.state = store.state
        resolve(app)
      }).catch(resolve(app))  

      //为什么不能这么写，和直接resolve(app有什么区别？)
      // .catch(error => {
      //   console.log(chalk.red('AsyncData Error Caused URL '), context.url);
      //   console.log(chalk.red('AsyncData Error Caused '), error);
      //   // 这里需要处理请求失败的情况，可能是没有权限
      //   // if(error.code === 401) {
      //   //   console.log('server-entry auth', error.code)
      //   //   context.state = store.state;
      //   //   resolve(app);
      //   // }
      //   context.state = store.state;
      //   resolve(app);
      // })
    })
  })
}
