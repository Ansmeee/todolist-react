import indexApi from "./index";
const userApi = {
  iconUploadPath() {
    return indexApi.Host() + "/user/icon"
  }
}

export default userApi