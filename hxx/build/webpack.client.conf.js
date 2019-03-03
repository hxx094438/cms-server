'use strict'
const webpack = require('webpack')
const merge = require('webpack-merge')
const baseWebpackConfig = require('./webpack.base.conf')
const SWPrecachePlugin = require('sw-precache-webpack-plugin')
const VueClientPlugin = require('vue-server-renderer/client-plugin')

const isDev = process.env.NODE_ENV === 'development'

let webpackConfig = merge(baseWebpackConfig, {
    entry: {
      app: './src/entry-client.js'
    },

    module: {
      rules: [
        {
          test: /\.css$/,
          use: ['style-loader','css-loader']
        },
      ]
    },
    plugins: [
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
        'process.env.VUE_ENV': '"client"'
      }),
      new webpack.optimize.CommonsChunkPlugin({
        name: 'vendor',
        filename: 'client-vendor-bundle.js',
        // minChunks: function (module) {
        //   // a module is extracted into the vendor chunk if...
        //   return (
        //     // it's inside node_modules
        //     /node_modules/.test(module.context) &&
        //     // and not a CSS file (due to extract-text-webpack-plugin limitation)
        //     !/\.css$/.test(module.request)
        //   )
        // }
      }),

      // new webpack.optimize.CommonsChunkPlugin({
      //   name: 'manifest'
      // }),
      new VueClientPlugin(),
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NamedModulesPlugin(), // HMR shows correct file names in console on update.
      new webpack.NoEmitOnErrorsPlugin(),
      // https://github.com/ampedandwired/html-webpack-plugin
    ]
  })


if(!isDev) {
  webpackConfig.plugins.push(
    // auto generate service worker
    new SWPrecachePlugin({
      cacheId: 'vue-hn',
      filename: 'service-worker.js',
      minify: true,
      dontCacheBustUrlsMatching: /./,
      staticFileGlobsIgnorePatterns: [/\.map$/, /\.json$/],
      runtimeCaching: [
        {
          urlPattern: '/',
          handler: 'networkFirst'
        },
        {
          urlPattern: /\/(top|new|show|ask|jobs)/,
          handler: 'networkFirst'
        },
        {
          urlPattern: '/item/:id',
          handler: 'networkFirst'
        },
        {
          urlPattern: '/user/:id',
          handler: 'networkFirst'
        }
      ]
    })
  )
}

module.exports = new Promise((resolve, reject) => {
  resolve(webpackConfig)
})
