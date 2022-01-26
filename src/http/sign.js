import index from './index'
const signApi = {
  signin(params) {
    return index.Post(`/user/signin`, params)
  },

  signup(params) {
    return index.Post(`/user/signup`, params)
  },

  signout() {
    return index.Post(`/user/signout`)
  }
}

export default signApi