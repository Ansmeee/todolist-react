import index from './index'

export default {
  signin(params) {
    return index.Post(`/user/signin`, params)
  }
}