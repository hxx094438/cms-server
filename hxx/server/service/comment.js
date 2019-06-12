/*
 * @Author: huangxiaoxun 
 * @Date: 2019-06-10 22:16:02 
 * @Last Modified by: huangxiaoxun
 * @Last Modified time: 2019-06-12 22:27:09
 */

 import Comment from '../database/schema/comment'
import { cpus } from 'os';

 class CommentService {
   async _sendComment(comment){
     try {
      await new Comment(comment).save()
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
      if(sort === 'date' ) {
        _comments = await Comment.find({
          articleId: articleId
        }).sort({
          date: -1
        }).exec()
      } else if( sort === 'like') {
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


 }


 module.exports = new CommentService()
