/*
 * @Author: huangxiaoxun 
 * @Date: 2019-06-10 22:16:02 
 * @Last Modified by: huangxiaoxun
 * @Last Modified time: 2019-06-21 19:15:18
 */

import Comment from '../database/schema/comment'
import Article from '../database/schema/article'

import {
  cpus
} from 'os';

class CommentService {
  async _sendComment(comment) {
    try {
      await new Comment(comment).save()
      // 文章评论数++
      await Article.findOneAndUpdate({
        aid: comment.articleId
      }, {
        $inc: {
          comment_n: 1
        }
      })
    } catch (e) {
      console.log(e)
    }
  }

  async _getAllComments({
    articleId,
    sort
  }) {
    let _comments
    try {
      if (sort === 'date') {
        _comments = await Comment.find({
          articleId: articleId
        }).sort({
          date: -1
        }).exec()
      } else if (sort === 'like') {
        _comments = await Comment.find({
          articleId: articleId
        }).sort({
          like: -1
        }).exec()
      } else {
        _comments = await Comment.find({
          articleId: articleId
        }).exec()
      }

    } catch (e) {
      console.log(e)
    }
    return _comments
  }


  async _updateCommentLike({
    id,
    option
  }) {
    try {
      if (option === 'add') {
        return await Comment.findOneAndUpdate({
          _id: id
        }, {
          $inc: {
            like: 1
          }
        }, {
          new: true
        })
      } else {
        return await Comment.findOneAndUpdate({
          _id: id
        }, {
          $inc: {
            like: -1
          }
        }, {
          new: true
        })
      }
    } catch (e) {
      console.log(e)
    }
  }


}


module.exports = new CommentService()
