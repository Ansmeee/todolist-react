import indexApi from "./index";
import index from "./index";
const userApi = {
  iconUploadPath() {
    return indexApi.Host() + "/user/icon"
  },

  info(params) {
    return index.Get(`/user`, params)
  },

  updateAttr(params) {
    return index.Put('/user/attr', params)
  }
}

export default userApi