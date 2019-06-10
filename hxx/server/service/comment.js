/*
 * @Author: huangxiaoxun 
 * @Date: 2019-06-10 22:16:02 
 * @Last Modified by: huangxiaoxun
 * @Last Modified time: 2019-06-10 23:38:56
 */

 import Comment from '../database/schema/comment'

 class CommentService {
   async _sendComment(comment){
     try {
      await new Comment(comment).save()
     } catch (e) {
       console.log(e)
     }
    

   }
 }


 module.exports = new CommentService()
