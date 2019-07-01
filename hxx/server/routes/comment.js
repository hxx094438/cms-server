/*
 * @Author: huangxiaoxun 
 * @Date: 2019-06-05 17:07:32 
 * @Last Modified by: huangxiaoxun
 * @Last Modified time: 2019-07-01 23:17:48
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
      content,
      articleId,
      curPath,
      author,
      replyId,
      state,
      country,
      city,
      agent,
      ip
    } = ctx.request.body
    try {
      await CommentService._sendComment({
        imgName: imgName,
        author: author,
        content: content,
        articleId: articleId,
        date: Date(),
        like: 0,
        replyId: replyId,
        state: state,
        country:country,
        city:city,
        agent:agent,
        ip:ip
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
    const {
      articleId,
      sort
    } = ctx.query
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
      code: 0,
      data: comments
    }
  }

  @Patch('/like')
  async updateCommentLike(ctx, next) {
    let result
    const {
      id,
      option
    } = ctx.request.body
    try {
      result = await CommentService._updateCommentLike({
        id,
        option
      })
    } catch (e) {
      console.log(e)
    }
    console.log('result', result)
    
    if (result) {
      ctx.status = 200
      ctx.body = {
        success: true,
        message: '更新成功'
      }
       
      // else if (!nModified && n) {
      //   ctx.body = {
      //     success: true,
      //     message: '内容无变化'
      //   }
      // } else {
      //   ctx.body = {
      //     success: true,
      //     message: '没有找到对应的评论'
      //   }
      // }
    } else {
      ctx.status = 401
      ctx.bodu = {}
    }
    
  }
}
