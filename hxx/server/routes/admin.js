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
import UserService from '../service/admin'


@Controller('/api/admin')
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
      ctx.session.user = {
        _id: user._id,
        name: user.name,
        role: user.role,
        username: user.username
      }
      ctx.status = 200
      ctx.body = {
        msg:'登录成功',
        success: true,
        data: {
          name: user.name,
          username: user.username
        }
      }
    } else {
      ctx.status = 200
      ctx.body = {
        success: false,
        msg: '密码错误'
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
          msg:'修改成功'
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
        msg: '密码错误'
      }
    }

  }


}