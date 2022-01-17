import index from './index'

export default {
  fileList(params) {
    return index.Get(`/list`, params)
  },

  create(params) {
    return index.Post(`/list`, params)
  }
}