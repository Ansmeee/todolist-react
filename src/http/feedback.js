import index from "./index"
const feedbackApi = {
  submit(params) {
    return index.Post('/rest/feedback', params)
  }
}

export default feedbackApi