function priorityClassName(priority = 0) {
  if (priority === 3) {
    return "item-opt item-opt-danger"
  }

  if (priority === 2) {
    return "item-opt item-opt-warning"
  }

  if (priority === 1) {
    return "item-opt item-opt-primary"
  }

  return "item-opt"
}

function deadlineClassName(deadline) {
  var currentDate = Date.now()
  var expireDate = new Date(deadline).getTime()
  var remainDate = expireDate - currentDate
  if (remainDate < 24 * 60 * 60 * 1000) {
    return "item-opt item-opt-danger"
  }

  if (remainDate > 24 * 60 * 60 * 1000 && remainDate <= 3 * 24 * 60 * 60 * 1000) {
    return "item-opt item-opt-warning"
  }

  if (remainDate > 3 * 24 * 60 * 60 * 1000 && remainDate <= 5 * 24 * 60 * 60 * 1000) {
    return "item-opt item-opt-primary"
  }

  return "item-opt"
}

export {priorityClassName, deadlineClassName}