


import path from 'path'
import Router from 'koa-router'
import LRU from 'lru-cache'
import serve from 'koa-static'
const {createBundleRenderer} = require('vue-server-renderer')

const _resolve = file => path.resolve(__dirname, file)

function createRenderer(bundle, options) {
  // https://github.com/vuejs/vue/blob/dev/packages/vue-server-renderer/README.md#why-use-bundlerenderer
  console.log('createRenderer', typeof bundle)
  return createBundleRenderer(bundle, Object.assign(options, {
    // for component caching
    cache: new LRU({
      max: 1000,
      maxAge: 1000 * 60 * 15
    }),
    // this is only needed when vue-server-renderer is npm-linked
    // basedir: _resolve('../../dist'),
    // recommended for performance
    // runInNewContext: false
  }))
}

let renderer // 渲染器实例
let readyPromise
const isDev = process.env.NODE_ENV === 'development'

console.log('环境', 'isDev:', isDev)

const templatePath = _resolve('../../src/index.template.html')

const render = async (ctx) => {
  const s = Date.now()
  console.log('render')
  ctx.res.setHeader("Content-Type", "text/html")
  ctx.res.setHeader("Server", 'koa-ssr')


  const context = {
    title: 'Vue HN 2.0', // default title
    url: ctx.req.url
  }

  const handleError = err => {
    if (err.url) {
      ctx.redirect(err.url)
    } else if (err.code === 404) {
      ctx.status = 404
      ctx.body = '404 | Page Not Found'
    } else {
      // Render Error Page or Redirect
      ctx.body = '500 | Internal Server Error'
      console.error(`error during render : ${ctx.req.url}`)
      console.error(err.stack)
    }
  }
  console.log('renderToString')
  renderer.renderToString(context, (err, html) => {
    if (err) {
      return handleError(err)
    }
    console.log('html', typeof html,'err:',err)
    ctx.body = html
    if (isDev) {
      console.log(`whole request: ${Date.now() - s}ms`)
    }
  })
}

export default (app) => {
if (isDev) {
  // In development: setup the dev server with watch and hot-reload,
  // and create a new renderer on bundle / index template update.
  readyPromise = require('../../build/setup-dev-server')(
    app,
    templatePath,
    (bundle, options) => {
      // console.log('createRenderer',bundle, options)
      renderer = createRenderer(bundle, options)
    }
  )
} else {
  const bundle = require('../../dist/vue-ssr-server-bundle.json')
  const clientManifest = require('../../dist/vue-ssr-client-manifest.json')
  renderer = createRenderer(bundle, {
    template,
    clientManifest
  })
}

const staticPath = '../../dist'
console.log('pathpath', path.join(__dirname, staticPath))
app.use(serve(
  path.join(__dirname, staticPath)
))

const router = new Router()
router.get('/*', async (ctx, next) => {
  console.log('get ssr page  -------------')
  readyPromise.then(() => {
    // console.log('ctx.request',req,'ctx.response',res)
    console.log('readyPromise')
    render(ctx)
  }).catch(err => {
    console.log(err)
  })
})

app.use(router.routes())
app.use(router.allowedMethods())


} 




