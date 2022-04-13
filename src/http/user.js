import indexApi from "./index";
import index from "./index";
const userApi = {
  iconUploadPath() {
    return indexApi.Host() + "/rest/user/icon"
  },

  info(params) {
    return index.Get(`/rest/user`, params)
  },

  updateAttr(params) {
    return index.Put('/rest/user/attr', params)
  },
  resetPass(params) {
    return index.Put('/rest/user/pass', params)
  },
  verifyEmail() {
    return index.Post('/rest/user/verify/email')
  },
  verify(params) {
    return index.Post('/rest/user/email/verify', params)
  }
}

export default userApi