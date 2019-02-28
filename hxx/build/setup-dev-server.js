const fs = require('fs')
const path = require('path')
const MFS = require('memory-fs')
const webpack = require('webpack')
const chokidar = require('chokidar')
const clientConfig = require('./webpack.client.conf')
const serverConfig = require('./webpack.server.conf')



module.exports = function setupDevServer (app, templatePath, cb) {
  let bundle
  let template
  let clientManifest
  let ready
  // console.log('setupDevServer',app)
  //最终返回的promise
  const readyPromise = new Promise(r => { 
    //把resolve赋值给ready
    ready = r 
  })

  const update = () => {
    console.log('update',typeof bundle)
    if (bundle && clientManifest) {
      console.log('update调用',typeof bundle, typeof clientManifest)
      //每次调用ready时就调用resolve，执行render函数
      ready()
      cb(bundle, {
        template,
        clientManifest
      })
    }
  }

  // read template from disk and watch
  template = fs.readFileSync(templatePath, 'utf-8')
  chokidar.watch(templatePath).on('change', () => {
    template = fs.readFileSync(templatePath, 'utf-8')
    console.log('index.html template updated.')
    update()
  })

  // modify client config to work with hot middleware
  clientConfig.then(config => {
    // console.log('clientConfig.output.path',config.output.path)
    const readFile = (fs, file) => {
      try {
        return fs.readFileSync(path.join(config.output.path, file), 'utf-8')
      } catch (e) {}
    }

    console.log('config.entry.app',config.entry)
    config.entry.app = ['webpack-hot-middleware/client', config.entry.app]
    config.output.filename = '[name].js'
    config.plugins.push(
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NoEmitOnErrorsPlugin()
    )
  
    // dev middleware
    // 客户端编译

    const clientCompiler = webpack(config)
    // 开发模式中间件
    // webpack-dev-middleware适用于express，会导致报错next is not function,因此使用koa版
    const devMiddleware = require('koa-webpack-dev-middleware')(clientCompiler, {
      publicPath: config.output.publicPath,
      noInfo: true
    })
  
    app.use(devMiddleware)
    // 监听客户端webpack打包完成钩子

    clientCompiler.plugin('done', stats => {
      stats = stats.toJson()
      stats.errors.forEach(err => console.error('stats.errors:',err))
      stats.warnings.forEach(err => console.warn('stats.warnings',err))
      if (stats.errors.length) return
      // 如果没有报错，给clientManifest赋值
      console.log('devMiddleware.fileSystem',devMiddleware.fileSystem)
      clientManifest = JSON.parse(readFile(
        devMiddleware.fileSystem,
        'vue-ssr-client-manifest.json'
      ))
      console.log('clientCompilerDone',typeof clientManifest)
      update()
    })
  
    // hot middleware
    // 热更新中间件  

    app.use(require('koa-webpack-hot-middleware')(clientCompiler, { heartbeat: 5000 }))
    // watch and update server renderer
    // 服务端编译
    const serverCompiler = webpack(serverConfig)
    // 缓存
    const mfs = new MFS()
    // 输出至缓存
    serverCompiler.outputFileSystem = mfs
    serverCompiler.watch({}, (err, stats) => {
      console.log('serverCompiler wathcn')
      if (err) throw err
      stats = stats.toJson()
      // console.log('bundle',stats.errors)

      if (stats.errors.length) return
      // read bundle generated by vue-ssr-webpack-plugin
      // 如果没有报错，给bundle赋值

      bundle = JSON.parse(readFile(mfs, 'vue-ssr-server-bundle.json'))
      update()
    })
  })
  
  // console.log('readyPromise',readyPromise)
  return readyPromise
}