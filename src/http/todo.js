import index from './index'

export default {
  todoList(params) {
    return index.Get(`/todo`, params)
  }
}