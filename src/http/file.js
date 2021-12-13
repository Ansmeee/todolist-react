import index from './index'

export default {
  fileList(params) {
    return index.Get(`/list`, params)
  }
}