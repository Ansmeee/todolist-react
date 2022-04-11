function priorityKey2Name(key = "") {
  if (key === "") {
    return ""
  }

  var map = {3: '高', 2: '中', 1: '低', 0: '无'}
  return map[key] ? map[key] : ""
}

function priorityName2Key(name = "") {
  if (name === "") {
    return ""
  }

  var map = {'高': 3, '中': 2, '低': 1, '无': 0}
  return map[name] ? map[name] : ""
}

export {priorityKey2Name, priorityName2Key}