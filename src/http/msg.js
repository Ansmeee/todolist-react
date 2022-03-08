import index from "./index"
const msgApi = {
  list(params) {
    return index.Get(`/rest/msg`, params)
  },

  msgCount() {
    return index.Get(`/rest/msg/unread`)
  },

  updateAttr(id, params) {
    return index.Put(`/rest/msg/${id}`, params)
  }
}

export default msgApi