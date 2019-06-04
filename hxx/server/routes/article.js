/*
 * @Author: huangxiaoxun 
 * @Date: 2018-12-28 01:03:20 
 * @Last Modified by: huangxiaoxun
 * @Last Modified time: 2019-06-04 20:47:01
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

import ArticleService from '../service/articles'


/**
 *  
 *  
 */
@Controller('/api/articles')
export class ArticleRouter {
  @Post('/save')
  @Required({
    body: ['article']
  })
  // @Auth
  async sendArticle(ctx, next) {
    // console.log('ctx.request.body',ctx.request.body)
    const { article, isPublish} = ctx.request.body
    article.isPublish = isPublish
    try {
      await ArticleService._sendArticle({
        article: article,
      })
    } catch (e) {
      console.log(e)
      throw e
    }
    ctx.body = {
      message: '保存成功',
      success: true,
      code: 0
    }
  }


  /**
   *
   *
   * @param {*} ctx
   * @param {*} next
   * @memberof ArticleRouter
   * @resp    {total : Number,articles : Array}
   */
  @Get('/all')
  // @Required({
  //   body: ['page', 'value', 'limit']
  // })
  async getAllArticles(ctx, next) {
    console.log('ctx.request',ctx.query,ctx.url)
    const {page, value, limit, isPublish} = ctx.query
    console.log('ctx.request.body',ctx.request.body,page, value, limit)
    let data
    try {
      data = await ArticleService._getAllArticles({
        value: value,
        limit: limit - 0 || 4,
        skip: limit * (page - 1),
        isPublish: isPublish
      })
    } catch (e) {
      console.log(e)
      throw `getAllArticles Error : ${e}`
    }
    console.log('articleRouterRep',  data)
    ctx.body = {
      success: true,
      code : 0,
      data: data,
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
      code : 0,
      data: article
    }
  }

  @Delete('/:aid')
  async deleteArticle(ctx, next) {
    const {aid} = ctx.params
    try {
      console.log('aid',aid)
      let article = await ArticleService._deleteArticle({
        aid: aid
      })
      console.log('article',article)
      // 之前文章的评论是单独的一个集合，现在考虑将评论直接加在文章集合里
    } catch(e) {
      console.log(e)
      throw(e)
    }
    ctx.body = {
      success: true,
      code : 0,
      data: {},
    }
  }

  @Patch('/save/:aid')
  async updateArticle(ctx, next) {
    const { article,isPublish} = ctx.request.body
    console.log(' article,isPublish', article,isPublish)
    const {aid} = ctx.params
    console.log('ai1232131231231d-------',aid)
    let result = null
    try {
      result = await ArticleService._updateArticle({
        aid : +aid,
        article:article,
        isPublish: isPublish
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
          message:'更新成功'
        }
      } else if (!nModified && n) {
        ctx.body = {
          success: true,
          message:'内容无变化'
        }
      } else {
        ctx.body = {
          success: true,
          message:'没有找到对应的文章'
        }
      }
    } else {
      ctx.status = 401
      ctx.body = {}
    }
  }


  @Post('/comment')
  async ArticleComment (ctx, next ) {
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
      await ArticleService._ArticleComment({
        
      })
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
        code: 0,
        success: true,
        message:'点赞成功'
      }
    } else {
      ctx.status = 200
      ctx.body = {
        code : 1,
        success: false,
        message:'找不到对应的文章，点赞失败'
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