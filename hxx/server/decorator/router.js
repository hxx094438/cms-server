/*
 * @Author: huangxiaoxun 
 * @Date: 2018-11-24 14:57:29 
 * @Last Modified by: huangxiaoxun
 * @Last Modified time: 2019-03-05 01:19:53
 */

import KoaRouter from 'koa-router'
import path from 'path'
import glob from 'glob'
import R from 'ramda'
const { createBundleRenderer } = require('vue-server-renderer')
import LRU from 'lru-cache'
import serve from 'koa-static'


const resolve = path.resolve
const _resolve = file => path.resolve(__dirname, file)
const symbolPrefix = Symbol('prefix')
const routeMap = []
let logTimes = 0

// const normalizePath = path => path.startsWith('/') ? path : `/${path}`
const resolvePath = R.unless(
  R.startsWith('/'),
  R.curryN(2, R.concat)('/')
)

const changeToArr = R.unless(
  R.is(Array),
  R.of
)




function createRenderer (bundle, options) {
  // https://github.com/vuejs/vue/blob/dev/packages/vue-server-renderer/README.md#why-use-bundlerenderer
  console.log('createRenderer',typeof bundle)
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

let renderer
let readyPromise
const isDev = process.env.NODE_ENV === 'development'

console.log('环境', 'isDev:', isDev)

const templatePath = _resolve('../../src/index.template.html')

function render (ctx) {
  const s = Date.now()
  console.log('render')
  ctx.res.setHeader("Content-Type", "text/html")
  ctx.res.setHeader("Server", 'koa-ssr')

  const handleError = err => {
    if (err.url) {
      ctx.redirect(err.url)
    } else if(err.code === 404) {
      ctx.status = 404
      ctx.body = '404 | Page Not Found'
    } else {
      // Render Error Page or Redirect
      ctx.body = '500 | Internal Server Error'
      console.error(`error during render : ${ctx.req.url}`)
      console.error(err.stack)
    }
  }

  const context = {
    title: 'Vue HN 2.0', // default title
    url: ctx.req.url
  }
  renderer.renderToString(context, (err, html) => {
    if (err) {
      return handleError(err)
    }
    console.log('html',typeof html)
    ctx.body = html
    if (isDev) {
      console.log(`whole request: ${Date.now() - s}ms`)
    }
  })
}

export class Route {
  
  constructor(app, apiPath) {
    this.app = app
    this.apiPath = apiPath
    this.router = new KoaRouter()
  }

  init = ()=> {
    const { app, router, apiPath } = this
    // console.log('routeMap',routeMap)

    glob.sync(resolve(apiPath, './*.js')).forEach(require)
    // console.log(apiPath,'哈哈哈')
    // console.log('routeMap',routeMap)
    R.forEach(
      ({ target, method, path, callback }) => {
        const prefix = resolvePath(target[symbolPrefix])
        console.log('挂载router',callback)
        router[method](prefix + path, ...callback)
      }
    )(routeMap)

    if (isDev) {
      /*   pageRouter = require('./middleware/dev-ssr')
        // pageRouter = require('./routers/dev-ssr-no-bundle')*/
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
    console.log('pathpath',path.join( __dirname,  staticPath))
    app.use(serve(
      path.join( __dirname,  staticPath)
    ))

    // router.get('/dist', serve(_resolve('./dist')))
    router.get('/*', (ctx) => {
      console.log('get *****')
      readyPromise.then(() => {
        // console.log('ctx.request',req,'ctx.response',res)
        render(ctx)
      }).catch(err => {
        console.log(err)
      })
    })
  
    app.use(router.routes())
    app.use(router.allowedMethods())
  }
}

export const setRouter = method => path => (target, key, descriptor) => {
  routeMap.push({
    target,
    method,
    path: resolvePath(path),
    callback: changeToArr(target[key])
  })
  return descriptor
}

/**
 * 
 * @param {fn} middleware 
 * 将函数转化为数组中间件
 */

export const convert = middleware => (target, key, descriptor) => {
  target[key] = R.compose(
    R.concat(
      changeToArr(middleware)
    ),
    changeToArr
  )(target[key])
  return descriptor
}

export const Controller = path => target => (target.prototype[symbolPrefix] = path)

export const Get = setRouter('get')

export const Post = setRouter('post')

export const Patch = setRouter('patch')

export const Put = setRouter('put')

export const Delete = setRouter('delete')

export const Log = convert(async (ctx, next) => {
  logTimes++
  console.time(`${logTimes}: ${ctx.method} - ${ctx.url}`)
  await next()
  console.timeEnd(`${logTimes}: ${ctx.method} - ${ctx.url}`)
})


/**
 * @Required({
 *   body: ['name', 'password']
 * })
 */
export const Required = paramsObj => convert(async (ctx, next) => {
  let errs = []
  // console.log('ctx',ctx.request)
  R.forEachObjIndexed(
    (val, key) => {
      errs = errs.concat(
        R.filter(
          name => !R.has(name, ctx.request[key])
        )(val)
      )
    }
  )(paramsObj)
  // console.log('paramsObj',paramsObj,ctx.request.body,'err',errs)
  if (!R.isEmpty(errs)) {
    return (
      ctx.body = {
        success: false,
        errCode: 412,
        errMsg: `${R.join(', ', errs)} is required`
      }
    )
  }
  await next()
})

export const Auth = convert(async (ctx, next) => {
  console.log('auth自动登录',ctx.session)
  if (!ctx.session.user) {
    return (
      ctx.body = {
        success: false,
        errCode: 401,
        errMsg: '登陆信息已失效, 请重新登陆'
      }
    )
  }
  await next()
})