const http = {
  host() {
    let enviment = process.env.NODE_ENV
    let httpstr = !window.location.protocol ? 'http:' : window.location.protocol;
    let apiUrl = '';
    switch (enviment) {
      case "production":
        apiUrl = `${httpstr}//todo.ansme.cc`;
        break;
      default:
        apiUrl = `${httpstr}//todo.com`;
    }

    return apiUrl;
  }
}

export default http
