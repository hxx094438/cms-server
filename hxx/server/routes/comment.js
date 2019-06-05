/*
 * @Author: huangxiaoxun 
 * @Date: 2019-06-05 17:07:32 
 * @Last Modified by: huangxiaoxun
 * @Last Modified time: 2019-06-05 17:26:06
 */


import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Required,
  Auth
} from '../decorator/router'

import CommentService from '../service/comment'


@Controller('/api/comment')
export class CommentRouter {
  @Post('/save')
  //@Required
  async sendComment(ctx, next) {
    const {
      aid,
      imgName,
      name,
      content,
      address,
      articleId,
      curPath
    } = ctx.request.body


    try {
      await CommentService._sendComment({
        
      })
    }
  }




}
