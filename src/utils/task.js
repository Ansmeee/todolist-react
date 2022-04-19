function priorityKey2Name(key = "") {
  if (key === "") {
    return ""
  }

  var map = {3: '高', 2: '中', 1: '低', 0: '无'}
  return map[key] ? map[key] : ""
}

function statusKey2Name(key = "") {
  if (key === "") {
    return ""
  }
  var map = {2: '已完成', 1: '进行中', 0: '未开始'}
  return map[key] ? map[key] : ""
}

export {priorityKey2Name, statusKey2Name}