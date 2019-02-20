/*
 * @Author: huangxiaoxun 
 * @Date: 2018-10-28 15:24:14 
 * @Last Modified by: huangxiaoxun
 * @Last Modified time: 2019-02-21 00:04:53
 */
import { join } from 'path'
import Koa from 'koa'
import R from 'ramda'
import chalk from 'chalk'
import config from './config/index'
const Router = require('koa-router')

const { createBundleRenderer } = require('vue-server-renderer')

const MIDDLEWARES = ['database', 'general', 'router']

const path = require('path')

const resolve = file => path.resolve(__dirname, file)

const app = new Koa()

console.log('app',app)

const useMiddlewares = (app) => {
  R.map(
    R.compose(
      R.forEachObjIndexed(
        e => e(app)
      ),
      require,
      name => join(__dirname, `./middleware/${name}`)
    )
  )(MIDDLEWARES)
}

;(async function () {
  /**
   * 将config注入中间件的ctx
   * */
  // app.context.config = config


  function createRenderer (bundle, options) {
    // https://github.com/vuejs/vue/blob/dev/packages/vue-server-renderer/README.md#why-use-bundlerenderer
    return createBundleRenderer(bundle, Object.assign(options, {
      // for component caching
      cache: LRU({
        max: 1000,
        maxAge: 1000 * 60 * 15
      }),
      // this is only needed when vue-server-renderer is npm-linked
      basedir: resolve('./dist'),
      // recommended for performance
      runInNewContext: false
    }))
  }

  let renderer
  let readyPromise
  

  const isDev = process.env.NODE_ENV === 'development'
  // let pageRouter
  const templatePath = resolve('../src/index.template.html')

  if (isDev) {
 /*   pageRouter = require('./middleware/dev-ssr')
    // pageRouter = require('./routers/dev-ssr-no-bundle')*/
    // In development: setup the dev server with watch and hot-reload,
    // and create a new renderer on bundle / index template update.
    readyPromise = require('../build/setup-dev-server')(
      app,
      templatePath,
      (bundle, options) => {
        renderer = createRenderer(bundle, options)
      }
    )

  } else {
    const bundle = require('./dist/vue-ssr-server-bundle.json')
    const clientManifest = require('./dist/vue-ssr-client-manifest.json')
    renderer = createRenderer(bundle, {
    template,
    clientManifest
  })
    // pageRouter = require('./routers/ssr')
    // pageRouter = require('./routers/ssr-no-bundle')
  }


  function render (req, res) {
    const s = Date.now()

    res.setHeader("Content-Type", "text/html")
    res.setHeader("Server", 'koa-ssr')

    const handleError = err => {
      if (err.url) {
        res.redirect(err.url)
      } else if(err.code === 404) {
        res.status(404).send('404 | Page Not Found')
      } else {
        // Render Error Page or Redirect
        res.status(500).send('500 | Internal Server Error')
        console.error(`error during render : ${req.url}`)
        console.error(err.stack)
      }
    }

    const context = {
      title: 'Vue HN 2.0', // default title
      url: req.url
    }
    renderer.renderToString(context, (err, html) => {
      if (err) {
        return handleError(err)
      }
      res.send(html)
      if (isDev) {
        console.log(`whole request: ${Date.now() - s}ms`)
      }
    })
  }

  await useMiddlewares(app)
  let pageRouter = new Router()
  pageRouter.get('*', (req, res) => {
    readyPromise.then(() => render(req, res))
  })


  // app.use(pageRouter.routes()).use(pageRouter.allowedMethods())


  // app.use(require('./routes/index.js').routes())
  
  app.listen(config.app.port, () => {
    console.log(`app is listening on port ${chalk.green(config.app.port)}`)
  })
})().catch(err => {
  console.log(err)
})
