
const config = require('../config/index.js')
const print = require('debug')('kov-blog')

const utils = {}
module.exports = utils
/**
 * debug plugin
 * */
utils.print = print

let bunyan = require('bunyan')

// let log = bunyan.createLogger({
//     name: 'app',
//     serializers: {
//         router (router) {
//             return null
//         },
//         req (req) {
//             const logKeys = ['method', 'url', 'header']
//             return logKeys.reduce(function (acc, key) {
//                 acc[key] = req[key]
//                 return acc
//             }, {})
//         },
//         matched () {
//             return null
//         },
//         res (res) {
//             const logKeys = ['status', 'message', 'header']
//             return logKeys.reduce(function (acc, key) {
//                 acc[key] = res[key]
//                 return acc
//             }, {})
//         },
//         cookies () {
//             return null
//         },
//         accept () {
//             return null
//         }
//     },
//     streams: [{
//         type: 'rotating-file',
//         path: config.dir.log + '/error.log',
//         period: '1d',   // daily rotation
//         count: 30        // keep 3 back copies
//     }]
// })

// /**
//  * log记录 用法: utils.logger.error(new Error(''))
//  * */
// utils.logger = log

// 将时间输出为统一的格式
utils.formatDate = function (date, fmt) {
    var o = {
        'M+': date.getMonth() + 1,                 // 月份
        'd+': date.getDate(),                    // 日
        'h+': date.getHours(),                   // 小时
        'm+': date.getMinutes(),                 // 分
        's+': date.getSeconds(),                 // 秒
        'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
        'S': date.getMilliseconds()             // 毫秒
    }
    if (/(y+)/.test(fmt)) { fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length)) }
    for (let k in o) {
        if (new RegExp('(' + k + ')').test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1)
                ? (o[k])
                : (('00' + o[k]).substr(('' + o[k]).length)))
        }
    }
    return fmt
}

/**
 *  判断传入参数的类型，以字符串的形式返回
 *  @obj：数据
 **/
utils.dataType = function(obj){
  if (obj===null) return "Null";
  if (obj===undefined) return "Undefined";
  return Object.prototype.toString.call(obj).slice(8,-1);
};

/**
* 处理对象参数值，排除对象参数值为”“、null、undefined，并返回一个新对象
**/
utils.dealObjectValue = function (obj){
  let param = {};
  if ( obj === null || obj === undefined || obj === "" ) return param;
  for ( var key in obj ){
      if ( utils.dataType(obj[key]) === "Object" ){
          param[key] = dealObjectValue(obj[key]);
      }else if(  obj[key] !== null && obj[key] !== undefined && obj[key] !== ""  ){
          param[key] = obj[key];
      }
  }
  return param;
}