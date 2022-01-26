import index from './index'

const fileApi = {
  fileList(params) {
    return index.Get(`/rest/list`, params)
  },

  create(params){
    return index.Post(`/rest/list`, params)
  }
}

export default fileApi

