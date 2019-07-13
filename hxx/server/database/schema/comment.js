import mongoose from 'mongoose'
import Sequence from './sequence'
const Schema = mongoose.Schema


const CommentSchema = new Schema(
  {
      imgName: String,    //用来判断是‘我’写的评论还是别人写的评论，根据这个来改变页面中评论的样式
      content: String,
      articleId: Number,
      date: Date,
      like: Number,
      id: Number,
      replyId: Number,
      ip: String,
      agent: String,
      city: String,
      country: String,
      state: Number, // 状态，暂时还没想好用处，先留着
      author: {
        name: String,
        email: String,
        weChat: String,
        QQ: String,
      }
  },
  {versionKey: false}
)

CommentSchema.pre('save', function (next) {
  const self = this;
  console.log('self',self.isNew)
  if(self.isNew) {
    Sequence.increment('Comment', (err, result) => {
      if(err) 
        throw err
      self.id = result.value.next
      next()
    })
  }
})


module.exports = mongoose.model('Comment', CommentSchema)
