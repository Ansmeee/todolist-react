import axios from 'axios'
import httpConfig from '../config/http'
import {clearUserInfo} from "../utils/user";

const apiHost = httpConfig.host()
const indexApi = {
  Host() {
    return apiHost
  },

  handlerResponse(response) {
    if (response.data.code === 499) {
      clearUserInfo()
      window.location.href = '/'
    }

    return response.data ? response.data : {}
  },

  Get(path, params) {
    var headers = {'Authorization': window.localStorage.getItem('token')}
    return axios.get(apiHost + path, {headers: headers, params: params}).then((response) => {
      return this.handlerResponse(response)
    }).catch((error) => {
    })
  },

  Post(path, params) {
    var headers = {'Authorization': window.localStorage.getItem('token')}
    return axios.post(apiHost + path, params, {headers: headers}).then((response) => {
      return this.handlerResponse(response)
    }).catch((error) => {
    })
  },

  Put(path, params) {
    var headers = {'Authorization': window.localStorage.getItem('token')}
    return axios.put(apiHost + path, params, {headers: headers}).then((response) => {
      return this.handlerResponse(response)
    }).catch((error) => {
    })
  },

  Delete(path, params) {
    var headers = {'Authorization': window.localStorage.getItem('token')}
    return axios.delete(apiHost + path, {headers: headers, params: params}).then((response) => {
      return this.handlerResponse(response)
    }).catch((error) => {
    })
  }
}

export default indexApi
