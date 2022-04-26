import index from './index'

const todoApi = {
  uploadUrl() {
    return index.Host() + `/rest/todo/upload`
  },

  todoList(params) {
    return index.Get(`/rest/todo`, params)
  },

  delete(id) {
    return index.Delete(`/rest/todo/${id}`)
  },

  create(params) {
    return index.Post(`/rest/todo`, params)
  },

  update(params) {
    return index.Put(`/rest/todo`, params)
  },

  updateAttr(params) {
    return index.Put(`/rest/todo/attr`, params)
  }
}

export default todoApi