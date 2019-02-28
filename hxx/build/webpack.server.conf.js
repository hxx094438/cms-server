'use strict'
const utils = require('./utils')
const webpack = require('webpack')
const merge = require('webpack-merge')
const path = require('path')
const baseWebpackConfig = require('./webpack.base.conf')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const VueServerPlugin = require('vue-server-renderer/server-plugin')
const nodeExternals = require('webpack-node-externals')
const { VueLoaderPlugin } = require('vue-loader')
function resolve (dir) {
  return path.join(__dirname, '..', dir)
}

const isDev = process.env.NODE_ENV === 'development'


const plugins = [
  new ExtractTextPlugin('styles.[contentHash:8].css'),
  new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
    'process.env.VUE_ENV': '"server"'
  }),
  new VueLoaderPlugin(),

  new VueServerPlugin()
]

module.exports = merge(baseWebpackConfig, {
  target: 'node',
  entry: path.join(__dirname, '../src/entry-server.js'),
  devtool: 'source-map',
  output:{
    libraryTarget: 'commonjs2',
    filename: 'server-bundle.js',
  },
  // externals: Object.keys(require('../package.json').dependencies),
  plugins,
  externals: nodeExternals({
    // do not externalize CSS files in case we need to import it from a dep
    whitelist: /\.css$/
  }),

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
})

