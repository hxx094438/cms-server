/*
 * @Author: huangxiaoxun 
 * @Date: 2019-09-04 10:21:32 
 * @Last Modified by: huangxiaoxun
 * @Last Modified time: 2019-09-04 14:48:52
 */

 import{
     Get, Controller
 } from '../decorator/router'
 import key from '../config/key'
 import qiniu from 'qiniu'
 @Controller('api/qiniu')
 export class QiniuRouter {
     @Get('/')
     async getQiniuToken(ctx, next) {
        const bucket = "hxx";  //存储空间名称
        const mac = new qiniu.auth.digest.Mac(key.qn.ak, key.qn.sk);
        const options = {
            scope: bucket
        }
        const putPolicy = new qiniu.rs.PutPolicy(options);
        const uploadToken = putPolicy.uploadToken(mac);
        ctx.body = {
            data: {
                token: uploadToken
            },
            success: true,
            code: 0
          }
     }
 }