const fs = require('fs')
const path = require('path')
const MFS = require('memory-fs')
const webpack = require('webpack')
const chokidar = require('chokidar')
const clientConfig = require('./webpack.client.conf')
const serverConfig = require('./webpack.server.conf')
const webpackDevMiddleware = require('./dev-policy/dev-middleware')
const webpackHotMiddleware = require('./dev-policy/hot-middleware')



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
    if (bundle && template) {
      console.log('update调用',typeof bundle)
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
    // config.entry.app = ['webpack-hot-middleware/client', config.entry.app]
    // config.output.filename = '[name].js'
    config.plugins.push(
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NoEmitOnErrorsPlugin()
    )
  
    // dev middleware
    // 客户端编译

    const clientCompiler = webpack(config)
    // 开发模式中间件
    // webpack-dev-middleware适用于express，会导致报错next is not function,因此使用koa版
    // const devMiddleware = require('koa-webpack-dev-middleware')(clientCompiler, {
    //   publicPath: config.output.publicPath,
    //   noInfo: true
    // })
    
    console.log('config.output.publicPath',config.output.publicPath)

    const devMiddleware = webpackDevMiddleware(clientCompiler, {
      //  绑定中间件的公共路径,使用与webpack相同
      publicPath: config.output.publicPath,
      stats: { //  用于形成统计信息的选项
          colors: true,
          chunks: false
      },
      noInfo: true, // 显示无信息到控制台（仅警告和错误）
      // serverSideRender: false //  关闭服务器端渲染模式。有关详细信息，请参阅服务器端渲染部分
    })

    app.use(devMiddleware)
    // 监听客户端webpack打包完成钩子

    clientCompiler.plugin('done', stats => {
      stats = stats.toJson()
      stats.errors.forEach(err => console.error('stats.errors:',err))
      stats.warnings.forEach(err => console.warn('stats.warnings',err))
      console.log('stats.errors.length',stats.errors.length)
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
    app.use(webpackHotMiddleware(clientCompiler))

    // app.use(require('koa-webpack-hot-middleware')(clientCompiler, { heartbeat: 5000 }))
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
      console.log('serverConfig.output.path',serverConfig.output.path)
      const bundlePath = path.join(
        serverConfig.output.path,
        'vue-ssr-server-bundle.json'
      )
      // console.log('bundlePath', mfs.readFileSync(bundlePath, 'utf-8'))
      bundle = JSON.parse(mfs.readFileSync(bundlePath, 'utf-8'))
      update()
    })
  })
  
  // console.log('readyPromise',readyPromise)
  return readyPromise
}
