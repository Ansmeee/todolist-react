export default {
  host: function () {
    let enviment = process.env.NODE_ENV
    let httpstr = !window.location.protocol ? 'http:' : window.location.protocol;
    let apiUrl = '';
    switch (enviment) {
      case "production":
        apiUrl = `${httpstr}//visual.sohu-inc.com`;
        break;
      default:
        apiUrl = `${httpstr}//todo.com`;
    }

    return apiUrl;
  }
}
