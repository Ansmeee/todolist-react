import axios from 'axios'
import httpConfig from '../config/http'

// axios.defaults.withCredentials=true

const apiHost = httpConfig.host()

function handlerResponse(response) {
  let data = response.data
  return data
}

function Get(path, params) {
  var headers = {'Authorization': window.localStorage.getItem('token')}
  return axios.get(apiHost + path, {headers: headers, params: params}).then((response) => {
    return handlerResponse(response)
  }).catch((error) => {
  })
}

function Post(path, params) {
  var headers = {'Authorization': window.localStorage.getItem('token')}
  return axios.post(apiHost + path, params, {headers: headers}).then((response) => {
    return handlerResponse(response)
  }).catch((error) => {
  })
}

export default {Get, Post, apiHost}
