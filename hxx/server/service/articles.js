/*
 * @Author: huangxiaoxun 
 * @Date: 2018-12-28 01:03:15 
 * @Last Modified by: huangxiaoxun
 * @Last Modified time: 2019-09-05 22:01:26
 */



import Article from '../database/schema/article'
import { dealObjectValue } from '../util/index'


class ArticleService {

  async _sendArticle ({
    article: article,
  }) {
    // console.log('article',article)
    article = {
      ...article,
      date: Date(),
      comment_n: 0,
      ArticleLike: 0
    }
    
    await new Article(article).save()
  }


  /**
   *
   *
   * @param {*} {
   *     tags,  //tags
   *     limit,  //最大值
   *     skip,  // 页码
   *     isPublish // 是否公开
   *   }
   * @returns
   * @memberof ArticleService
   */
  async _getAllArticles({
    // tags,  
    limit, 
    skip,  
    isPublish,
    tags,
    type,
    state
  }) {
    let _articles = {}
    //文章总数

    let params = {
      isPublish: isPublish,
      tags: tags,
      type: type,
      state: state
    }
    console.log('params1',params)

    params = dealObjectValue(params)
    console.log('params',params)
    try {
      let count = await Article.countDocuments(params).exec()
      console.log('count',count)
      _articles.total = count // 文章总数
    } catch (e) {
      console.log(e)
      throw e
    }
    try {
      _articles.articles = await Article.find(params).sort({
        date: -1
      }).limit(limit).skip(skip).exec()
    } catch (e) {
      console.log(e)
      throw e
    }
    return _articles
  }

  async _getTags({
    isPublish,
    tag,
    type,
    state
  }) {
    let res = null
    let params = {}
    if( typeof(isPublish) === 'boolean') params.isPublish = isPublish
    if(tag) params.tags = tag
    if(type) params.type = type
    if(state) params.state = state
    try{
      res = await Article.findOne({})
      .distinct('tags', (err, doc) => {
        if(err) {
          console.log(err)
        } else if (doc) {
          res = doc
        }
      })
    } catch (e) {
      throw e
    }
    return res
  }

  async _getArticle ({aid}) {
    let article = null
    try{
      article = await Article.findOne({aid: aid})
        .exec()
    } catch (e) {
      console.log(e)
      throw e
    }
    return article
  }

  async _updateArticle (article) {
    try {
      // console.log('update',aid,typeof aid)
      // await Article.findOne({aid: article.aid}, (err, res) => {
      //   // console.log('查询结果',res)
      // })
      // console.log('FIND---------------',article)
      article = {
        ...article,
        lastDate: Date()
      }
      
      return await Article.updateOne({aid: article.aid}, article)
    } catch (e) {
      console.log(e)
    }
  }

  async _deleteArticle ({article, aid}) {
    try {
      return await Article.deleteOne({aid:aid})
    } catch(e) {
      console.log(e)
    }
  }

  async _ArticleLike ({action , aid}) {
    try {
      if( action === 'add') {
        return await Article.findOneAndUpdate({aid: aid}, {$inc: {ArticleLike: 1}}, {new: true})
      } else if (action === 'reduce') {
        return await Article.findOneAndUpdate({aid: aid}, {$inc: {ArticleLike: -1}}, {new: true})
      }
    } catch (e) {
      console.log(e)
    }
  }
}

module.exports = new ArticleService()
