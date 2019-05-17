const mongoose = require('mongoose')
const Schema = mongoose.Schema
const sha1 = require('sha1')
const rand = require('csprng')
const Sequence = require('./schema/sequence')
import UserService from '../service/admin'

// 初始化数据
const initialize = () => {
  console.log('beginning to initialize data...')
  //
  UserService.seed()

/*
  Models.User.find({}, (err, doc) => {
    if (err) {
      console.log(err)
      console.log('initialize failed')
    } else if (!doc.length) {
      const salt = rand(160, 36)
      new Models['User']({
        name: 'hxx', password: sha1('123456' + salt), salt: salt
      }).save()
      // Promise.all(data.map((item) => {
      //     new Models['Article'](item).save()
      // }))
      //     .then(() => {
      //         console.log('initialize successfully')
      //     })
      //     .catch(() => {
      //         console.log('initialize failed')
      //     })
    } else {
      console.log('initialize successfully')
    }
  })
*/


}

mongoose.connect('mongodb://127.0.0.1/hxx',{
  useCreateIndex: true,
  useNewUrlParser: true
})
// mongoose.connect('mongodb://mongo-database:27017/hxx')

const db = mongoose.connection

db.on('error', console.error.bind(console, 'Database connection error.'));
db.once('open', () => {
  console.log('The database has connected.')
  initialize()
});

module.exports = Models
