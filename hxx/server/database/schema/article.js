import mongoose from 'mongoose'
import Sequence from './sequence'

const Schema = mongoose.Schema


const ArticleSchema = new Schema(
  {
    aid: {type: Number, index: {unique: true}},
    title: String,
    content: String,
    tags: [String],
    // category: String,
    date: Date,
    lastDate: Date,
    keyword: String,
    descript: String,
    isPublish: Boolean,
    comment_n: Number,
    ArticleLike: Number,
    thumb: String, //缩略图地址
    type: Number,  // 1: code   2: 想法  3： 音乐
    state: Number, // 1：发布  0：未发布
  },
  {versionKey: false}
)


//生成从0开始自增长的文章aid
ArticleSchema.pre('save', function (next) {
  const self = this;
  if (self.isNew) {
    Sequence.increment('Article', (err, result) => {
      if (err)
        throw err
      self.aid = result.value.next
      next()
    })
  } else {
    next()
  }
})

module.exports = mongoose.model('Article', ArticleSchema)


