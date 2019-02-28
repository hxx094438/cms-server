'use strict'
const path = require('path')
const utils = require('./utils')
const config = require('../config')
const webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')

const isDev = process.env.NODE_ENV === 'development'

function resolve (dir) {
  return path.join(__dirname, '..', dir)
}

module.exports = {
  context: path.resolve(__dirname, '../'),
  entry: path.join(__dirname,'../src/entry-client.js'),
  output: {
    path: config.build.assetsRoot,
    filename: '[name].js',
    publicPath: process.env.NODE_ENV === 'production'
      ? config.build.assetsPublicPath
      : config.dev.assetsPublicPath
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
        use: ['vue-style-loader','css-loader']
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


  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
      '@': resolve('src'),
    }
  },

  // node: {
  //   // prevent webpack from injecting useless setImmediate polyfill because Vue
  //   // source contains it (although only uses it if it's native).
  //   setImmediate: false,
  //   // prevent webpack from injecting mocks to Node native modules
  //   // that does not make sense for the client
  //   dgram: 'empty',
  //   fs: 'empty',
  //   net: 'empty',
  //   tls: 'empty',
  //   child_process: 'empty'
  // },
  performance: {
    maxEntrypointSize: 300000,
    hints: !isDev ? 'warning' : false
  },
  
  plugins: !isDev
  ? [
      // new VueLoaderPlugin(),
      new webpack.optimize.UglifyJsPlugin({
        compress: { warnings: false }
      }),
      new webpack.optimize.ModuleConcatenationPlugin(),
      new ExtractTextPlugin({
        filename: 'common.[chunkhash].css'
      })
    ]
  : [
      // new VueLoaderPlugin(),
      new FriendlyErrorsPlugin()
    ]
}
