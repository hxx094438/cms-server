/*
 * @Author: huangxiaoxun 
 * @Date: 2018-10-28 15:24:14 
 * @Last Modified by: huangxiaoxun
 * @Last Modified time: 2019-01-11 00:55:48
 */
import { join } from 'path'
import Koa from 'koa'
import R from 'ramda'
import chalk from 'chalk'
import config from './config/index'

const MIDDLEWARES = ['database', 'general', 'router']

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

  const isDev = process.env.NODE_ENV === 'development'
  let pageRouter
  if (isDev) {
 /*   pageRouter = require('./middleware/dev-ssr')
    // pageRouter = require('./routers/dev-ssr-no-bundle')*/
    // In development: setup the dev server with watch and hot-reload,
    // and create a new renderer on bundle / index template update.
    readyPromise = require('./build/setup-dev-server')(
      app,
      templatePath,
      (bundle, options) => {
        renderer = createRenderer(bundle, options)
      }
    )

  } else {
    pageRouter = require('./routers/ssr')
    // pageRouter = require('./routers/ssr-no-bundle')
  }

  const app = new Koa()

  app.use(pageRouter.routes()).use(pageRouter.allowedMethods())

  await useMiddlewares(app)

  // app.use(require('./routes/index.js').routes())
  
  app.listen(config.app.port, () => {
    console.log(`app is listening on port ${chalk.green(config.app.port)}`)
  })
})().catch(err => {
  console.log(err)
})
