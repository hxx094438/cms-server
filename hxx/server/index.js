/*
 * @Author: huangxiaoxun 
 * @Date: 2018-10-28 15:24:14 
 * @Last Modified by: huangxiaoxun
 * @Last Modified time: 2019-03-18 23:23:42
 */
import { join } from 'path'
import Koa from 'koa'
import R from 'ramda'
import chalk from 'chalk'
import config from './config/index'


const MIDDLEWARES = ['database', 'general', 'router','ssr']

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


  await useMiddlewares(app)  


  // app.use(pageRouter.routes()).use(pageRouter.allowedMethods())


  // app.use(require('./routes/index.js').routes())
  
  app.listen(config.app.port, () => {
    console.log(`app is listening on port ${chalk.green(config.app.port)}`)
  })
})().catch(err => {
  console.log(err)
})
