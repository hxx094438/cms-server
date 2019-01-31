'use strict'
const utils = require('./utils')
const webpack = require('webpack')
const config = require('../config')
const merge = require('webpack-merge')
const path = require('path')
const baseWebpackConfig = require('./webpack.base.conf')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
const portfinder = require('portfinder')
const ExtractPlugin = require('extract-text-webpack-plugin')
const VueClientPlugin = require('vue-server-renderer/client-plugin')
const HTMLPlugin = require('html-webpack-plugin')


const HOST = process.env.HOST
const PORT = process.env.PORT && Number(process.env.PORT)

const isDev = process.env.NODE_ENV === 'development'

const defaultPluins = [
  new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: isDev ? '"development"' : '"production"'
    }
  }),
  // new HTMLPlugin({
  //   template: path.join(__dirname, 'template.html')
  // }),
  new VueClientPlugin()
]

let devWebpackConfig
if(isDev) {
  devWebpackConfig = merge(baseWebpackConfig, {
    module: {
      rules: utils.styleLoaders({ sourceMap: config.dev.cssSourceMap, usePostCSS: true })
    },
    // cheap-module-eval-source-map is faster for development
    devtool: config.dev.devtool,

    // these devServer options should be customized in /config/index.js
    devServer: {
      clientLogLevel: 'warning',
      historyApiFallback: {
        rewrites: [
          { from: /.*/, to: path.posix.join(config.dev.assetsPublicPath, 'index.html') },
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
    plugins: defaultPluins.concat([
      new webpack.DefinePlugin({
        'process.env': require('../config/dev.env')
      }),
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NamedModulesPlugin(), // HMR shows correct file names in console on update.
      new webpack.NoEmitOnErrorsPlugin(),
      // https://github.com/ampedandwired/html-webpack-plugin
      new HtmlWebpackPlugin({
        filename: 'index.html',
        template: 'index.html',
        inject: true
      }),
      // copy custom static assets
      new CopyWebpackPlugin([
        {
          from: path.resolve(__dirname, '../static'),
          to: config.dev.assetsSubDirectory,
          ignore: ['.*']
        }
      ])
    ])
  })
} else {
  devWebpackConfig = merge(baseWebpackConfig, {
    entry: {
      app: path.join(__dirname, '../src/entry-client.js'),
      vendor: ['vue']
    },



    module: {
      rules: utils.styleLoaders({ sourceMap: config.dev.cssSourceMap, usePostCSS: true })
    },
    // cheap-module-eval-source-map is faster for development
    devtool: config.dev.devtool,

    // these devServer options should be customized in /config/index.js
    devServer: {
      clientLogLevel: 'warning',
      historyApiFallback: {
        rewrites: [
          { from: /.*/, to: path.posix.join(config.dev.assetsPublicPath, 'index.html') },
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
    plugins: defaultPluins.concat([
      new webpack.DefinePlugin({
        'process.env': require('../config/dev.env')
      }),
      new ExtractPlugin('styles.[contentHash:8].css'),
      new webpack.optimize.CommonsChunkPlugin({
        name: 'vendor'
      }),
      new webpack.optimize.CommonsChunkPlugin({
        name: 'runtime'
      }),
      new webpack.NamedChunksPlugin(),


      new webpack.HotModuleReplacementPlugin(),
      new webpack.NamedModulesPlugin(), // HMR shows correct file names in console on update.
      new webpack.NoEmitOnErrorsPlugin(),
      // https://github.com/ampedandwired/html-webpack-plugin
      new HtmlWebpackPlugin({
        filename: 'index.html',
        template: 'index.html',
        inject: true
      }),
      // copy custom static assets
      new CopyWebpackPlugin([
        {
          from: path.resolve(__dirname, '../static'),
          to: config.dev.assetsSubDirectory,
          ignore: ['.*']
        }
      ])
    ])
  })

}
module.exports = new Promise((resolve, reject) => {
  portfinder.basePort = process.env.PORT || config.dev.port
  portfinder.getPort((err, port) => {
    if (err) {
      reject(err)
    } else {
      // publish the new Port, necessary for e2e tests
      process.env.PORT = port
      // add port to devServer config
      devWebpackConfig.devServer.port = port

      // Add FriendlyErrorsPlugin
      devWebpackConfig.plugins.push(new FriendlyErrorsPlugin({
        compilationSuccessInfo: {
          messages: [`Your application is running here: http://${devWebpackConfig.devServer.host}:${port}`],
        },
        onErrors: config.dev.notifyOnErrors
        ? utils.createNotifierCallback()
        : undefined
      }))

      resolve(devWebpackConfig)
    }
  })
})
