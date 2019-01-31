const Router = require('koa-router')
const axios = require('axios')
const path = require('path')
const fs = require('fs')
const MemoryFS = require('memory-fs')
const webpack = require('webpack')
const VueServerRenderer = require('vue-server-renderer')

const serverRender = require('./server-render')
const serverConfig = require('../../build/webpack.config.server')

const serverCompiler = webpack(serverConfig)  
// MemoryFS 读写内存，效率相对fs高
const mfs = new MemoryFS()
// 指定编译输出路径为内存
serverCompiler.outputFileSystem = mfs

let bundle
serverCompiler.watch({}, (err, stats) => {
  if (err) throw err
  stats = stats.toJson()
  // 如es-lint 中的报错在这里打印出来
  stats.errors.forEach(err => console.log(err))
  stats.warnings.forEach(warn => console.warn(err))
  // 指定bundle路径
  const bundlePath = path.join(
    serverConfig.output.path,
    'vue-ssr-server-bundle.json'
  )
  bundle = JSON.parse(mfs.readFileSync(bundlePath, 'utf-8'))
  console.log('new bundle generated')
})

const handleSSR = async (ctx) => {
  // webapck打包需要时间，请求过来的时候可能打包还未完成
  if (!bundle) {
    ctx.body = '你等一会，别着急......'
    return
  }

  // 因为webpack是单独起的一个server，
  //因此将webpack打包后的客户端js请求过来，混入返回给客户端的html
  //ue-ssr-client-manifest.json这个文件，是通过VueServerRenderer生成的，
  //通过在webpack.client.conf中引入VueClientPlugin插件
  const clientManifestResp = await axios.get(
    'http://127.0.0.1:8081/dist/vue-ssr-client-manifest.json'
  )
  const clientManifest = clientManifestResp.data

  const template = fs.readFileSync(
    path.join(__dirname, '../../src/index.template.html'),
    'utf-8'
  )

  const renderer = VueServerRenderer
    .createBundleRenderer(bundle, {
      inject: false,
      clientManifest
    })

  await serverRender(ctx, renderer, template)
}

const router = new Router()
router.get('*', handleSSR)

module.exports = router
