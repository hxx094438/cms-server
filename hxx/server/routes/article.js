/*
 * @Author: huangxiaoxun 
 * @Date: 2018-12-28 01:03:20 
 * @Last Modified by: huangxiaoxun
 * @Last Modified time: 2019-03-17 22:48:02
 */


import {
  Controller,
  Get,
  Post,
  Patch,
  Required,
  Auth
} from '../decorator/router'

import ArticleService from '../service/articles'


@Controller('/api/articles')
export class ArticleRouter {
  @Post('/send')
  @Required({
    body: ['article']
  })
  @Auth
  async sendArticle(ctx, next) {
    const { article} = ctx.request.body
    try {
      await ArticleService._sendArticle(article)
    } catch (e) {
      console.log(e)
      throw e
    }

    ctx.status = 200
    ctx.body = {
      msg: '保存成功',
      success: true
    }
  }


  @Get('/all')
  @Required({
    body: ['page', 'value', 'limit']
  })
  async getAllArticles(ctx, next) {
    let articles = null
    // console.log('ctx.request.body',ctx.request.body)
    const {page, value, limit} = ctx.request.body
    try {
      articles = await ArticleService._getAllArticles({
        value: value,
        limit: limit - 0 || 4,
        skip: limit * (page - 1),
      })
    } catch (e) {
      console.log(e)
      throw e
    }
    console.log('rep', articles)

    ctx.status = 200
    ctx.body = {
      data: articles,
      success: true
    }
  }


  @Get('/:aid')
  async getArticle(ctx, next) {
    let article = null
    const { aid } = ctx.params
    try {
      article = await ArticleService._getArticle({
        aid : aid
      })
    } catch (e) {
      console.log(e)
      throw e
    }

    ctx.status = 200
    ctx.body = {
      success: true,
      data: article
    }
  }

  @Patch('/:aid')
  async updateArticle(ctx, next) {
    const { article} = ctx.request.body
    const {aid} = ctx.params
    let result = null
    try {
      result = await ArticleService._updateArticle({
        aid : aid,
        article:article
      })
    } catch (e) {
      console.log(e)
    }
    const {n ,nModified, ok} = result

    console.log('result',result)
    if(ok) {
      ctx.status = 200
      if(nModified && n) {
        ctx.body = {
          success: true,
          msg:'更新成功'
        }
      } else if (!nModified && n) {
        ctx.body = {
          success: true,
          msg:'内容无变化'
        }
      } else {
        ctx.body = {
          success: true,
          msg:'没有找到对应的文章'
        }
      }
    } else {
      ctx.status = 401
      ctx.body = {}
    }
  }

  @Patch('/like/:aid')
  async ArticleLike(ctx, next) {
    const {aid} = ctx.params
    let result = null
    try {
      result = await ArticleService._ArticleLike({
        aid : aid,
      })
    } catch (e) {
      console.log(e)
    }
    // const {n ,nModified, ok} = result

    console.log('result',result)

    if(result) {
      ctx.status = 200
      ctx.body = {
        success: true,
        msg:'点赞成功'
      }
    } else {
      ctx.status = 200
      ctx.body = {
        success: true,
        msg:'找不到对应的文章，点赞失败'
      }
    }
    /*if(ok) {
      ctx.status = 200
      if(nModified && n) {
        ctx.body = {
          success: true,
          msg:'更新成功'
        }
      } else if (!nModified && n) {
        ctx.body = {
          success: true,
          msg:'内容无变化'
        }
      } else {
        ctx.body = {
          success: true,
          msg:'没有找到对应的文章'
        }
      }
    } else {
      ctx.status = 401
      ctx.body = {}
    }*/
  }
  // db查询结果可以写一个装饰器来处理


}