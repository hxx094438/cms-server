/*
 * @Author: huangxiaoxun 
 * @Date: 2019-06-05 17:07:32 
 * @Last Modified by: huangxiaoxun
 * @Last Modified time: 2019-06-12 22:27:33
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
        imgName: imgName,
        name: name,
        address: address,
        content: content,
        articleId: articleId,
        date: Date(),
        like: 0
      })
    } catch (err) {
      console.log(err)
    }

    ctx.body = {
      message: '发布成功',
      success: true,
      code: 0,
    }
  }

  @Get('/all')
  async getAllComments(ctx, next) {
    let comments
    const { articleId, sort } = ctx.query
    try {
      comments = await CommentService._getAllComments({
        articleId: articleId,
        sort: sort
      })
      
    } catch (e) {
      console.log(e)
    }

    ctx.status = 200
    ctx.body = {
      success: true,
      code : 0,
      data: comments
    }
  }
}
