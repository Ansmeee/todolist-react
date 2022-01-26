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
  }
}

export default signApi