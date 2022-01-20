import index from './index'
const signApi = {
  signin(params) {
    return index.Post(`/user/signin`, params)
  },

  signout() {
    return index.Post(`/user/signout`)
  }
}

export default signApi