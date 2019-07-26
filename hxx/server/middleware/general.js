import bodyParser from 'koa-bodyparser'
import logger from 'koa-logger'
import onerror from 'koa-onerror'
import session from 'koa-session'
import staticFiles from 'koa-static'
import path from 'path'

export const addBodyParser = app => {
  app.use(bodyParser())
}

export const setStaticFiles = app => {
  app.use(staticFiles(path.resolve(__dirname, "../../dist")))
}

export const addLogger = app => {
  app.use(logger())
}

export const addError = app => {
  onerror(app, {
    json (err) {
      Object.keys(err).reduce((body, key) => {
        body[key] = err[key]
        return body
      }, this.body = {})
      this.body.error = err.name
    }
  })
}

export const allowOrigin = app => {
  app.use(async (ctx,next) => {
    //ctx.request.header.origin 请求头的origin
    //ctx.origin 本服务器的域名
    const whiteList = ['http://localhost:3000','http://localhost:8080']
    console.log('1123',ctx.request.header.origin,ctx.origin)
    if (ctx.request.header.origin !== ctx.origin && whiteList.includes(ctx.request.header.origin)) { 
      // && whiteList.includes(ctx.request.header.origin) 
      // 可设置白名单数组whiteList    ctx.set('Access-Control-Allow-Origin', ctx.request.header.origin);
      ctx.set('Access-Control-Allow-Origin', ctx.request.header.origin)
      ctx.set('Access-Control-Allow-Credentials', true)
      ctx.set('Access-Control-Allow-Headers',"Origin, X-Requested-With, Content-Type, Accept") 
    }
    
    if (ctx.method === 'OPTIONS') {
      ctx.set('Access-Control-Allow-Methods', 'PUT,DELETE,POST,GET,PATCH')
      ctx.set('Access-Control-Max-Age', 3600 * 24) //在24小时内，浏览器无须为同一请求再次发起预检请求
      ctx.body = '';
     }
    await next()
  })
}

export const addSession = app => {
  app.keys = ['hxx-cms']

  const CONFIG = {
    key: 'koa:sess', /** (string) cookie key (default is koa:sess) */
    /** (number || 'session') maxAge in ms (default is 1 days) */
    /** 'session' will result in a cookie that expires when session/browser is closed */
    /** Warning: If a session cookie is stolen, this cookie will never expire */
    maxAge: 86400000,
    overwrite: true, /** (boolean) can overwrite or not (default true) */
    httpOnly: false, /** (boolean) httpOnly or not (default true) */
    signed: true, /** (boolean) signed or not (default true) */
    rolling: false, /** (boolean) Force a session identifier cookie to be set on every response. The expiration is reset to the original maxAge, resetting the expiration countdown. default is false **/
    renew: false, /** (boolean) renew session when session is nearly expired, so we can always keep user logged in. (default is false)*/

  }
  app.use(session(CONFIG, app))
}