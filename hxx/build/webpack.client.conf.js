'use strict'
const utils = require('./utils')
const webpack = require('webpack')
const merge = require('webpack-merge')
const path = require('path')
const baseWebpackConfig = require('./webpack.base.conf')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const SWPrecachePlugin = require('sw-precache-webpack-plugin')
const VueClientPlugin = require('vue-server-renderer/client-plugin')
const { VueLoaderPlugin } = require('vue-loader')

function resolve (dir) {
  return path.join(__dirname, '..', dir)
}


const isDev = process.env.NODE_ENV === 'development'

// const defaultPluins = [
//
// ]

let webpackConfig = merge(baseWebpackConfig, {
    entry: {
      app: './src/entry-client.js'
    },

    module: {
      rules: [
        {
          test: /\.vue$/,
          loader: 'vue-loader',
          options: {
            compilerOptions: {
              preserveWhitespace: false,
              extractCSS: !isDev,
              cssModules: {
                localIdentName: isDev ? '[path]-[name]-[hash:base64:5]' : '[hash:base64:5]',
                camelCase: true
              },
            }
          }
        },
        {
          test: /\.css$/,
          use: ['style-loader','css-loader']
        },
        {
          test: /\.js$/,
          loader: 'babel-loader',
          include: [resolve('src'), resolve('test'), resolve('node_modules/webpack-dev-server/client')]
        },
        {
          test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
          loader: 'url-loader',
          options: {
            limit: 10000,
            name: utils.assetsPath('img/[name].[hash:7].[ext]')
          }
        },
        {
          test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
          loader: 'url-loader',
          options: {
            limit: 10000,
            name: utils.assetsPath('media/[name].[hash:7].[ext]')
          }
        },
        {
          test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
          loader: 'url-loader',
          options: {
            limit: 10000,
            name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
          }
        },
        {
          test: /\.scss$/,
          use: !isDev
            ? ExtractTextPlugin.extract({
                use: [
                  {
                    loader: 'css-loader',
                    options: { minimize: true }
                  },
                  'sass-loader'
                ],
                fallback: 'vue-style-loader'
              })
            : ['vue-style-loader', 'css-loader', 'sass-loader']
        },
  
      ]
    },

    // cheap-module-eval-source-map is faster for development
    // devtool: config.dev.devtool,

    // these devServer options should be customized in /config/index.js
/*
    devServer: {
      clientLogLevel: 'warning',
      historyApiFallback: {
        rewrites: [
          { from: /.*!/, to: path.posix.join(config.dev.assetsPublicPath, 'index.html') },
        ],
      },
      hot: true,
      contentBase: false, // since we use CopyWebpackPlugin.
      compress: true,
      host: HOST || config.dev.host,
      port: PORT || config.dev.port,
      open: config.dev.autoOpenBrowser,
      overlay: config.dev.errorOverlay
        ? { warnings: false, errors: true }
        : false,
      publicPath: config.dev.assetsPublicPath,
      proxy: config.dev.proxyTable,
      quiet: true, // necessary for FriendlyErrorsPlugin
      watchOptions: {
        poll: config.dev.poll,
      }
    },
*/
    plugins: [
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
        'process.env.VUE_ENV': '"client"'
      }),
      new webpack.optimize.CommonsChunkPlugin({
        name: 'vendor',
        minChunks: function (module) {
          // a module is extracted into the vendor chunk if...
          return (
            // it's inside node_modules
            /node_modules/.test(module.context) &&
            // and not a CSS file (due to extract-text-webpack-plugin limitation)
            !/\.css$/.test(module.request)
          )
        }
      }),
      new VueLoaderPlugin(),

      new webpack.optimize.CommonsChunkPlugin({
        name: 'manifest'
      }),
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
