import mongoose from 'mongoose'
import Sequence from './sequence'

const Schema = mongoose.Schema


const ArticleSchema = new Schema(
  {
    aid: {type: Number, index: {unique: true}},
    title: String,
    content: String,
    tags: [String],
    date: Date,
    isPublish: Boolean,
    comment_n: Number,
    ArticleLike: Number
  },
  {versionKey: false}
)


//生成从0开始自增长的文章aid
ArticleSchema.pre('save', function (next) {
  const self = this;
  if (self.isNew) {
    Sequence.increment('Article', function (err, result) {
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


