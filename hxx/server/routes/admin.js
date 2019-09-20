/**
 * @author Huangxiaoxun<hxx09448@gmail.com>
 * @date 2018/11/19
 */


import {
  Controller,
  Post,
  Auth,
  Get,
  Required,
} from '../decorator/router'
import sha1 from 'sha1'
import rand from 'csprng'
import jwt from 'jsonwebtoken'
import key from '../config/key'
import UserService from '../service/admin'
const cert = key.jwt.cert
const creatToken = (data) => {
  return jwt.sign(data, cert, { expiresIn: '7d' })
}
@Controller('/api')
export default class AdminRouter {
  @Post('/login')
  @Required({
    body: ['name','password']
  })
  async adminLogin(ctx, next) {
    const {
      name,
      password
    } = ctx.request.body
    console.log('password',password,'name',name,ctx.request.body)
    const data = await UserService.checkPassword(name, password)
    const {
      user,
      match
    } = data
    if (match) {
      const token = creatToken({
        name: name,
        password: password
      })
      ctx.body = {
        success: true,
        code : 0,
        message:'登录成功',
        data: {
          token: token,
          user:{
            name: user.name,
            username: user.username,
          },
        }
      }
    } else {
      ctx.body = {
        success: false,
        code: -11,
        message: '账号与密码不匹配',
        data: {}
      }
    }
  }


  @Post('/modify')
  @Required({
    body: ['name', 'oldVal', 'newVal']
  })
  async adminModify(ctx, next) {
    // console.log('login','ctx', ctx.request)
    const {name, oldVal, newVal} = ctx.request.body
    const {user, match} = await UserService.checkPassword(name, oldVal)
    // console.log('user',user)
    console.log('match', match)
    if (match) {
      console.log('修改密码')
      const salt = rand(160, 36)
      try {
        console.log('user',user)
        let doc = await UserService.update(user._id, {
          name: user.name,
          password: sha1(newVal + salt),
          salt: salt
        })
        console.log('doc', doc)
        ctx.status = 200
        ctx.body = {
          success: true,
          message:'修改成功'
        }
      } catch (e) {
        console.log(e)
        throw e
      }
    } else {
      console.log('密码错误')
      ctx.status = 200
      ctx.body = {
        success: false,
        message: '密码错误'
      }
    }
  }
}