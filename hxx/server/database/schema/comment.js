import mongoose from 'mongoose'
const Schema = mongoose.Schema


const CommentSchema = new Schema(
  {
      imgName: String,    //用来判断是‘我’写的评论还是别人写的评论，根据这个来改变页面中评论的样式
      name: String,
      address: String,
      content: String,
      articleId: Number,
      date: Date,
      like: Number
  },
  {versionKey: false}
)


module.exports = mongoose.model('Comment', CommentSchema)
