import index from './index'

const todoApi = {
  todoList(params) {
    return index.Get(`/todo`, params)
  },

  delete(id) {
    return index.Delete(`/todo/${id}`)
  },

  create(params) {
    return index.Post(`/todo`, params)
  },

  update(params) {
    return index.Put(`/todo`, params)
  },

  updateAttr(params) {
    return index.Put(`/todo/attr`, params)
  }
}

export default todoApi