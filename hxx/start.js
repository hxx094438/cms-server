require('babel-core/register')()
require('babel-polyfill')
require('./server/index.js')
console.log('当前环境：',process.env.NODE_ENV)