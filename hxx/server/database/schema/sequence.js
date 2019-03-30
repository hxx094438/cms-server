/**
 * @author Huangxiaoxun<hxx09448@gmail.com>
 * @date 2018/12/27
 */
// 用于生成自增长的序列段，此处用于生成文章的aid
import mongoose from 'mongoose'

const Schema = mongoose.Schema
/**
 * 存储ID的序列值
 */
const SequenceSchema = new Schema({
  _id: String,
  next: Number
})


SequenceSchema.statics = {
  findAndModify: function (query, sort, doc, options, callback) {
    return this.collection.findAndModify(query, sort, doc, options, callback);
  },

  increment:function (schemaName, callback) {
    console.log('this',this.collection)
    return this.collection.findAndModify({_id: schemaName}, [],
    { $inc: { next: 1 } }, {"new":true, upsert:true}, callback);
  }
}




module.exports = mongoose.model('Sequence', SequenceSchema)

