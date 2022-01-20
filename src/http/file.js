import index from './index'

const fileApi = {
  fileList(params) {
    return index.Get(`/list`, params)
  },

  create(params){
    return index.Post(`/list`, params)
  }
}

export default fileApi

