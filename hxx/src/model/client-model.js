import axios from 'axios'
import { createError } from './util'

const request = axios.create({
  baseURL: '/api'
})

const handleRequest = (request) => {
  return new Promise((resolve, reject) => {
    request.then(resp => {
      const {data , status} = resp
      console.log('data',data,data.status)
      if (status === 200) {
        console.log('resolve',data.data)
        resolve(data.data)
      } else {
        return reject(createError(data.status))
      }
    }).catch(err => {
      const resp = err.response
      console.log('---------------', resp)
      if (resp.status === 401) {
        reject(createError(401, 'need auth'))
      }
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
