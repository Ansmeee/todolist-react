import React from "react";
import signApi from "../http/sign";
class SecurityCode extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      captchaid: ''
    }
  }
  componentDidMount() {
    this.loadCaptchaid()
  }

  refreshCode() {
    this.loadCaptchaid()
  }

  loadCaptchaid() {
    signApi.captchaid().then(response => {
      if (response.code === 200) {
        this.setState({captchaid: response.data})
      }
    })
  }
  render() {
    if (this.state.captchaid) {
      var source = `${this.state.captchaid}.png`
      return (<img onClick={() => {this.refreshCode()}} height="24px" style={{cursor: 'pointer', }} src={signApi.captchaimg(source)}/>)
    }

    return <div></div>
  }
}

export default SecurityCode;