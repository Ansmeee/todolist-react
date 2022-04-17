function priorityKey2Name(key = "") {
  if (key === "") {
    return ""
  }

  var map = {3: '高', 2: '中', 1: '低', 0: '无'}
  return map[key] ? map[key] : ""
}
export {priorityKey2Name}