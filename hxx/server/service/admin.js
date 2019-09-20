/**
 * @author Huangxiaoxun<hxx09448@gmail.com>
 * @date 2018/12/27
*/

import sha1 from 'sha1'
import rand from 'csprng'
import User from '../database/schema/user'

class UserService {
  async checkPassword (name, password) {
    console.log('passwo',password,name)
    let match = false
    let user = await this.findOne(name)
    // console.log('checkuser',user)
    if (user) {
      match = await user.comparePassword(password, user)
    }
    return {
      match,
      user
    }
  }

  async findOne (name = null) {
    let searchParam = {},result

    if( name) {
      searchParam.name = name
    }

    try{
      result = await User.findOne(searchParam).exec()
    } catch (e) {
      console.log(e)
    }
    return result
  }

  /**
   * 
   * @param id  user._id
   * @param params  {_id:'',name:''}
   * @returns {Promise.<*>}
   */
  
  async update ( id ,params) {
    let result = null
    console.log('update方法')
    try {
      result = await User.findByIdAndUpdate(id, {
        $set: params
      }, {
        new: true
      }).exec()
    } catch (e) {
      console.log(e)
      throw e
    }
    return result
  }

  /**
   *初始化账号
   *
   * @param {*} opts {password, name}}
   * @returns
   * @memberof UserService
   */
  async seed(opts) {
    let user = await User.findOne({})
    let result = null
    if(user === null ) {
      const salt = rand(160, 36)
      opts.password = sha1(opts.password + salt),
      user = new User(Object.assign({
        salt: salt,
      },opts))
      try {
        result = user.save()
      } catch (e) {
        console.log(e)
        throw e
      }
      console.log('result',result)
      return result
    }
  }

}



module.exports = new UserService()



