/**
 * @author Huangxiaoxun<hxx09448@gmail.com>
 * @date 2018/11/27 
*/

import mongoose from 'mongoose'
const Schema = mongoose.Schema
import sha1 from 'sha1'

const MAX_LOGIN_ATTEMPTS = 3
const LOCK_TIME = 30 * 1000


const UserSchema = new Schema(
  {
    name: String,
    password: String,
    salt: String,            // 使用csprng随机生成的盐
    nickname: String,
    mobilephone: Number,
    avatar: String,
    role: String,
    from: String,
    gender: String,
    songList: Object,
    lockUntil: Number,
    meta: {
      createdAt: {
        type: Date,
        default: Date.now()
      },
      updatedAt: {
        type: Date,
        default: Date.now()
      }
    },
    loginAttempts: {
      type: Number,
      required: true,
      default: 0
    },
  },
  {versionKey: false}
)


UserSchema.virtual('isLocked').get(function () {
  return !!(this.lockUntil && this.lockUntil > Date.now())
})


UserSchema.methods = {

  /**
   * 登录限制
   * @param user
   * @returns {Promise}
   */
  incLoginAttempts: function(user) {
    const _self = this
    return new Promise((resolve, reject) => {
      if (_self.lockUntil && _self.lockUntil < Date.now()) {
        _self.update({
          $set: {
            loginAttempts: 1
          },
          $unset: {
            lockUntil: 1
          }
        }, function (err) {
          if (!err) resolve(true)
          else reject(err)
        })
      } else {
        let updates = {
          $inc: {
            loginAttempts: 1
          }
        }

        if (_self.loginAttempts + 1 >= MAX_LOGIN_ATTEMPTS && !_self.isLocked) {
          updates.$set = {
            lockUntil: Date.now() + LOCK_TIME
          }
        }

        _self.update(updates, err => {
          if (!err) resolve(true)
          else reject(err)
        })
      }
    })
  },


  comparePassword: function (_password, user) {
    return new Promise((resolve, reject) => {
      const salt = user.salt
      console.log('密码比较',_password,salt,user.password === sha1(_password + salt))
    
      resolve(user.password === sha1(_password + salt))
    })
  },
}

module.exports = mongoose.model('User', UserSchema)
