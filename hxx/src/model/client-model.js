import axios from 'axios'
import { createError } from './util'

const request = axios.create({
  baseURL: 'http://127.0.0.1:3002/api'
})

const handleRequest = (request) => {
  // console.log('request',request)
  return new Promise((resolve, reject) => {
    request.then(resp => {
      const {data , status} = resp
      // console.log('resp',resp)
      // console.log('data',data)
      if (status === 200) {
        console.log('resolve',data.data)
        resolve(data.data)
      } else {
        return reject(createError(status))
      }
    }).catch(err => {
      console.log('---------------', err)
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
    return handleRequest(request.get('/articles/all', {params: {payload}}))
  },

}
