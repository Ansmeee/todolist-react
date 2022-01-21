import indexApi from "./index";
import index from "./index";
const userApi = {
  iconUploadPath() {
    return indexApi.Host() + "/user/icon"
  },

  info(params) {
    return index.Get(`/user`, params)
  }
}

export default userApi