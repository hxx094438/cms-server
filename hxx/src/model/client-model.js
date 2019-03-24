import axios from 'axios'
import { createError } from './util'

const request = axios.create({
  baseURL: typeof window === 'object' ? '/api' : 'http://127.0.0.1:3002/api'
})

const handleRequest = (request) => {
  // console.log('request',request)
  return new Promise((resolve, reject) => {
    request.then(resp => {
      const {data , status} = resp
      // console.log('resp',resp)
      // console.log('data',data)
      if (data.code === 0) {
        console.log('handleRequest',typeof data.data)
        resolve(data.data)
      } else {
        return reject(createError(data.code,data.message))
      }
    }).catch(err => {
      console.log('handleRequest Error---------------', err)
      // if (resp.status === 401) {
      //   reject(createError(401, 'need auth'))
      // }
    })
  })
}

export default {
  // getAllTodos () {
  //   return handleRequest(request.get('/api/todos'))
  // },
  // login (username, password) {
  //   return handleRequest(request.post('/user/login', { username, password }))
  // },
  login(payload) {
    return handleRequest(request.post('/admin/login', payload))
  },











  getAllArticles(payload) {
    console.log('dispatch aciton article -----')
    return handleRequest(request.get('/articles/all', {
      params: payload
    }))
  },

  getArticle(aid) {
    return handleRequest(request.get(`/articles/${aid}`))
  },


  saveArticlePatch(payload) {
  },

  saveArticle(payload) {
    console.log('payload',payload)
    if(payload.aid) {
      return handleRequest(request.patch(`/articles/save/${payload.aid}`, payload))
    } else {
      return handleRequest(request.post(`/articles/save`, payload))
    }
  }


}
