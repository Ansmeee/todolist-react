import index from './index'
const signApi = {
  signin(params) {
    return index.Post(`/rest/user/signin`, params)
  },

  signup(params) {
    return index.Post(`/rest/user/signup`, params)
  },

  signout() {
    return index.Post(`/rest/user/signout`)
  },

  captchaid() {
    return index.Get('/rest/user/captchaid')
  },

  captchaimg(source) {
    return index.Host() + `/rest/user/captchaimg?source=${source}`
  },

  sendSMSCode(parmas) {
    return index.Post('/rest/user/sms', parmas)
  }
}

export default signApi