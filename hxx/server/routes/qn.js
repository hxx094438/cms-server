/*
 * @Author: huangxiaoxun 
 * @Date: 2019-09-04 10:21:32 
 * @Last Modified by: huangxiaoxun
 * @Last Modified time: 2019-09-04 10:27:03
 */

 import{
     Get, Controller
 } from '../decorator/router'
 import qiniu from qiniu

 
 @Controller('api/qiniu')
 export class QiniuRouter {
     @Get('/save')
     async getQiniuToken(ctx, next) {

     }
 }