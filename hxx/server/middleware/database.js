
/*
 * @Author: huangxiaoxun 
 * @Date: 2018-12-28 01:03:46 
 * @Last Modified by: huangxiaoxun
 * @Last Modified time: 2019-10-09 17:32:34
 */

import { join } from 'path'
import mongoose from 'mongoose'
import glob from 'glob'
import config from '../config/index'
import chalk from 'chalk'
import UserService from '../service/admin'


mongoose.Promise = global.Promise

glob.sync(join(__dirname, '../database/schema', '**/*.js')).forEach(require)
export const database = app => {
  const { mongoConfig } = config
  if (config.env === 'development') {
    mongoose.set('debug', true)
  }

  mongoose.connect(mongoConfig.url, { useNewUrlParser: true })
  mongoose.connection.on('disconnected', () => {
    mongoose.connect(mongoConfig.url)
  })

  mongoose.connection.on('error', err => {
    console.error(err)
  })

  mongoose.connection.once('open', () => {
    UserService.seed(mongoConfig.opts)  //初始化账号
    console.log(`Connected to MongoDB -> ${chalk.green(mongoConfig.url)}`)
  })
}
