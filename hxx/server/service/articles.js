/*
 * @Author: huangxiaoxun 
 * @Date: 2018-12-28 01:03:15 
 * @Last Modified by: huangxiaoxun
 * @Last Modified time: 2019-03-22 01:13:19
 */



import Article from '../database/schema/article'


class ArticleService {

  async _sendArticle (article) {
    console.log('article',article)
    await new Article(article).save()
  }


  /**
   *
   * @param {opt} param0
   * @return {total:Number,articles:Array}
   */
  async _getAllArticles({
    value,  //tags
    limit,  //最大值
    skip  // 页码
  }) {
    let _articles = {}
    //文章总数
    try {
      let count = await Article.countDocuments({
        isPublish: true
      }).exec()
      _articles.total = Math.ceil(count / limit ) // 总页数
    } catch (e) {
      console.log(e)
      throw e
    }

    if (value && value !== '全部') {
      try {
        _articles.articles = await Article.find({
          tags: value,
          isPublish: true
        }).sort({
          date: -1
        }).limit(limit).skip(skip).exec()
      } catch (e) {
        console.log(e)
        throw e
      }
    } else {
      try{
        _articles.articles = await Article.find({
          isPublish: true
        }).sort({
          date: -1
        }).limit(limit).skip(skip).exec()
      } catch (e) {
        console.log(e)
        throw e
      }
    }
    return _articles
  }

  async _getArticle ({aid}) {
    let article = null
    try{
      article = await Article.findOne({
        isPublish: true
      })
        .exec()
        console.log('article',article,aid)

    } catch (e) {
      console.log(e)
      throw e
    }
    return article
  }

  async _updateArticle ({article , aid}) {
    try {
      return await Article.update({aid: aid}, article)
    } catch (e) {
      console.log(e)
    }
  }

  async _deleteArticle ({article, aid}) {
    try {
      console.log('del',aid,typeof aid)
      return await Article.deleteOne({aid:aid})
    } catch(e) {
      console.log(e)
    }
  }

  async _ArticleLike ({article , aid}) {
    try {
      return await Article.findOneAndUpdate({aid: aid}, {$inc: {ArticleLike: 1}}, {new: true})
    } catch (e) {
      console.log(e)
    }
  }




}

module.exports = new ArticleService()
